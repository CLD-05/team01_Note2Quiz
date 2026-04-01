package com.note2quiz.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuizGeneratorService {

    private final ChatClient.Builder chatClientBuilder;

    public Map<String, Object> generateQuizSet(String content) {
        String prompt = """
                너는 학습 노트를 바탕으로 객관식 퀴즈를 만들어주는 도우미다.
                
                아래 규칙을 반드시 지켜라.
                1. 제목(title)은 학습 노트를 요약한 짧은 제목으로 만든다.
                2. quizzes는 반드시 4개 만든다.
                3. 각 quiz는 아래 형식을 따라야 한다.
                   - question: 문자열
                   - options: 보기 4개짜리 문자열 배열
                   - answer: 정답 번호 (1~4)
                   - explanation: 해설 문자열
                   - tip: 팁 문자열
                4. 반드시 JSON만 출력한다.
                5. 설명문, 코드블록 표시 ```json 같은 것 절대 붙이지 마라.
                
                출력 형식 예시:
                {
                  "title": "예시 제목",
                  "quizzes": [
                    {
                      "question": "문제 내용",
                      "options": ["보기1", "보기2", "보기3", "보기4"],
                      "answer": 2,
                      "explanation": "해설",
                      "tip": "팁"
                    }
                  ]
                }
                
                학습 노트:
                """ + content;

        ChatClient chatClient = chatClientBuilder.build();

        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return parseResponse(response);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseResponse(String response) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper objectMapper =
                    new com.fasterxml.jackson.databind.ObjectMapper();

            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("AI 응답 JSON 파싱 실패: " + response, e);
        }
    }
}