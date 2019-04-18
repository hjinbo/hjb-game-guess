package com.hjb.game.module.manager.controller;

import com.hjb.game.module.manager.model.User;
import com.hjb.game.module.manager.service.ChangeInfoService;
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
public class ChangeInfoController {

    @Autowired
    ChangeInfoService changeInfoService;

    @RequestMapping("/changeInfo")
    public Result changeInfo(@RequestBody Map<String, Object> map) {
        String userName = MapUtils.getStringFromMapNotNull(map, "userName");
        String password = MapUtils.getStringFromMapNotNull(map, "password");
        String nickName = MapUtils.getStringFromMapNotNull(map, "nickName");
        int id = MapUtils.getIntegerFromMapNotNull(map, "id");
        User user = new User();
        user.setId(id);
        user.setUsername(userName);
        user.setNickname(nickName);
        user.setPassword(password);
        boolean changeInfoResult = changeInfoService.changeInfo(user);
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("changeInfoResult", changeInfoResult);
        return ResultUtils.success(result);
    }
}
