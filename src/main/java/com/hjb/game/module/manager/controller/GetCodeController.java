package com.hjb.game.module.manager.controller;

import com.hjb.game.module.manager.service.GetCodeService;
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
public class GetCodeController {

    @Autowired
    GetCodeService getCodeService;

    @RequestMapping("/getCode")
    public Result getCode(@RequestBody Map<String, Object> map) {
        String email = MapUtils.getStringFromMapNotNull(map, "email");
        boolean getCodeResult = getCodeService.getCode(email);
        Map<String, Object> result = new HashMap<>();
        result.put("getCodeResult", getCodeResult);
        return ResultUtils.success(result);
    }
}
