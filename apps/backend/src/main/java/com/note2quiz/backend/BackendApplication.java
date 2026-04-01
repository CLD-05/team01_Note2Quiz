package com.note2quiz.backend;

import com.note2quiz.backend.config.SecurityConfig; // import 추가
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import; // import 추가

@Import(SecurityConfig.class) // 설정을 강제로 가져오기
@SpringBootApplication(
    exclude = { org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration.class }
)
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}