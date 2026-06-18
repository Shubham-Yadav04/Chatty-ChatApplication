package com.shubham.chat_server.DTO;

import com.shubham.chat_server.Enum.MessageStatus;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MessageAckDTO {
    private String messageId;
    private String senderId;
    private MessageStatus status;
    private String roomId;
}
