package com.note2quiz.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteResponseDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}