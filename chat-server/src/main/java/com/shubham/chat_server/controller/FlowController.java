package com.shubham.chat_server.controller;

//import com.shubham.chat_server.model.LoginDetails;
import com.shubham.chat_server.model.User;
import com.shubham.chat_server.services.UserService;
import com.shubham.chat_server.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;


@RestController

public class FlowController {
@Autowired
    JwtService jwtService;
@Autowired
    UserService userService;

    @GetMapping("/user")
    public Map<String,Object> getUser(@AuthenticationPrincipal OAuth2User oAuth2User){
        return oAuth2User.getAttributes();
    }
@GetMapping("/check/auth")
public ResponseEntity<?> checkAuth(HttpServletRequest request, HttpServletResponse response){
        Cookie [] cookies=request.getCookies();
        String accessToken="";
        String refreshToken="";
        System.out.println("called to check auth");
        for(Cookie c: cookies){
            if(c.getName().equals("access_token")){
                accessToken=c.getValue();
               // the value is inserted by the filter if not present in frontend request but there should be the refresh token otherwise re-login
            }
            if(c.getName().equals("refresh_token")){
                refreshToken=c.getValue();
            }
        }
        if(!accessToken.equals("") && accessToken!=null){
           // inside the jwt filter i am checking the access token and all and adding that based on the refresh token now i just have to add the authenticated cookie in the request

//             authenticated cookies should not be secure so that i can access that in frontend also
            Cookie authenticated = new Cookie("authenticated","true");
            authenticated.setMaxAge(1*60*60);
            authenticated.setPath("/");
            response.addCookie(authenticated);
            return new ResponseEntity<>("Authorized", HttpStatusCode.valueOf(200));

        }

            return new ResponseEntity<>(HttpStatusCode.valueOf(400));

}
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@CookieValue("refresh_token") String refreshToken) {
        if (jwtService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
        }
        String newAccessToken = jwtService.generateToken(jwtService.extractToken(refreshToken).getSubject(), 15 * 60 * 1000);
        return ResponseEntity.ok(Map.of("access_token", newAccessToken));
    }
    @GetMapping("/user/logout")
    public ResponseEntity<?> logoutHandler(HttpServletResponse response){
        System.out.println("inside the logout controller");
        Cookie accessCookie = new Cookie("access_token", "");
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);

        Cookie refreshCookie = new Cookie("refresh_token", "");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);

        Cookie authenticated= new Cookie("authenticated","false");
        authenticated.setPath("/");
        authenticated.setMaxAge(0);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        response.addCookie(authenticated);
        return ResponseEntity.ok()

                .body(Map.of("Authenticated", "false"));

    }
}
