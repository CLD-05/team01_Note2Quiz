package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.NoteResponseDTO;
import com.note2quiz.backend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<NoteResponseDTO>> getNoteList(@RequestParam Long userId) {
        List<NoteResponseDTO> notes = noteService.getMyNotes(userId);
        return ResponseEntity.ok(notes);
    }
    
    
    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponseDTO> getNoteDetail(
            @PathVariable Long noteId, 
            @RequestParam Long userId) {

        NoteResponseDTO response = noteService.getNoteDetail(noteId, userId);
        return ResponseEntity.ok(response);
    }
    
    
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long noteId, 
            @RequestParam Long userId) {
            
        noteService.deleteNote(noteId, userId);
        return ResponseEntity.noContent().build(); 
    }
}
