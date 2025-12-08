package com.shubham.chat_server.repository;

import com.shubham.chat_server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User,String> {

    @Query("SELECT u FROM User u WHERE u.username = :username")
     List<User> getUserByUsername(@Param("username") String username);
//    User getUserByUsername(String username);
    @Query("SELECT u FROM User u WHERE u.email= :email")
     User getUserByEmail(@Param("email") String email);
    @Query(value = "SELECT * FROM user WHERE email != :email ORDER BY RAND() LIMIT :limit", nativeQuery = true)
     List<User> findRandomUsersExcludingUsername(@Param("email") String username, @Param("limit") int limit);
    @Query("SELECT u FROM User u WHERE u.email LIKE CONCAT(:email, '%')")
    List<User> findQuerySearch(@Param("email") String email);
}
