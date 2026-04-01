package com.note2quiz.backend.service;

import com.note2quiz.backend.dto.NoteResponseDTO;
import com.note2quiz.backend.entity.Note;
import com.note2quiz.backend.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;

    public List<NoteResponseDTO> getMyNotes(Long userId) {
        List<Note> notes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return notes.stream()
                .map(note -> NoteResponseDTO.builder()
                        .id(note.getId())
                        .title(note.getTitle())
                        .content(note.getContent())
                        .createdAt(note.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}