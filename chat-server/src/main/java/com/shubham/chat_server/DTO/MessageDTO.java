package com.shubham.chat_server.DTO;


import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

    private String receiverId;
    private String senderId;
    private String receiverName;
    private String senderName;
    private String content;
    private String roomId;
    private Date date;
}
