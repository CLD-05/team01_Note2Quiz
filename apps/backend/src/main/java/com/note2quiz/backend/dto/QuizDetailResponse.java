package com.note2quiz.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDetailResponse {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private List<QuizItemResponse> quizzes;
}