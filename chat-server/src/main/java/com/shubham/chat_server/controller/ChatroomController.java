package com.shubham.chat_server.controller;

import com.shubham.chat_server.model.*;
import com.shubham.chat_server.services.ChatRoomServices;
import com.shubham.chat_server.services.MessageServices;
import com.shubham.chat_server.services.UserService;
import com.shubham.chat_server.services.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class ChatroomController {
    @Autowired
    ChatRoomServices chatRoomServices;
    @Autowired
    UserService userService;
@Autowired
    JwtService jwtService;
@Autowired
    MessageServices messageServices;

    // used to get all the chatroom for the specific userId
    @GetMapping("/chatroom/user/{userId}")
    public ResponseEntity<List<ChatRoom>> getUserChatRooms(@PathVariable String userId){
        try{
            User user = userService.getUser(userId);
            if(user!=null){

            // get the chatroom if user exists
            List<ChatRoom> chatRooms= chatRoomServices.getUserChatRooms(userId);
            return new ResponseEntity<>(chatRooms,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            System.out.println("Error occurred while getting the chatroom "+ ex.getMessage());
        }
        return  new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @GetMapping("/chatroom/messages/{id}")
    public ResponseEntity<?> getChatroomMessages(@PathVariable String id){

        try{
          List<Message> messages= chatRoomServices.getAllChatRoomMessages(id);
            if(messages!=null){
                return new ResponseEntity<>(messages,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            System.out.println("Error occurred while getting the chatroom "+ ex.getMessage());
        }
        return  new ResponseEntity<>("chatroom not found", HttpStatus.NOT_FOUND);
    }
    @GetMapping("/chatroom/participants/{id}")
    public ResponseEntity<?> getChatroomParticipants(@PathVariable String roomId){
        try{
            List<User> participants= chatRoomServices.getChatRoomParticipants(roomId);
            if(participants!=null){
                return new ResponseEntity<>(participants,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            System.out.println("error while fetching participants"+ex.getMessage());
        }
        return new ResponseEntity<>("Chat room not found",HttpStatus.NOT_FOUND);
    }

    @GetMapping("/chatroom/{id}")
    public ResponseEntity<?> getChatroom (@PathVariable String roomId){
        try{
            ChatRoom chatRoom= chatRoomServices.getChatroom(roomId);
            if(chatRoom!=null){
                return new ResponseEntity<>(chatRoom,HttpStatus.OK);

            }
        }
        catch(Exception ex){
            System.out.println("error occured "+ex.getMessage());
        }
        return new ResponseEntity<>("No such Chatroom " , HttpStatus.NOT_FOUND);
    }
    @PostMapping("/create.room")

    // just need to create the room abd use the message to get the sender and receiver detail the message will be saved wgeb u will send the message in the topic
    public ResponseEntity<?> createChatroom(@RequestBody ReceivedMessage receivedMessage){
        String receiverId= receivedMessage.getReceiverId();
        String senderId = receivedMessage.getSenderId();
        // find the user with respective usernames
        ChatRoom chatRoom= new ChatRoom();
        chatRoom.setRoomId("20"+senderId+"30"+receiverId);
        List<User> participants= new ArrayList<User>();

        User sender=userService.getUser(senderId);
        User receiver=userService.getUser(receiverId);
        if(sender!=null && receiver!=null) {
            participants.add(sender);
            participants.add(receiver);
            chatRoom.setParticipants(participants);
            try{
                ChatRoom savedChatroom = chatRoomServices.createChatRoom(chatRoom);
                if (savedChatroom != null) {
                    return new ResponseEntity<>(savedChatroom.getId(), HttpStatus.OK);
                }
            }
            catch (Exception e){
System.out.println(e.getMessage());
                return new ResponseEntity<>("Error occurred while creating the chatroom", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("BAD_REQUEST",HttpStatus.BAD_REQUEST);
    }
}
