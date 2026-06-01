package com.clinicare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.clinicare.model.User;

@Service
public class AccountEmailService {

    private final JavaMailSender mailSender;

    @Value("${clinicare.mail.from:no-reply@clinicare.local}")
    private String from;

    @Value("${clinicare.app.base-url:http://localhost:3000}")
    private String appBaseUrl;

    public AccountEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendAccountApproved(User user) {
        send(
                user.getEmail(),
                "Sua conta CliniCare foi aprovada",
                "Olá, " + user.getName() + ".\n\nSua conta foi aprovada. Acesse: " + appBaseUrl + "/login");
    }

    @Async
    public void sendPasswordReset(User user, String rawToken) {
        send(
                user.getEmail(),
                "Redefinição de senha CliniCare",
                "Olá, " + user.getName() + ".\n\nRedefina sua senha pelo link abaixo. Ele expira em breve:\n"
                        + appBaseUrl + "/reset-password?token=" + rawToken);
    }

    private void send(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
