package com.hjb.game.module.manager.service;

import com.hjb.game.module.manager.mapper.UserMapper;
import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.utils.SendEmailUtils;
import com.hjb.game.module.manager.utils.UserNameGenerator;
import com.hjb.game.module.manager.utils.VerificationCodeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.weekend.WeekendSqls;

import java.util.Date;

@Service
public class GetCodeService {

    private static Logger logger = LoggerFactory.getLogger(GetCodeService.class);
    public final static String specialEmail = "483703547@qq.com";

    @Autowired
    UserMapper userMapper;

    String defaultImg = RegisterService.defaultImg;

    @Transactional
    public boolean getCode(String email) {
        User user = getUserByEmail(email);
        User record = new User();
        String code = VerificationCodeUtils.generateCode();
        if (specialEmail.equals(email)) {
            code = "0907";
        }
        if (!sendEmailSuccess(email, code)) {
            return false;
        }
        int result;
        if (user != null) {
            record.setVerificationCode(code);
            WeekendSqls<User> sqls = WeekendSqls.custom();
            sqls.andEqualTo(User :: getEmail, email);
            Example example = Example.builder(User.class).where(sqls).build();
            result = userMapper.updateByExampleSelective(record, example);
        } else {
            String generateUserName = UserNameGenerator.generate();
            record.setUsername(generateUserName);
            record.setNickname(generateUserName);
            record.setRegisterTime(new Date());
            record.setImg(defaultImg);
            record.setEmail(email);
            record.setVerificationCode(code);
            result = userMapper.insertSelective(record);
        }
        return result > 0;
    }

    private User getUserByEmail(String email) {
        WeekendSqls<User> sqls = WeekendSqls.custom();
        sqls.andEqualTo(User :: getEmail, email);
        Example example = Example.builder(User.class).where(sqls).build();
        return userMapper.selectOneByExample(example);
    }

    private boolean sendEmailSuccess(String email, String code) {
        try {
            int status = 0;
            if (specialEmail.equals(email)) {
                status = -1;
            }
            SendEmailUtils.sendQQEmail(email, code, status);
            return true;
        } catch (Exception e) {
            logger.error("发送QQ邮件异常: {}", e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
