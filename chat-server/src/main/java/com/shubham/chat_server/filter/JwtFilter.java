package com.shubham.chat_server.filter;

import com.shubham.chat_server.services.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;

@Component
public class JwtFilter extends BasicAuthenticationFilter {
@Autowired
    private  JwtService jwtService;

//    @Autowired
    public JwtFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        Cookie[] cookies = request.getCookies();
  String access_token= null;
        String refresh_token= null;
        if(cookies!=null) {
            for (Cookie c : cookies) {
                if (c.getName().equals("access_token")) {
                    access_token = c.getValue();
                }
                if (c.getName().equals("refresh_token")) {
                    refresh_token = c.getValue();
                }
            }
        }
        if (access_token == null) {
            if (refresh_token != null) {

                String email = jwtService.extractToken(refresh_token).getSubject();
                String newAccess_token = jwtService.generateToken(email, 1000 * 60 * 60);
                Cookie access_cookie = new Cookie("access_token", newAccess_token);
                access_cookie.setSecure(true);
                access_cookie.setPath("/");
                access_cookie.setHttpOnly(true);
                access_cookie.setMaxAge(1000 * 60 * 60);
                response.addCookie(access_cookie);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, null, null);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } else {
            try {

                Claims claims = jwtService.extractToken(access_token);

                String email = claims.getSubject();

                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(email, null, null);

                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}




