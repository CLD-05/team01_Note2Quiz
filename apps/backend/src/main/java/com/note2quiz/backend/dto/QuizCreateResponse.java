package com.note2quiz.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizCreateResponse {
    private Long quizSetId;
    private Long noteId;
    private String title;
    private int questionCount;
    private LocalDateTime createdAt;
}