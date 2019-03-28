package com.hjb.game.module.manager.controller;

import com.hjb.game.module.manager.service.ChangeImgService;
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
public class ChangeImgController {

    @Autowired
    ChangeImgService changeImgService;

    @RequestMapping("/changeImg")
    public Result changeImg(@RequestBody Map<String, Object> map) {
        String userName = MapUtils.getStringFromMapNotNull(map, "userName");
        String imgUrl = MapUtils.getStringFromMapNotNull(map, "imgUrl");
        String imgPostionX = MapUtils.getStringFromMapNotNull(map, "imgPositionX");
        String imgPostionY = MapUtils.getStringFromMapNotNull(map, "imgPositionY");
        String img = imgUrl + "," + imgPostionX + "," + imgPostionY;
        boolean changeResult = changeImgService.change(userName, img);
        Map<String, Object> result = new HashMap<>();
        result.put("changeResult", changeResult);
        return ResultUtils.success(result);
    }
}
