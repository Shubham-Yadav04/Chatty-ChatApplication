package com.shubham.chat_server.services;

import com.shubham.chat_server.DTO.MessageDTO;
import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.Enum.MessageStatus;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.repository.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

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
@Transactional
    public void markMessageDelivery(String messageId){
        try{
            Message message= messageRepository.findById(messageId).orElseThrow();
           message.setStatus(MessageStatus.DELIVERED);
           messageRepository.save(message);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }
    @Transactional
    public void markMessageSeen(List<MessageDTO> messages){
        List<String> ids = messages.stream()
                .map(MessageDTO::getMessageId)
                .toList();

        messageRepository.updateStatusByIds(
                ids,
                MessageStatus.SEEN
        );
    }
    @Transactional
    public void markMessageSeen(String messageId){
        try{
            System.out.println("this is the messasge " +messageId);
            Message message= messageRepository.findById(messageId).orElseThrow();
            message.setStatus(MessageStatus.SEEN);
            messageRepository.save(message);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }
}
