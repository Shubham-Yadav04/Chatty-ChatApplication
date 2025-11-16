package com.shubham.chat_server.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
@Column
// this for the public use user can share this roomId to any one to join the chat room
private String roomId;

    @ManyToMany
    @JoinTable(
            name = "chatroom_participants",
            joinColumns = @JoinColumn(name = "chatroom_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
private List<User> participants = new ArrayList<>();
@Column
private Boolean isGroupChat=false;

@OneToMany(mappedBy = "chatroom")
@JsonManagedReference
    private List<Message> messages;
@Temporal(TemporalType.TIMESTAMP)

    @Column
    private Date createdAt= new Date();

@OneToOne
private Message lastMessage;
}
