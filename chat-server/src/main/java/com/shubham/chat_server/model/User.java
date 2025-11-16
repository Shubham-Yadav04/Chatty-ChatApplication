package com.shubham.chat_server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.annotation.processing.Generated;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private String userId;

    @Column(nullable = true)
    private String username;
    @Column(nullable = false , unique=true)
    private String email;

    @Column
    private String password;

    @Column
    private String profilePic;

//    @OneToMany(mappedBy = "sender")
//    private List<Message> messagesSent;
//
//    @OneToMany(mappedBy = "receiver")
//    private List<Message> messagesRecieved;


    @Enumerated(EnumType.STRING)
    private Status status;

}
