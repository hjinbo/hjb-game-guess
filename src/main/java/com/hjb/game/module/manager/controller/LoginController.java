package com.hjb.game.module.manager.controller;

import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.service.GetCodeService;
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
            throw new GameException(-99, "用户名或密码不正确");
        }
        logger.info("userName: {}", user.getUsername());
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        boolean special = false;
        if (!"".equals(user.getEmail()) && GetCodeService.specialEmail.equals(user.getEmail())) {
            special = true;
        }
        result.put("special", special);
        return ResultUtils.success(result);
    }

    @RequestMapping("/emailLogin")
    public Result emailLogin(@RequestBody Map<String, Object> map) {
        String email = MapUtils.getStringFromMapNotNull(map, "email");
        String code = MapUtils.getStringFromMapNotNull(map, "code");
        User user = loginService.emailLogin(email, code);
        if (user == null) {
            throw new GameException(-99, "该用户意外消失了");
        }
        logger.info("userName: {}", user.getUsername());
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        boolean special = false;
        if (GetCodeService.specialEmail.equals(email)) {
            special = true;
        }
        result.put("special", special);
        return ResultUtils.success(result);
    }

    @RequestMapping("/userNameExist")
    public Result userNameExist(@RequestBody Map<String, Object> map) {
        String userName = MapUtils.getStringFromMapNotNull(map, "userName");
        User user = loginService.getUserByUserName(userName);
        boolean exist = false;
        if (user != null) {
            exist = true;
        }
        Map<String, Object> result = new HashMap<>();
        result.put("exist", exist);
        return ResultUtils.success(result);
    }
}
