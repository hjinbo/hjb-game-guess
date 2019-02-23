package com.hjb.game.module.webSocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
@ServerEndpoint("/imgWebSocket")
public class ImgWebSocketTest {
    private static Logger logger = LoggerFactory.getLogger(ImgWebSocketTest.class);

    private static Set<Session> set = new HashSet<Session>();

    @OnOpen
    public void onOpen(Session session) {
        set.add(session);
        logger.info("{} logger success, 当前人数: {}", session.getId(), set.size());
    }

    @OnClose
    public void onClose(Session session) {
        set.remove(set);
        logger.info("{} close, 剩余人数: {}", session.getId(), set.size());
    }

    @OnError
    public void onError(Session session, Throwable error) {
        logger.info("{} error", session.getId());
        error.printStackTrace();
    }

    private static ExecutorService cachedThreadPool = Executors.newCachedThreadPool();

    @OnMessage
    public void onMessage(Session session, String message) throws IOException {
        final String img = message;
        final Session curSesion = session;
        logger.info("图片: {}", img);
        synchronized (this) {
            sendMessage(curSesion, img);
        }
//        cachedThreadPool.execute(new Runnable() {
//            @Override
//            public void run() {
//                try {
//                    logger.info("本次群发由线程: {}发送", Thread.currentThread().getName());
//                    sendMessage(curSesion, img);
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//        });
    }

    private void sendMessage(Session session, String message) throws IOException {
        for (Session se : set) {
            if (!se.equals(session)) {
                se.getBasicRemote().sendText(message);
            }
        }
    }



}
