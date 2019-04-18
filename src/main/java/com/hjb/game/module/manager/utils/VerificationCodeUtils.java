package com.hjb.game.module.manager.utils;

import java.util.Random;

public class VerificationCodeUtils {

    /**
     * 随机产生四位数字的验证码
     * @return
     */
    public static String generateCode() {
        Random r = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            sb.append(r.nextInt(10));
        }
        return sb.toString();
    }
}
