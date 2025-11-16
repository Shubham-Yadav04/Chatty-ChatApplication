package com.shubham.chat_server.services;

import com.shubham.chat_server.model.ChatRoom;
import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.MessageStatus;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

@Repository
public class MessageServices {
    @Autowired
    MessageRepository messageRepository;

    public Message getMessage( String messageId){
        return messageRepository.findById(messageId).get();
    }
    public User getSender( String messageId){
        Message message= messageRepository.findById(messageId).get();
        return message.getSender();
    }

    public User getReceiver( String messageId){
        Message message= messageRepository.findById(messageId).get();
        return message.getReceiver();
    }

//    public ChatRoom getChatRoom( String messageId){
//        Message message= messageRepository.findById(messageId).get();
//        if(message!=null){
//            return message.getChatRoom();
//        }
//        return null;
//    }
    public MessageStatus getMessageStatus( String messageId){
        Message message= messageRepository.findById(messageId).get();
        return message.getStatus();
    }
    public Message saveMessage(Message message){
        try{
            Message result= messageRepository.save(message);
            return result;
        }
        catch(Exception ex){
            System.out.println(ex.getMessage());
        }
        return null;
    }

}
