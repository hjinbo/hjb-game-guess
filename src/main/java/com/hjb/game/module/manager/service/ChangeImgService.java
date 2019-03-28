package com.hjb.game.module.manager.service;

import com.hjb.game.module.manager.mapper.UserMapper;
import com.hjb.game.module.manager.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.weekend.WeekendSqls;

@Service
public class ChangeImgService {

    @Autowired
    UserMapper userMapper;

    public boolean change(String userName, String img) {
        WeekendSqls<User> sqls = WeekendSqls.custom();
        sqls.andEqualTo(User :: getUsername, userName);
        Example example = Example.builder(User.class).where(sqls).build();
        User user = new User();
        user.setImg(img);
        int result = userMapper.updateByExampleSelective(user, example);
        return result > 0;
    }
}
