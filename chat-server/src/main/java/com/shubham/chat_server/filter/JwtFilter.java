package com.shubham.chat_server.filter;

import com.shubham.chat_server.services.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;

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
        System.out.println("inside the filter");
        Cookie[] cookie = request.getCookies();
        String token = null;
        if (cookie != null) {
            for (Cookie c : cookie) {
                if ("access_token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token == null) {

            String refreshToken = null;
            if (cookie != null) {
                for (Cookie c : cookie) {
                    if ("refresh_token".equals(c.getName())) {
                        refreshToken = c.getValue();
                        break;
                    }
                }
            }
            if (refreshToken != null) {

                String username = jwtService.extractToken(refreshToken).getSubject();
                String accessToken = jwtService.generateToken(username, 1000 * 60 * 60);
                Cookie access_token = new Cookie("access_token", accessToken);
                access_token.setSecure(true);
                access_token.setPath("/");
                access_token.setHttpOnly(true);
                access_token.setMaxAge(1000 * 60 * 60);
                response.addCookie(access_token);

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, null);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);


            }
        } else {
            try {

                Claims claims = jwtService.extractToken(token);

                String name = claims.getSubject();
                if (name != null) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(name, null, null);

                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);


                }
            } catch (Exception ex) {

                SecurityContextHolder.clearContext();
            }

        }
        chain.doFilter(request, response);
    }
}




