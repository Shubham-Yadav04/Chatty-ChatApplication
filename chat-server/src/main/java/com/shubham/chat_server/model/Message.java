package com.shubham.chat_server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shubham.chat_server.Enum.MessageStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages", indexes = {
        // Composite index for optimized unread count aggregation queries
        @Index(name = "idx_msg_unread_calc", columnList = "chatroom_id, status, sender_id")

})
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String messageId;

    @JoinColumn(name="sender_id")
    @ManyToOne
    private User  sender;
    @ManyToOne
    @JoinColumn(name="receiver_id")
    private User receiver;
    private String message;
    @Temporal(value = TemporalType.TIMESTAMP)
    private Date date=new Date();
    @ManyToOne
    @JoinColumn(name = "chatroom_id", nullable = false)
    @JsonBackReference
    private ChatRoom chatroom;
    @Enumerated(EnumType.STRING)
    private MessageStatus status;


}
