package com.shubham.chat_server.model;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TypingStatus {
    private String typerName;
    private String chatroomId;
    private boolean typing;
}
