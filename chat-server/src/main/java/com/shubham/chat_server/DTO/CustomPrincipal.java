package com.shubham.chat_server.DTO;

import lombok.*;

import java.security.Principal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomPrincipal implements Principal {
    private String name;
    private String email;
    @Override
    public String getName() {
        return this.name;
    }
}
