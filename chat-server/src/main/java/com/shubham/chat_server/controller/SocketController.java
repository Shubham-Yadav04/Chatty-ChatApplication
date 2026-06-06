package com.shubham.chat_server.controller;

import com.shubham.chat_server.DTO.MessageDTO;
import com.shubham.chat_server.Enum.MessageStatus;
import com.shubham.chat_server.model.*;

import com.shubham.chat_server.services.ChatRoomServices;
import com.shubham.chat_server.services.MessageServices;
import com.shubham.chat_server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;

@RestController
public class SocketController {

    @Autowired
    UserService userService;
    @Autowired
    private SimpUserRegistry registry;
    @Autowired
    SimpMessagingTemplate simpleMessagingTemplate;
    @Autowired
    ChatRoomServices chatRoomServices;
    @Autowired
    MessageServices messageServices;

    @MessageMapping("/private-message")
    public void sendMessage(@Payload MessageDTO messageDTO){
//System.out.println("message recieved"+ messageDTO.toString());
        Message message = new Message();
        String roomId= messageDTO.getRoomId();
        ChatRoom  chatRoom= chatRoomServices.getChatroom(roomId);
        message.setMessage(messageDTO.getContent());
        message.setReceiver(userService.getUser(messageDTO.getReceiverId()));
        message.setSender(userService.getUser(messageDTO.getSenderId()));
        message.setChatroom(chatRoom);
        message.setStatus(MessageStatus.Delivered);
        message.setDate(messageDTO.getDate());
        chatRoom.setLastMessage(message);
        Message result= messageServices.saveMessage(message);
        chatRoomServices.saveChatroom(chatRoom);
       // using this whenever i will fetch the chatroom i will also get the last message send in that chat room
       if(result!=null){
           System.out.println("message generated ");

           simpleMessagingTemplate.convertAndSendToUser(messageDTO.getReceiverId(),"/queue/private-message", messageDTO);
       }
    }

    @MessageMapping("/typing-status")
    public void typingStatus(@Payload TypingStatus typingStatus){
        System.out.println("in the message :"+typingStatus.getChatroomId());
        String chatroomId= typingStatus.getChatroomId();
        simpleMessagingTemplate.convertAndSend("/topic/typing-status/"+chatroomId,typingStatus);
    }
//    @MessageMapping("/private-message/")
//    public void sendPrivateMessage(@Payload Message message, Principal sender){
//        simpleMessagingTemplate.convertAndSendToUser(message.getReceiver().getUsername(),"/queue/message", message);
//    }
}
    