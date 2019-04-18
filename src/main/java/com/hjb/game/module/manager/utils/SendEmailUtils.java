package com.hjb.game.module.manager.utils;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class SendEmailUtils {

    private static String fromAddress = "821409523@qq.com";
    private static String fromAddressPassword = "nnydhncpkipqbedg"; // 存在有效期
    private static String emailContent = "您的验证码为: ";
    private static String emailContentExtra = "请登录后进入页面右上角的个人中心中的完善个人信息。";

    public static void sendQQEmail(String email, String code, int status) throws MessagingException {
        Properties properties = new Properties();
        properties.put("mail.transport.protocol", "smtp");// 连接协议
        properties.put("mail.smtp.host", "smtp.qq.com");// 主机名
        properties.put("mail.smtp.port", 465);// 端口号
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.ssl.enable", "true");// 设置是否使用ssl安全连接 ---一般都使用
        properties.put("mail.debug", "false");// 设置是否显示debug信息 true 会在控制台显示相关信息
        // 得到回话对象
        Session session = Session.getInstance(properties);
        // 获取邮件对象
        Message message = new MimeMessage(session);
        // 设置发件人邮箱地址
        message.setFrom(new InternetAddress(fromAddress));
        // 设置收件人邮箱地址
//        message.setRecipients(Message.RecipientType.TO, new InternetAddress[]{new InternetAddress("xxx@qq.com"),new InternetAddress("xxx@qq.com"),new InternetAddress("xxx@qq.com")});
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(email));//一个收件人
        // 设置邮件标题
        message.setSubject("验证码");
        // 设置邮件内容
        message.setText(emailContent + code + "\n\r" + emailContentExtra);
        if (status == -1) {
//            message.setText(specialText);
        }
        // 得到邮差对象
        Transport transport = session.getTransport();
        // 连接自己的邮箱账户
        transport.connect(fromAddress, fromAddressPassword);// 密码为QQ邮箱开通的stmp服务后得到的客户端授权码
        // 发送邮件
        transport.sendMessage(message, message.getAllRecipients());
        transport.close();
    }
}
