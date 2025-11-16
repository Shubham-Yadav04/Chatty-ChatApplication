package com.shubham.chat_server.controller;

import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.MessageStatus;
import com.shubham.chat_server.model.ReceivedMessage;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.services.MessageServices;
import com.shubham.chat_server.services.UserService;
import com.shubham.chat_server.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    JwtService jwtService;
    @Autowired
    MessageServices messageServices;
    @GetMapping("authenticated/user")
    public User getAuthenticatedUser(@CookieValue("access_token") String token){
        String email= jwtService.extractToken(token).getSubject();
        System.out.println(email);
        User user= userService.getUserByEmail(email);
        return user;
    }
    @PostMapping("/auth/signup")
    public ResponseEntity<?> createUser(@RequestBody User user){

        User createdUser = userService.createUser(user);

        if(createdUser!=null){

        String accessToken=jwtService.generateToken(user.getEmail(),1000*60*60); // Access token
        String refreshToken=jwtService.generateToken(user.getEmail(),1000*60*60*24*10); // Refresh token for 10 days
        ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(10))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(Map.of("Authenticated", "true"));
        }
        else{
            return ResponseEntity.status(400).body("User already exists");
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username){
       List<User> user= userService.getUserByUsername(username);
        if(user!=null){
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>("user not found", HttpStatus.NOT_FOUND);
    }
    @PostMapping("/receivedMessage/{username}")
    public ResponseEntity<?> receiveMessage(@PathVariable String username , @RequestBody ReceivedMessage receivedMessage){
       Message message= new Message();
       message.setSender(userService.getUser(receivedMessage.getSenderId()));
       message.setReceiver(userService.getUser(receivedMessage.getReceiverId()));
       message.setMessage(receivedMessage.getContent());
       message.setStatus(MessageStatus.Received);
       Message result=messageServices.saveMessage(message);
       if(result!=null){

       return new ResponseEntity<>("Success",HttpStatus.OK);
       }
       return new ResponseEntity<>("Error ", HttpStatusCode.valueOf(500));
    }
    @GetMapping("/user/randomusers")
    public ResponseEntity<?> getRandomUser(@CookieValue("access_token") String accessToken){
        String email= jwtService.extractToken(accessToken).getSubject();
        List<User> result=  userService.getRandomUser( email);
        if(result!=null){
            return new ResponseEntity<>(result,HttpStatus.OK);
        }
        return  new ResponseEntity<>("ERROR",HttpStatusCode.valueOf(500));
    }


}
