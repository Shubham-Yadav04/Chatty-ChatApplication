package com.shubham.chat_server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypingStatus {
    private String typerName;
    private String chatroomId;
    private boolean typing;
}
