package com.hjb.game.module.manager.utils;

public class StringUtils {

    public static boolean isNull(String str) {
        return str == null || str.length() == 0 || "".equals(str);
    }

    public static boolean isNotNull(String str) {
        return !isNull(str);
    }
}
