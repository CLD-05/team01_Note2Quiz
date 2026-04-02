package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.NoteResponse;
import com.note2quiz.backend.repository.UserRepository;
import com.note2quiz.backend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("인증된 사용자를 찾을 수 없습니다."))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getNoteList() {
        List<NoteResponse> notes = noteService.getMyNotes(getCurrentUserId());
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponse> getNoteDetail(@PathVariable Long noteId) {
        NoteResponse response = noteService.getNoteDetail(noteId, getCurrentUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long noteId) {
        noteService.deleteNote(noteId, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}