package com.shubham.chat_server.repository;

import com.shubham.chat_server.model.ChatRoom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {

    @Query("SELECT c FROM ChatRoom c JOIN c.participants p WHERE p.id=:userId")
    List<ChatRoom> findByParticipants_Id(String userId);
    ChatRoom findByRoomId(String roomId);
}
