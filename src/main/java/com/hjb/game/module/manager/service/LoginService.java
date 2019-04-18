package com.hjb.game.module.manager.service;

import com.hjb.game.module.manager.mapper.UserMapper;
import com.hjb.game.module.manager.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.weekend.WeekendSqls;

@Service
public class LoginService {

    @Autowired
    UserMapper userMapper;

    public User login(String userName, String password) {
        WeekendSqls<User> sqls = WeekendSqls.custom();
        sqls.andEqualTo(User :: getUsername, userName);
        sqls.andEqualTo(User :: getPassword, password);
        Example example = Example.builder(User.class).where(sqls).build();
        return userMapper.selectOneByExample(example);
    }

    public User getUserByUserName(String userName) {
        WeekendSqls<User> sqls = WeekendSqls.custom();
        sqls.andEqualTo(User :: getUsername, userName);
        Example example = Example.builder(User.class).where(sqls).build();
        return userMapper.selectOneByExample(example);
    }

    public User emailLogin(String email, String code) {
        WeekendSqls<User> sqls = WeekendSqls.custom();
        sqls.andEqualTo(User :: getEmail, email);
        sqls.andEqualTo(User :: getVerificationCode, code);
        Example example = Example.builder(User.class).where(sqls).build();
        return userMapper.selectOneByExample(example);
    }
}
