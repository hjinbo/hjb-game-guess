package com.hjb.game.module.manager.utils;

import java.util.Date;

public class UserNameGenerator {


    public static String generate() {
        String time = String.valueOf(new Date().getTime());
        return "un" + time;
    }
}
