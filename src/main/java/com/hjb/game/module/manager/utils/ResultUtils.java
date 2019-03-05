package com.hjb.game.module.manager.utils;

public class ResultUtils {

    public static Result success(Object result) {
        Result res = new Result();
        res.setResult(result);
        return res;
    }
}
