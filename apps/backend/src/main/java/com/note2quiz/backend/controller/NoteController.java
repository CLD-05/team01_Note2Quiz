package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.NoteResponseDTO;
import com.note2quiz.backend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

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
    
//    @GetMapping("/{noteId}")
//    public ResponseEntity<NoteResponseDTO> getNoteDetail(@PathVariable Long noteId) {
//        // 여기서도 일단 임시 유저 1번으로 테스트!
//        Long currentUserId = 1L; 
//
//        // 지현이가 서비스에 만든 getNoteDetail 호출!
//        NoteResponseDTO response = noteService.getNoteDetail(noteId, currentUserId);
//        return ResponseEntity.ok(response);
//    }
}
