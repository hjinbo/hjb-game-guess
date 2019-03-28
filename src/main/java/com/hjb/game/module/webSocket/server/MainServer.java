package com.hjb.game.module.webSocket.server;

import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.service.LoginService;
import com.hjb.game.module.webSocket.MyApplicationContextAware;
import com.hjb.game.module.webSocket.model.Player;
import com.hjb.game.module.webSocket.service.ServerService;
import org.apache.catalina.core.ApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ContextLoader;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/webSocket/{roomName}/{userName}")
public class MainServer {

    private static Logger logger = LoggerFactory.getLogger(MainServer.class);
    public static ConcurrentHashMap<String, ConcurrentHashMap<Session, Player>> rooms = new ConcurrentHashMap<String, ConcurrentHashMap<Session, Player>>();
    /*
        status 游戏的状态位;
        0: 初始化，等待玩家进入房间;
        1: 房主已点击开始， 并且已选择出画家;
        2: 下一轮画家的选择;
        3: 游戏结束;
     */
    private static int status = 0;
    private LoginService loginService = (LoginService) MyApplicationContextAware.getApplicationContext().getBean(LoginService.class);
    // 连接时执行
    @OnOpen
    public void onOpen(Session session, @PathParam("roomName") String roomName,
                       @PathParam("userName") String userName) {
        logger.info("房间名: {}, 登录者: {}", roomName, userName);
        ServerService service = new ServerService();
        ConcurrentHashMap<Session, Player> roomMap = service.getRoomPlayers(roomName);
        Player player = new Player();
        player.setUserName(userName);
        User user = loginService.getUserByUserName(userName);
        String nickName;
        String img = "";
        if (user == null) {
            logger.error("用户名:【" + userName + "】找不到");
            nickName = userName;
        } else {
            nickName = user.getNickname();
            if (nickName == null || "".equals(nickName)) {
                nickName = userName;
            }
            img = user.getImg();
        }
        player.setNickName(nickName);
        player.setImg(img);
        player.setLoginDate(new Date());
        player.setIdentity(0); // 0 表示等待画画的身份
        if (roomMap == null || roomMap.size() == 0) {
            player.setRoomMaster(true); // 第一个进入房间的人为房主
            ConcurrentHashMap<Session, Player> emptyRoom = new ConcurrentHashMap<Session, Player>();
            emptyRoom.put(session, player);
            rooms.put(roomName, emptyRoom);
        } else {
            player.setRoomMaster(false); // 后加入的人为成员
            roomMap.put(session, player);
            rooms.put(roomName, roomMap);
        }
//        logger.info("所有房间信息: {}", rooms);
    }

    // 关闭时执行
    @OnClose
    public void onClose(Session session) {
        ServerService service = new ServerService();
        rooms = service.removePlayerBySession(session);
        logger.info("还剩连接总人数: {}", service.getAllPlayersNum());
    }

    // 连接错误时执行
    @OnError
    public void onError(Session session, Throwable error) {
        logger.info("sessionId: {}的会话建立发生错误", session.getId());
        ServerService service = new ServerService();
        rooms = service.removePlayerBySession(session);
        logger.info("还剩连接总人数: {}", service.getAllPlayersNum());
        error.printStackTrace();
    }

    // 收到消息时执行
    @OnMessage
    public void onMessage(Session session, String message) {
        ServerService service = new ServerService();
        try {
            service.sendMessageInRoom(session, message);
        } catch (Exception e) {
            logger.error("发送消息异常: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}