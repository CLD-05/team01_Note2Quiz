package com.note2quiz.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizItemResponse {
    private Long id;
    private String question;
    private List<String> options;
    private Integer answer;
    private String explanation;
    private String tip;
}