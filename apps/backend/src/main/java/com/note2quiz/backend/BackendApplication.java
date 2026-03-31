package com.note2quiz.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
		org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration.class })
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
