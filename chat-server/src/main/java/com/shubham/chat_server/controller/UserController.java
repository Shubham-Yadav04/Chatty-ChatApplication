package com.shubham.chat_server.controller;

import com.cloudinary.Cloudinary;
import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.MessageStatus;
import com.shubham.chat_server.model.ReceivedMessage;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.services.MessageServices;
import com.shubham.chat_server.services.UserService;
import com.shubham.chat_server.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.HashMap;
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

    @GetMapping("/health-check")
    public String healthCheck(){
        return "Success controllers active";
    }
    @GetMapping("/authenticated/user")
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
    @GetMapping("/user/search/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email){
        List<User> users= userService.getQuerySearch(email);
        if(users!=null){
            return new ResponseEntity<>(users, HttpStatus.OK);
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
//@Value("${cloudinary.api_secret}")
//    private String apiSecret;
//    @PostMapping("cloudinary/signature")
//    public ResponseEntity<?> signature(@RequestBody Map<String,Object> req){
//        try{
//
//            System.out.println(req.toString());
//            long timestamp = System.currentTimeMillis() / 1000;
//            Map<String ,Object> param= new HashMap<>();
//            param.put("folder",req.get("folder"));
//            param.put("timestamp",String.valueOf(timestamp));
//            String sign=cloudinary.apiSignRequest(param, cloudinary.config.apiSecret);
//            Map<String,Object> res= new HashMap<>();
//            res.put("signature",sign);
//            res.put("timestamp",timestamp);
//            System.out.println(res.toString());
//            return new ResponseEntity<>(res,HttpStatus.OK);
//        } catch (RuntimeException e) {
//            throw new RuntimeException(e);
//        }
//    }

    @PostMapping("/user/change-profile")
    public ResponseEntity<?> uploadProfilePic(
            @RequestParam("userId") String userId,
            @RequestParam("newUrl") String  newUrl) {

        System.out.println("new Url " +newUrl);
        try {
            String url = userService.updateProfilePicture(userId, newUrl);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "profilePicUrl", url
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/user/change-name")
    public ResponseEntity<?> updateName(
            @RequestParam("userId") String userId,
            @RequestParam("newName") String newName ) {

        try {
          String str= userService.updateUsername(userId,newName);
          return new ResponseEntity<>(str,HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
    @PutMapping("/user/change-bio")
    public ResponseEntity<?> updateBio(
            @RequestParam("userId") String userId,
            @RequestParam("newBio") String newBio ) {

        try {
          String str = userService.updateBio(userId,newBio);
            return new ResponseEntity<>(str,HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}
