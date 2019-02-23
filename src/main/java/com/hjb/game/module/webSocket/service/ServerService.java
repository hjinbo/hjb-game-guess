package com.hjb.game.module.webSocket.service;

import com.alibaba.fastjson.JSONObject;
import com.hjb.game.module.webSocket.model.Message;
import com.hjb.game.module.webSocket.model.User;
import com.hjb.game.module.webSocket.server.MainServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.Session;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class ServerService {

    private static Logger logger = LoggerFactory.getLogger(ServerService.class);

    static ConcurrentHashMap<String, ConcurrentHashMap<Session, User>> rooms = MainServer.rooms;

    public ConcurrentHashMap<String, ConcurrentHashMap<Session, User>> removePlayerBySession(Session session) {
        for (String roomName : rooms.keySet()) {
            ConcurrentHashMap<Session, User> roomMap = rooms.get(roomName);
            if (roomMap.containsKey(session)) {
                User user = roomMap.get(session);
                roomMap.remove(session);
                if (user.isRoomMaster()) {
                    logger.info("房间: {} 的房主退出房间", roomName);
                    // 挑选一个当房主
                    for (Session se : roomMap.keySet()) {
                        User newRoomMaster = roomMap.get(se);
                        newRoomMaster.setRoomMaster(true);
                        roomMap.put(se, newRoomMaster);
                        break;
                    }
                }
                if (roomMap.size() == 0) {
                    logger.info("房间: {}解散", roomName);
                    // 把房间整个移除
                    rooms.remove(roomName);
                } else {
                    rooms.put(roomName, roomMap);
                }
            }
        }
        logger.info("所有房间信息: {}", rooms);
        return rooms;
    }

    public int getAllPlayersNum() {
        int count = 0;
        for (String roomName : rooms.keySet()) {
            for (Session session : rooms.get(roomName).keySet()) {
                count++;
            }
        }
        return count;
    }

    public ConcurrentHashMap<Session, User> getRoomPlayers(String roomName) {
        return rooms.get(roomName);
    }

    private List<User> getRoomUsers(String roomName) {
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        List<User> users = new ArrayList<User>();
        User user;
        for (Session session : roomMap.keySet()) {
            user = roomMap.get(session);
            users.add(user);
        }
        return users;
    }

    public Session getRoomMaster(String roomName) {
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        User user;
        for (Session session : roomMap.keySet()) {
            user = roomMap.get(session);
            if (user.isRoomMaster()) {
                return session;
            }
        }
        return null;
    }

    public String choosePainter(String roomName) {
        Session painter = null;
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        for (Session session : roomMap.keySet()) {
            User user = roomMap.get(session);
            if (user.getIdentity() == 0) { // 0 表示待成为画家
                user.setIdentity(1); // 1 表示已为画家
                roomMap.put(session, user);
                painter = session;
                rooms.put(roomName, roomMap);
                break;
            } else {
                painter = session;
            }
        }
        String userName = "";
        if (painter != null) {
            userName = roomMap.get(painter).getUserName();
            logger.info("userName: {}", userName);
        }
        return userName;
    }

    private Message setSendMessage(Session session, String message) {
        Message receiveMessage = JSONObject.parseObject(message, Message.class);
//        logger.info("本次接收到的消息: {}", receiveMessage);
        String roomName = receiveMessage.getRoomName();
        Message sendMessage = new Message();
        sendMessage.setDate(new Date());
        sendMessage.setRoomName(roomName);
        User user = receiveMessage.getUser();
        int type = receiveMessage.getType();
        switch (type) {
            // 1 表示系统消息
            case 1:
                sendMessage.setType(1);
                Session roomMaster = getRoomMaster(roomName);
                if (roomMaster.equals(session)) {
                    user.setRoomMaster(true);
                } else {
                    user.setRoomMaster(false);
                }
                sendMessage.setRoomUsers(getRoomUsers(roomName));
                break;
            // 2 表示聊天消息
            case 2:
                sendMessage.setType(2);
                sendMessage.setContent(receiveMessage.getContent());
                break;
            // 3 表示图片消息
            case 3:
                sendMessage.setType(3);
                sendMessage.setImage(receiveMessage.getImage());
                break;
            // 4 表示游戏开始消息
            case 4:
                sendMessage.setType(4);
                String painter = choosePainter(roomName);
                sendMessage.setPainter(painter);
                sendMessage.setGameStatus(1);
                user.setIdentity(0);
                if (session.equals(painter)) {
                    user.setIdentity(1);
                    logger.info("选出的画家为: {}", user.getUserName());
                }
                break;
        }
        sendMessage.setUser(user);
//        logger.info("组装后的发送消息: {}", sendMessage);
        return sendMessage;
    }

    public synchronized void sendMessageInRoom(Session session, String message) throws IOException {
        Message receiveMessage = JSONObject.parseObject(message, Message.class);
        String roomName = receiveMessage.getRoomName();
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
//        logger.info("房间: {}中的玩家", roomMap);
        Message sendMessage = setSendMessage(session, message);
        String sendText = JSONObject.toJSONString(sendMessage);
        logger.info("发送的消息: {}", sendText);
        for (Session se : roomMap.keySet()) {
            if (sendMessage.getType() == 1) {
                se.getBasicRemote().sendText(sendText);
            } else if (sendMessage.getType() == 2) {
                se.getBasicRemote().sendText(sendText);
            } else if (sendMessage.getType() == 3 && !se.equals(session)) {
                se.getBasicRemote().sendText(sendText);
            } else if (sendMessage.getType() == 4) {
                se.getBasicRemote().sendText(sendText);
            }
        }
    }
}
