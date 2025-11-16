package com.shubham.chat_server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
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
