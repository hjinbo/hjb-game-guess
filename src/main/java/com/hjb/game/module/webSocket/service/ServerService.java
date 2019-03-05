package com.hjb.game.module.webSocket.service;

import com.alibaba.fastjson.JSONObject;
import com.hjb.game.module.webSocket.model.Message;
import com.hjb.game.module.webSocket.model.User;
import com.hjb.game.module.webSocket.server.MainServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.Session;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ServerService {

    private static Logger logger = LoggerFactory.getLogger(ServerService.class);

    private static SimpleDateFormat sdf = new SimpleDateFormat("hhmmss");

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

    private List<User> getRoomUsers(String roomName) throws Exception {
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        if (roomMap == null) {
            throw new Exception("房间: " + roomName + "没有玩家");
        }
        List<User> users = new ArrayList<User>();
        User user;
        for (Session session : roomMap.keySet()) {
            user = roomMap.get(session);
            users.add(user);
        }
        users.sort(new Comparator<User>() {
            public int compare(User o1, User o2) {
                return Integer.parseInt(sdf.format(o1.getLoginDate())) - Integer.parseInt(sdf.format(o2.getLoginDate()));
            }
        });
        logger.info("当前房间的用户: {}", users);
        return users;
    }

    public String getRoomMaster(String roomName) {
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        User user;
        for (Session session : roomMap.keySet()) {
            user = roomMap.get(session);
            if (user.isRoomMaster()) {
                return user.getUserName();
            }
        }
        return "";
    }

    private Session getSessionByUserNameAndRoomName(String userName, String roomName) {
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        for (Session session : roomMap.keySet()) {
            if (userName.equals(roomMap.get(session).getUserName())) {
                return session;
            }
        }
        return null;
    }

    /**
     * 画家的选举方式改为按登录先后来选举
     * @param roomName
     * @return
     */
    public String choosePainter(String roomName) {
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        List<User> users = new ArrayList<>();
        User user;
        for (Session session : roomMap.keySet()) {
            user = roomMap.get(session);
            if (user.getIdentity() != 1) {
                users.add(user);
            }
        }
        users.sort(new Comparator<User>() {
            @Override
            public int compare(User o1, User o2) {
                return Integer.parseInt(sdf.format(o1.getLoginDate())) - Integer.parseInt(sdf.format(o2.getLoginDate()));
            }
        });
        String painterName = "";
        // 选出第一个登录者为画家
        if (users.size() > 0) {
            User u = users.get(0);
            painterName = u.getUserName();
            // 根据roomName和painterName找出对应的session
            Session painterSession = getSessionByUserNameAndRoomName(painterName, roomName);
            u.setIdentity(1); // 1 表示已为画家
            roomMap.put(painterSession, u);
            rooms.put(roomName, roomMap);
        }
        logger.info("选出的画家为: {}", painterName);
        return painterName;
    }

    private Message setSendMessage(Session session, String message) throws Exception {
        Message receiveMessage = JSONObject.parseObject(message, Message.class);
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
                String roomMaster = getRoomMaster(roomName);
                sendMessage.setRoomMaster(roomMaster);
                sendMessage.setRoomUsers(getRoomUsers(roomName));
                break;
            // 2 表示聊天消息
            case 2:
                sendMessage.setType(2);
                sendMessage.setContent(receiveMessage.getContent());
                if (!receiveMessage.getPainter().equals(user.getUserName()) && receiveMessage.getContent().equals(receiveMessage.getAnswer())) {
                    logger.info("非画家作答正确");
                    user.setRightAnswerTime(new Date());
                }
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
                sendMessage.setGameStatus(1); // 1表示房主点击游戏开始
                sendMessage.setGameTime(60);
                break;
            // 5 表示用户离开消息
            case 5:
                sendMessage.setType(5);
                sendMessage.setExitUserName(user.getUserName());
                removePlayerBySession(session);
                sendMessage.setRoomUsers(getRoomUsers(roomName));
                break;
        }
        sendMessage.setUser(user);
//        logger.info("组装后的发送消息: {}", sendMessage);
        return sendMessage;
    }

    public synchronized void sendMessageInRoom(Session session, String message) throws Exception {
        Message receiveMessage = JSONObject.parseObject(message, Message.class);
        String roomName = receiveMessage.getRoomName();
        ConcurrentHashMap<Session, User> roomMap = getRoomPlayers(roomName);
        if (roomMap == null) {
            throw new Exception("房间不存在");
        }
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
            } else if (sendMessage.getType() == 5) {
                se.getBasicRemote().sendText(sendText);
            }
        }
    }
}
