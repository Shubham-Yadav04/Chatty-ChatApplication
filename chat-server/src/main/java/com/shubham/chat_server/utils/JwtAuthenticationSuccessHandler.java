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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.Duration;

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
    ResponseCookie accessCookie = ResponseCookie.from("access_token", jwtAccessToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(Duration.ofHours(1))
            .build();

// refresh token cookie
    ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", jwtRefreshToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(Duration.ofDays(10))
            .build();

// authenticated flag cookie (frontend-readable)
    ResponseCookie authenticatedCookie = ResponseCookie.from("authenticated", "true")
            .httpOnly(false)   // frontend can read this if needed
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(Duration.ofDays(10))
            .build();

// userId cookie (frontend-readable)
    ResponseCookie userIdCookie = ResponseCookie.from("userId", createdUser.getUserId())
            .httpOnly(false)   // frontend can read this if needed
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(Duration.ofDays(10))
            .build();

// add all cookies to response headers
    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, authenticatedCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, userIdCookie.toString());
response.sendRedirect(Frontend_URI+"home");

    }
}
