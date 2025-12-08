package com.shubham.chat_server.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.repository.UserRepository;
import com.shubham.chat_server.utils.CloudinaryConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    Cloudinary cloudinary;
//   @Autowired
//PasswordEncoder passwordEncoder;

    public User getUser( String userId){
        return userRepository.findById(userId).get();
    }
    public User getUserByEmail( String email){
        return userRepository.getUserByEmail(email);
    }
    public List<User> getUserByUsername(String email){
        return userRepository.getUserByUsername(email);
    }


//    public List<Message> getSentMessages( String userId){
//        User user =userRepository.findById(userId).get();
//        return user.getMessagesSent();
//    }
//    public List<Message> getReceivedMessage( String userId){
//        User user = getUser(userId);
//        if(user!=null){
//            return user.getMessagesRecieved();
//        }
//        return null;
//    }
    public User createUser(User user){
        try {

            User isEmailExists = userRepository.getUserByEmail(user.getEmail());
            System.out.println("....."+isEmailExists);
            if (isEmailExists==null) {

                // create this user using the detail it is the first time
               User created=userRepository.save(user);
               return created;
            }
//
            else{
                // find the user and return it
                return isEmailExists;
            }
        }
            catch
            (Exception e){
            System.out.println(e.getMessage());

            }
        return null;
        }

        public String updateUsername(String userId,String username){
        try{
            User user= userRepository.findById(userId).get();
            user.setUsername(username);
            userRepository.save(user);
            return "updated";
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
        }
    public String updateBio(String userId,String newBio){
        try{
            User user= userRepository.findById(userId).get();
            user.setBio(newBio);
            userRepository.save(user);
            return "updated";
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
public List<User> getQuerySearch(String query){
        try{
            return userRepository.findQuerySearch(query);
        }
        catch (Exception e ){
            System.out.println(e.getMessage());
            throw e;
        }
}
public List<User> getRandomUser(String email){
        try{
            return userRepository.findRandomUsersExcludingUsername(email,12);
        }
        catch(Exception ex){
            System.out.println(ex.getMessage());
            return null;
        }
}
    public String updateProfilePicture(String userId, String url) throws IOException {

    try{
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfilePic(url);
        userRepository.save(user);

        return url;
    }
    catch (Exception e){
        throw e;
    }

    }
}
