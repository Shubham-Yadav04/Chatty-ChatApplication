package com.shubham.chat_server.controller;

import com.shubham.chat_server.model.*;

import com.shubham.chat_server.services.ChatRoomServices;
import com.shubham.chat_server.services.MessageServices;
import com.shubham.chat_server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class SocketController {

    @Autowired
    UserService userService;
    @Autowired
    SimpMessagingTemplate simpleMessagingTemplate;
    @Autowired
    ChatRoomServices chatRoomServices;
    @Autowired
    MessageServices messageServices;

    @MessageMapping("/topic/chatroom")
    public void sendMessage(@Payload ReceivedMessage receivedMessage){
//System.out.println("message recieved"+ receivedMessage.toString());
        Message message = new Message();
        String roomId= receivedMessage.getRoomId();
        ChatRoom  chatRoom= chatRoomServices.getChatroom(roomId);
        message.setMessage(receivedMessage.getContent());
        message.setReceiver(userService.getUser(receivedMessage.getReceiverId()));
        message.setSender(userService.getUser(receivedMessage.getSenderId()));
        message.setChatroom(chatRoom);
        message.setStatus(MessageStatus.Delivered);
        chatRoom.setLastMessage(message);
        Message result= messageServices.saveMessage(message);
        chatRoomServices.saveChatroom(chatRoom);
       // using this whenever i will fetch the chatroom i will also get the last message send in that chat room
       if(result!=null){
           System.out.println("message generated ");
           simpleMessagingTemplate.convertAndSend("/topic/chatroom/" + roomId, message);
       }

    }

    @MessageMapping("/queue")
    public void typingStatus(@Payload TypingStatus typingStatus){
        System.out.println("in the message :"+typingStatus.getChatroomId());
        String chatroomId= typingStatus.getChatroomId();
        simpleMessagingTemplate.convertAndSend("/queue/typing-status/"+chatroomId,typingStatus);
    }
    @MessageMapping("/private-message/{receiverId}")
    public void sendPrivateMessage(@Payload Message message, Principal sender){
        simpleMessagingTemplate.convertAndSendToUser(message.getReceiver().getUsername(),"/queue/message", message);
    }
}
    