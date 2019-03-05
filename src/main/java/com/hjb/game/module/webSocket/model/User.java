package com.hjb.game.module.webSocket.model;

import java.util.Date;

public class User {
    private String userName;
    private int identity;
    private boolean roomMaster;
    private Date loginDate;
    private Date rightAnswerTime;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getIdentity() {
        return identity;
    }

    public void setIdentity(int identity) {
        this.identity = identity;
    }

    public boolean isRoomMaster() {
        return roomMaster;
    }

    public void setRoomMaster(boolean roomMaster) {
        this.roomMaster = roomMaster;
    }


    public Date getLoginDate() {
        return loginDate;
    }

    public void setLoginDate(Date loginDate) {
        this.loginDate = loginDate;
    }

    public Date getRightAnswerTime() {
        return rightAnswerTime;
    }

    public void setRightAnswerTime(Date rightAnswerTime) {
        this.rightAnswerTime = rightAnswerTime;
    }
}
