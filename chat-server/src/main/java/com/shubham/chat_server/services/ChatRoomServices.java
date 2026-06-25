package com.shubham.chat_server.services;

import com.shubham.chat_server.DTO.ChatRoomDTO;
import com.shubham.chat_server.DTO.MessageDTO;
import com.shubham.chat_server.model.ChatRoom;
import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatRoomServices {

@Autowired
    ChatRoomRepository chatRoomRepository;

public List<User> getChatRoomParticipants( String id){
    ChatRoom chatRoom= chatRoomRepository.findById(id).orElseGet(()->null);
   if(chatRoom==null) return null;

   return chatRoom.getParticipants();
}
public List<MessageDTO> getAllChatRoomMessages(String id){
    ChatRoom chatRoom= chatRoomRepository.findById(id).orElseGet(()->null);
    if(chatRoom==null) return  null;
    List<MessageDTO> messages= chatRoom.getMessages().stream().map(this::messageToDTOConvertor
    ).toList();
    return messages;
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
public List<ChatRoomDTO> getUserChatRooms(String userId) {
    // get the chatroom which contain this userId in it
   try{
       List<ChatRoom> rooms= chatRoomRepository.findChatRoomsByUserId(userId);
       if(rooms.isEmpty()) return List.of();
       List<String> roomIds = rooms.stream().map(ChatRoom::getId).toList();

       // 2. Fire Query 2: Get unread counts only for these specific rooms
       Map<String, Long> unreadCountsMap = chatRoomRepository.countUnreadMessagesForRooms(roomIds, userId)
               .stream()
               .collect(Collectors.toMap(
                       row -> (String) row[0], // ChatRoom ID
                       row -> (Long) row[1]    // Unread Count
               ));

       // 3. Map everything into your clean DTO layout
       return rooms.stream().map(room -> new ChatRoomDTO(
               room.getId(),
               room.getIsGroupChat(),
               room.getCreatedAt(),
               // @BatchSize handles this perfectly on the first pass loop!
               room.getParticipants().stream().map(ChatRoomDTO.UserSummaryDTO::new).toList(),
               room.getLastMessage().getMessage(),
               unreadCountsMap.getOrDefault(room.getId(), 0L) // Merging your batch count
       )).toList();
   } catch (RuntimeException e) {
       throw new RuntimeException(e);
   }
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
public MessageDTO messageToDTOConvertor(Message message){
    return MessageDTO.builder().
    receiverId(message.getReceiver().getUserId())
            .roomId(message.getChatroom().getRoomId())
            .content(message.getMessage())
            .senderId(message.getSender().getUserId())
            .receiverName(message.getReceiver().getUsername())
            .senderName(message.getSender().getUsername())
            .messageId(message.getMessageId())
            .status(message.getStatus())
            .date(message.getDate())
    .build();
}
public void saveChatroom(ChatRoom chatRoom){
    chatRoomRepository.save(chatRoom);
}
}