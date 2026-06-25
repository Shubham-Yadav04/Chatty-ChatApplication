package com.shubham.chat_server.repository;

import com.shubham.chat_server.DTO.ChatRoomDTO;
import com.shubham.chat_server.model.ChatRoom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    @Query("SELECT c FROM ChatRoom c " +
            "LEFT JOIN FETCH c.lastMessage " +
            "WHERE c.id IN (SELECT cr.id FROM ChatRoom cr JOIN cr.participants p WHERE p.userId = :userId)")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") String userId);

    // Query 2: The Batch Query to get unread counts only for the loaded rooms
    @Query("SELECT m.chatroom.id, COUNT(m) FROM Message m " +
            "WHERE m.chatroom.id IN :roomIds " +
            "AND m.status != 'SEEN' " +
            "AND m.sender.userId != :userId " +
            "GROUP BY m.chatroom.id")
    List<Object[]> countUnreadMessagesForRooms(@Param("roomIds") List<String> roomIds, @Param("userId") String userId);
    ChatRoom findByRoomId(String roomId);
}
