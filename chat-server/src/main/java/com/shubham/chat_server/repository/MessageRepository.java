package com.shubham.chat_server.repository;

import com.shubham.chat_server.Enum.MessageStatus;
import com.shubham.chat_server.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,String> {
    @Modifying
    @Query("""
    UPDATE Message m
    SET m.status = :status
    WHERE m.id IN :ids
""")
    void updateStatusByIds(
            @Param("ids") List<String> ids,
            @Param("status") MessageStatus status
    );
}
