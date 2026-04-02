package com.note2quiz.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSummaryResponse {
    private Long quizSetId;
    private String title;
    private LocalDateTime createdAt;
    private int questionCount;
}