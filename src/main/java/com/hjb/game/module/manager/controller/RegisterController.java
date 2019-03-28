package com.hjb.game.module.manager.controller;

import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.service.RegisterService;
import com.hjb.game.module.manager.utils.MapUtils;
import com.hjb.game.module.manager.utils.Result;
import com.hjb.game.module.manager.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/game")
public class RegisterController {

    @Autowired
    RegisterService registerService;

    @RequestMapping("/register")
    public Result register(@RequestBody Map<String, Object> map) {
        String userName = MapUtils.getStringFromMapNotNull(map, "userName");
        String password = MapUtils.getStringFromMapNotNull(map, "password");
        String nickName = MapUtils.getStringFromMapNotNull(map, "nickName");
        boolean registerResult = registerService.register(userName, password, nickName);
        User user = new User();
        if (registerResult) {
            user.setUsername(userName);
            user.setPassword(password);
            user.setNickname(nickName);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("registerResult", registerResult);
        result.put("user", user);
        return ResultUtils.success(result);
    }
}
