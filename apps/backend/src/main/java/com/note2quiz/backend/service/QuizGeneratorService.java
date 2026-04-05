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
                
                아래 규칙을 반드시 지켜야한다.
                1. 제목(title)은 학습 노트를 요약한 짧은 제목으로 만든다.
                2. 학습 노트의 내용량과 정보 밀도를 기반으로 문제(quizzes) 개수를 스스로 결정한다.
                3. 문제(quizzes) 개수는 최소 1개, 최대 10개 사이로 생성한다.
                4. 내용이 짧으면 문제(quizzes)를 적게, 내용이 풍부하면 문제(quizzes)를 많이 생성한다.
                5. 의미 없는 문제(quizzes)를 억지로 늘리지 말고, 핵심 개념 위주로만 문제(quizzes)를 만든다.
                6. 각 quiz는 아래 형식을 따라야 한다.
                   - question: 문자열
                   - options: 보기 4개짜리 문자열 배열
                   - answer: 정답 번호 (1~4)
                   - explanation: 해설 문자열
                   - tip: 팁 문자열
                7. 반드시 순수한 JSON 텍스트만 출력한다.
                8. 응답의 첫 글자는 반드시 '{' 이어야 하고, 마지막 글자는 반드시 '}' 이어야 한다.
                9. ```json, ```, 마크다운, 설명문 등 JSON 외의 텍스트를 절대 포함하지 마라.
                
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

    /**
     * Gemini가 간헐적으로 JSON을 ```json ... ``` 마크다운 코드블록으로 감싸 반환하는 경우를 방어한다.
     */
    private String stripMarkdownCodeBlock(String response) {
        String trimmed = response.trim();
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline != -1) {
                trimmed = trimmed.substring(firstNewline + 1).trim();
            }
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.lastIndexOf("```")).trim();
            }
        }
        return trimmed;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseResponse(String response) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper objectMapper =
                    new com.fasterxml.jackson.databind.ObjectMapper();

            String cleaned = stripMarkdownCodeBlock(response);
            return objectMapper.readValue(cleaned, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("AI 응답 JSON 파싱 실패: " + response, e);
        }
    }
}