package com.clinicare.service;

import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import com.clinicare.enums.UserRole;
import com.clinicare.model.User;

class AccountEmailServiceTests {

    private JavaMailSender mailSender;
    private AccountEmailService service;

    @BeforeEach
    void setUp() {
        mailSender = org.mockito.Mockito.mock(JavaMailSender.class);
        service = new AccountEmailService(mailSender);
        ReflectionTestUtils.setField(service, "from", "no-reply@clinicare.local");
        ReflectionTestUtils.setField(service, "appBaseUrl", "http://localhost:3000");
    }

    @Test
    void approvalEmailIsSentToUser() {
        service.sendAccountApproved(createUser());
        verify(mailSender).send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));
    }

    @Test
    void resetEmailContainsTokenLink() {
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        service.sendPasswordReset(createUser(), "raw-token");
        verify(mailSender).send(captor.capture());
        org.junit.jupiter.api.Assertions.assertTrue(captor.getValue().getText().contains("token=raw-token"));
    }

    private User createUser() {
        return new User("Profissional", "professional@clinicare.local", "password", UserRole.PROFESSIONAL);
    }
}
