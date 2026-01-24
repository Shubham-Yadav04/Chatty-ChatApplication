package com.shubham.chat_server.utils;

import com.shubham.chat_server.model.User;
import com.shubham.chat_server.services.JwtService;
import com.shubham.chat_server.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class JwtAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

@Autowired
    private  JwtService jwtService;
@Autowired
    UserService userService;
@Value("${Frontend_URI}")
public String Frontend_URI;
//
//    public JwtAuthenticationSuccessHandler(JwtService jwtService) {
//        this.jwtService = jwtService;
//    }
@Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                       Authentication authentication)
            throws IOException, ServletException {
        // Correct way to get OAuth2 User

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
//        System.out.println("....." +  oauth2User.toString());
User user = new User();
user.setUsername(oauth2User.getAttribute("name"));
user.setEmail(oauth2User.getAttribute("email"));
user.setProfilePic(oauth2User.getAttribute("picture"));
User createdUser=userService.createUser(user);


        String jwtAccessToken = jwtService.generateToken(oauth2User.getAttribute("email"), 1000 * 60 * 60); // 1 hour
        String jwtRefreshToken = jwtService.generateToken(oauth2User.getAttribute("email"), 1000 * 60 * 60 * 24 * 10); // 10 days

        // Set cookies
        Cookie accessCookie = new Cookie("access_token", jwtAccessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(60 * 60);
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refresh_token", jwtRefreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(10 * 24 * 60 * 60);
        response.addCookie(refreshCookie);
Cookie authenticated= new Cookie("authenticated","true");
    authenticated.setPath("/");
    response.addCookie(authenticated);

    Cookie userId= new Cookie("userId",createdUser.getUserId());
    authenticated.setPath("/");

    response.addCookie(userId);


response.sendRedirect(Frontend_URI+"home");

    }

}
