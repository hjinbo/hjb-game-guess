package com.hjb.game.module.manager.controller;

import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.service.LoginService;
import com.hjb.game.module.manager.utils.GameException;
import com.hjb.game.module.manager.utils.MapUtils;
import com.hjb.game.module.manager.utils.Result;
import com.hjb.game.module.manager.utils.ResultUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/game")
public class LoginController {

    private static Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    LoginService loginService;

    @RequestMapping("/login")
    public Result login(@RequestBody Map<String, Object> map) {
        String userName = MapUtils.getStringFromMapNotNull(map, "userName");
        String password = MapUtils.getStringFromMapNotNull(map, "password");
        User user = loginService.login(userName, password);
        if (user == null) {
            throw new GameException(-99, "查询用户失败");
        }
        logger.info("userName: {}", user.getUserName());
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        return ResultUtils.success(result);
    }
}
