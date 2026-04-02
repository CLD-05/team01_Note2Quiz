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

    // 💡 핵심: 토큰에서 직접 userId를 꺼내는 메서드
    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("인증된 사용자를 찾을 수 없습니다."))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getNoteList() { // 👈 여기에 @RequestParam userId가 절대 있으면 안 됩니다!
        List<NoteResponse> notes = noteService.getMyNotes(getCurrentUserId());
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponse> getNoteDetail(@PathVariable Long noteId) { // 👈 여기도 삭제!
        NoteResponse response = noteService.getNoteDetail(noteId, getCurrentUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long noteId) { // 👈 여기도 삭제!
        noteService.deleteNote(noteId, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}