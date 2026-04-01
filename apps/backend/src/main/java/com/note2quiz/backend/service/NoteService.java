package com.note2quiz.backend.service;

import com.note2quiz.backend.dto.NoteResponseDTO;
import com.note2quiz.backend.entity.Note;
import com.note2quiz.backend.repository.NoteRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {
    private final NoteRepository noteRepository;

    @Transactional(readOnly = true)
    public List<NoteResponseDTO> getMyNotes(Long userId) {
        
    	List<Note> notes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
    	
        return notes.stream()
                .map(note -> NoteResponseDTO.builder()
                        .id(note.getId())
                        .title(note.getTitle())
                        .createdAt(note.getCreatedAt())
                        .quizSetCount(0)
                        .build())
                .collect(Collectors.toList());
    }
    
    
    @Transactional(readOnly = true)
    public NoteResponseDTO getNoteDetail(Long noteId, Long userId) {
        
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("해당 노트를 찾을 수 없습니다."));

        
        if (!note.getUserId().equals(userId)) {
            throw new IllegalStateException("본인의 노트 조회할 수 있는 권한이 있습니다.");
        }

        
        return NoteResponseDTO.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .build();
    }
    
    
    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 노트를 찾을 수 없습니다."));

        if (!note.getUserId().equals(userId)) {
            throw new IllegalStateException("본인의 노트만 삭제할 수 있습니다.");
        }

        noteRepository.delete(note);
    }
}