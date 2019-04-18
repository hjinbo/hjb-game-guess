package com.hjb.game.module.manager.service;

import com.hjb.game.module.manager.mapper.UserMapper;
import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.utils.GameException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.weekend.WeekendSqls;

@Service
public class ChangeInfoService {

    @Autowired
    UserMapper userMapper;

    public boolean changeInfo(User user) {
        int result = userMapper.updateByPrimaryKeySelective(user);
        return result > 0;
    }
}
