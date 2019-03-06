package com.hjb.game.module.manager.utils;

public class GameException extends RuntimeException {

    public GameException(int errorNo, String errorInfo, Throwable e) {
        super(errorInfo, e);
    }

    public GameException(int errorNo, String errorInfo) {
        super(errorInfo);
    }
}
