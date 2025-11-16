package com.shubham.chat_server.services;

import com.shubham.chat_server.model.ChatRoom;
import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;


import java.util.Date;
import java.util.List;

@Service
public class ChatRoomServices {

@Autowired
    ChatRoomRepository chatRoomRepository;

public List<User> getChatRoomParticipants( String id){
    ChatRoom chatRoom= chatRoomRepository.findById(id).orElseGet(()->null);
   if(chatRoom==null) return null;

   return chatRoom.getParticipants();
}
public List<Message> getAllChatRoomMessages( String id){
    ChatRoom chatRoom= chatRoomRepository.findById(id).orElseGet(()->null);
    if(chatRoom==null) return  null;
    return chatRoom.getMessages();
}
public Date getChatRoomCreationDate(String id){
    ChatRoom chatRoom= chatRoomRepository.findById(id).orElseGet(()->null);
    if(chatRoom==null) return  null;
    return chatRoom.getCreatedAt();
}
// consider it when going to create a group chat
public boolean isGroupChat( String id){
    ChatRoom chatRoom= chatRoomRepository.findById(id).orElseGet(()->null);
    if(chatRoom==null) return  false;
    return chatRoom.getIsGroupChat();
}
public List<ChatRoom> getUserChatRooms(String userId) {
    // get the chatroom which contain this userId in it
    return chatRoomRepository.findByParticipants_Id(userId);
}

public ChatRoom getChatroom(String id){
    return chatRoomRepository.findById(id).orElseGet(()->null);
}


public ChatRoom createChatRoom(ChatRoom chatRoom){
    try{
        return chatRoomRepository.save(chatRoom);
    }
    catch(Exception ex ){
        System.out.println(ex.getMessage());
        return null;
    }
}
public void saveChatroom(ChatRoom chatRoom){
    chatRoomRepository.save(chatRoom);
}
}