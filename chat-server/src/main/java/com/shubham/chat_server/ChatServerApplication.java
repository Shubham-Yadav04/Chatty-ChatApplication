package com.shubham.chat_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

@SpringBootApplication
@EnableJpaRepositories
public class ChatServerApplication {	

	public static void main(String[] args) {
		SpringApplication.run(ChatServerApplication.class, args);

	}
}
	