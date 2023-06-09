package webapp.others.service;

import jakarta.mail.MessagingException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;
import webapp.others.dto.EmailMessageDTO;

@Component
public interface EmailService {
    void sendEmail(String name, String to, String subject, String text) throws Exception;

    EmailMessageDTO receiveEmails(String name, String to, String subject, String text) throws MessagingException;

    void sendPassword(String to, String text) throws MessagingException;
    void sendCancelEvent(String name, String to, String eventName, String text) throws MessagingException;

    void send(SimpleMailMessage simpleMessage) throws MailException;

    void send(SimpleMailMessage... simpleMessages) throws MailException;

    // void sendSimpleEmail(String to, String text);
}