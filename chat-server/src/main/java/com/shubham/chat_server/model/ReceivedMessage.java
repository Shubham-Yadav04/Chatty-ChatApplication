package com.shubham.chat_server.model;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceivedMessage {

    private String receiverId;
    private String senderId;
    private String receiverName;
    private String senderName;
    private String content;
    private String roomId;
}
