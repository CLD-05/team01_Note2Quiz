package com.note2quiz.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonInclude;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteResponse {

    private Long id;
    private Long quizSetId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Integer quizCount;
    private Integer wordCount;
    private String preview;
}