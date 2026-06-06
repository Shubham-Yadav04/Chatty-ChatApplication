package com.shubham.chat_server.EventListner;

import org.springframework.context.event.EventListener;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;

public class ConncetionEvent {
@EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        Principal principal = event.getUser();
        System.out.println("Connected user = " +
                (principal != null ? principal.getName() : "null"));
    }
    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        Principal principal = event.getUser();
        System.out.println("Subscribed user = " +
                (principal != null ? principal.getName() : "null"));
    }
}
