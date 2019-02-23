package com.hjb.game.module.webSocket.model;

import java.util.Date;
import java.util.List;

public class Message {
    private int type;
    private String content;
    private String image;
    private String roomName;
    private Date date;
    private User user;
    private List<User> roomUsers;
    private String painter;
    private int gameStatus;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<User> getRoomUsers() {
        return roomUsers;
    }

    public void setRoomUsers(List<User> roomUsers) {
        this.roomUsers = roomUsers;
    }

    public String getPainter() {
        return painter;
    }

    public void setPainter(String painter) {
        this.painter = painter;
    }

    public int getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(int gameStatus) {
        this.gameStatus = gameStatus;
    }

    @Override
    public String toString() {
        return "Message{" +
                "type=" + type +
                ", content='" + content + '\'' +
                ", image='" + image + '\'' +
                ", roomName='" + roomName + '\'' +
                ", date=" + date +
                ", user=" + user +
                ", roomUsers=" + roomUsers +
                ", painter='" + painter + '\'' +
                ", gameStatus=" + gameStatus +
                '}';
    }
}
