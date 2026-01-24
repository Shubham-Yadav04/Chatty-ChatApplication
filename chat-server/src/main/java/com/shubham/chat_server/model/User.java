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
@Table(name = "users")
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
@Column
private String bio;
    @Enumerated(EnumType.STRING)
    private Status status;

}
