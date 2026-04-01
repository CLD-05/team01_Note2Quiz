package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.NoteResponseDTO;
import com.note2quiz.backend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;

    @GetMapping
    public List<NoteResponseDTO> getNoteList() {
        // 테스트용: 현재 로그인 유저 ID를 1로 고정
        Long currentUserId = 1L; 
        return noteService.getMyNotes(currentUserId);
    }
    
    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponseDTO> getNoteDetail(@PathVariable Long noteId) {
    	// 테스트용: 현재 로그인 유저 ID를 1로 고정
        Long currentUserId = 1L; 

        NoteResponseDTO response = noteService.getNoteDetail(noteId, currentUserId);
        return ResponseEntity.ok(response);
    }
}
