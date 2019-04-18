package com.hjb.game.module.manager.model;

import java.util.Date;
import javax.persistence.*;

@Table(name = "t_user")
public class User {
    @Id
    private Integer id;

    private String username;

    private String password;

    private String nickname;

    private String img;

    @Column(name = "register_time")
    private Date registerTime;

    @Column(name = "change_password_time")
    private Date changePasswordTime;

    @Column(name = "verification_code")
    private String verificationCode;

    private String email;

    /**
     * @return id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username
     */
    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    /**
     * @return password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password
     */
    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    /**
     * @return nickname
     */
    public String getNickname() {
        return nickname;
    }

    /**
     * @param nickname
     */
    public void setNickname(String nickname) {
        this.nickname = nickname == null ? null : nickname.trim();
    }

    /**
     * @return img
     */
    public String getImg() {
        return img;
    }

    /**
     * @param img
     */
    public void setImg(String img) {
        this.img = img == null ? null : img.trim();
    }

    /**
     * @return register_time
     */
    public Date getRegisterTime() {
        return registerTime;
    }

    /**
     * @param registerTime
     */
    public void setRegisterTime(Date registerTime) {
        this.registerTime = registerTime;
    }

    /**
     * @return change_password_time
     */
    public Date getChangePasswordTime() {
        return changePasswordTime;
    }

    /**
     * @param changePasswordTime
     */
    public void setChangePasswordTime(Date changePasswordTime) {
        this.changePasswordTime = changePasswordTime;
    }

    /**
     * @return verification_code
     */
    public String getVerificationCode() {
        return verificationCode;
    }

    /**
     * @param verificationCode
     */
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode == null ? null : verificationCode.trim();
    }

    /**
     * @return email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email
     */
    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }
}