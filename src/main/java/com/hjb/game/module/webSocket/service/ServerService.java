package com.hjb.game.module.webSocket.service;

import com.alibaba.fastjson.JSONObject;
import com.hjb.game.module.webSocket.model.Message;
import com.hjb.game.module.webSocket.model.Player;
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
    private Date startTime = null;
    static ConcurrentHashMap<String, ConcurrentHashMap<Session, Player>> rooms = MainServer.rooms;

    public ConcurrentHashMap<String, ConcurrentHashMap<Session, Player>> removePlayerBySession(Session session) {
        for (String roomName : rooms.keySet()) {
            ConcurrentHashMap<Session, Player> roomMap = rooms.get(roomName);
            if (roomMap.containsKey(session)) {
                Player player = roomMap.get(session);
                roomMap.remove(session);
                if (player.isRoomMaster()) {
                    logger.info("房间: {} 的房主退出房间", roomName);
                    // 挑选一个当房主
                    for (Session se : roomMap.keySet()) {
                        Player newRoomMaster = roomMap.get(se);
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

    public ConcurrentHashMap<Session, Player> getRoomPlayers(String roomName) {
        return rooms.get(roomName);
    }

    private List<Player> getRoomUsers(String roomName) throws Exception {
        ConcurrentHashMap<Session, Player> roomMap = getRoomPlayers(roomName);
        if (roomMap == null) {
            throw new Exception("房间: " + roomName + "没有玩家");
        }
        List<Player> players = new ArrayList<Player>();
        Player player;
        for (Session session : roomMap.keySet()) {
            player = roomMap.get(session);
            players.add(player);
        }
        players.sort(new Comparator<Player>() {
            public int compare(Player o1, Player o2) {
                return Integer.parseInt(sdf.format(o1.getLoginDate())) - Integer.parseInt(sdf.format(o2.getLoginDate()));
            }
        });
        logger.info("当前房间的用户: {}", players);
        return players;
    }

    public String getRoomMaster(String roomName) {
        ConcurrentHashMap<Session, Player> roomMap = getRoomPlayers(roomName);
        Player user;
        for (Session session : roomMap.keySet()) {
            user = roomMap.get(session);
            if (user.isRoomMaster()) {
                return user.getUserName();
            }
        }
        return "";
    }

    private Session getSessionByUserNameAndRoomName(String userName, String roomName) {
        ConcurrentHashMap<Session, Player> roomMap = getRoomPlayers(roomName);
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
        ConcurrentHashMap<Session, Player> roomMap = getRoomPlayers(roomName);
        List<Player> players = new ArrayList<>();
        Player player;
        for (Session session : roomMap.keySet()) {
            player = roomMap.get(session);
            if (player.getIdentity() != 1) {
                players.add(player);
            }
        }
        players.sort(new Comparator<Player>() {
            @Override
            public int compare(Player o1, Player o2) {
                return Integer.parseInt(sdf.format(o1.getLoginDate())) - Integer.parseInt(sdf.format(o2.getLoginDate()));
            }
        });
        String painterName = "";
        // 选出第一个登录者为画家
        if (players.size() > 0) {
            Player p = players.get(0);
            painterName = p.getUserName();
            // 根据roomName和painterName找出对应的session
            Session painterSession = getSessionByUserNameAndRoomName(painterName, roomName);
            p.setIdentity(1); // 1 表示已为画家
            roomMap.put(painterSession, p);
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
        Player player = receiveMessage.getUser();
        logger.info("{}", player);
        int type = receiveMessage.getType();
        startTime = receiveMessage.getStartTime();
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
                if (!receiveMessage.getPainter().equals(player.getUserName())
                        && receiveMessage.getContent().equals(receiveMessage.getAnswer())) {
                    logger.info("非画家作答正确");
                    player.setRightAnswerTime(new Date());
                    ConcurrentHashMap<Session, Player> map = getRoomPlayers(roomName);
                    map.put(session, player);
                    rooms.put(roomName, map);
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
                sendMessage.setExitUserName(player.getUserName());
                removePlayerBySession(session);
                sendMessage.setRoomUsers(getRoomUsers(roomName));
                break;
            // 6 表示单局游戏结束消息
            case 6:
                sendMessage.setType(6);
                // 当前房间算分（bug待修改,算分机制调整）
                sendMessage.setRoomUsers(getScores(roomName));
                break;
            // 7 表示总游戏结束消息
            case 7:
                sendMessage.setType(7);
                // 重置当前房间
                reset(roomName);
                break;
        }
        sendMessage.setUser(player);
//        logger.info("组装后的发送消息: {}", sendMessage);
        return sendMessage;
    }

    public synchronized void sendMessageInRoom(Session session, String message) throws Exception {
        Message receiveMessage = JSONObject.parseObject(message, Message.class);
        String roomName = receiveMessage.getRoomName();
        ConcurrentHashMap<Session, Player> roomMap = getRoomPlayers(roomName);
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
            } else if (sendMessage.getType() == 6) {
                se.getBasicRemote().sendText(sendText);
            } else if (sendMessage.getType() == 7) {
                se.getBasicRemote().sendText(sendText);
            }
        }
    }

    /**
     * 获得当前房间内玩家的分数并回写到内存中
     * @param roomName
     * @return
     * @throws Exception
     */
    private List<Player> getScores(String roomName) throws Exception {
        List<Player> players = getRoomUsers(roomName);
        // 此集合保存非画家的作答用户
        List<Player> newPlayers = new ArrayList<>();
        for (Player user : players) {
            if (user.getIdentity() != 1) {
                if (user.getRightAnswerTime() != null) {
                    user.setTimeInterval(Integer.parseInt(sdf.format(user.getRightAnswerTime())) - Integer.parseInt(sdf.format(startTime)));
                } else {
                    // 未答对的用户时间间隔为负数
                    user.setTimeInterval(-1);
                }
                newPlayers.add(user);
            }
        }
        // 按时间间隔正序排序
        newPlayers.sort(new Comparator<Player>() {
            @Override
            public int compare(Player o1, Player o2) {
                return o1.getTimeInterval() - o2.getTimeInterval();
            }
        });
        logger.info("按时间间隔排序完: {}", newPlayers);
        ConcurrentHashMap<Session, Player> map = getRoomPlayers(roomName);
        List<Player> scored = new ArrayList<>();
        Player p;
        int index = 0; // 记录正确作答的索引
        for (int i = 0; i < newPlayers.size(); i++) {
            p = newPlayers.get(i);
            if (p.getTimeInterval() > 0) {
                if (index == 0) {
                    p.setScore(p.getScore() + 9);
                }
                if (index == 1) {
                    p.setScore(p.getScore() + 6);
                }
                if (index == 2) {
                    p.setScore(p.getScore() + 6);
                }
                if (index == 3) {
                    p.setScore(p.getScore() + 3);
                }
                if (index == 4) {
                    p.setScore(p.getScore() + 3);
                }
                if (index == 5) {
                    p.setScore(p.getScore() + 2);
                }
                if (index == 6) {
                    p.setScore(p.getScore() + 1);
                }
                index++;
            } else {
                p.setScore(p.getScore());
            }
            // 将设置完分数的用户回写到rooms
            for (Session session : map.keySet()) {
                if (map.get(session).getUserName().equals(p.getUserName())) {
                    map.put(session, p);
                }
            }
            rooms.put(roomName, map);
            scored.add(p);
        }
        logger.info("评分完的: {}", scored);
        return scored;
    }

    private void reset(String roomName) {
        ConcurrentHashMap<Session, Player> map = getRoomPlayers(roomName);
        for (Session session : map.keySet()) {
            Player player = map.get(session);
            // 重置画家身份
            player.setIdentity(0);
            // 重置正确作答时间
            player.setRightAnswerTime(null);
            // 重置时间间隔和分数
            player.setTimeInterval(0);
            player.setScore(0);
        }
    }
}
