package com.hjb.game.module.manager.service;

import com.hjb.game.module.manager.mapper.UserMapper;
import com.hjb.game.module.manager.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class RegisterService {

    @Autowired
    UserMapper userMapper;

    private String defaultImg = "\"http://localhost:8083/youGuess/pic/img/hometx.png\",0px,0px";

    public boolean register(String userName, String password, String nickName) {
        User user = new User();
        user.setUsername(userName);
        user.setPassword(password);
        user.setNickname(nickName);
        user.setRegisterTime(new Date());
        user.setImg(defaultImg);
        int result = userMapper.insertSelective(user);
        return result > 0;
    }
}
