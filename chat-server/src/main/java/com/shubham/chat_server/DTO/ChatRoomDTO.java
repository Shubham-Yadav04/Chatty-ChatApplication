package com.shubham.chat_server.DTO;

import com.shubham.chat_server.model.Message;
import com.shubham.chat_server.model.User;
import lombok.*;

import java.util.Date;
import java.util.List;


public record ChatRoomDTO (
    String roomId,
    Boolean isGroupChat,
    Date createdAt,
    List<UserSummaryDTO> participants,
    String lastMessage,
    Long unreadMessageCount
) {
        public record UserSummaryDTO(
                String userId,
                String username,
                String profilePic
        ) {
            // Convenience constructor to map from User Entity
            public UserSummaryDTO(User user) {
                this(user.getUserId(), user.getUsername(), user.getProfilePic());
            }
        }
}

