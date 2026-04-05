package com.note2quiz.backend.service;

import com.note2quiz.backend.dto.NoteResponse;
import com.note2quiz.backend.entity.Note;
import com.note2quiz.backend.entity.QuizSet;
import com.note2quiz.backend.repository.NoteRepository;
import com.note2quiz.backend.repository.QuizSetRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {
    private final NoteRepository noteRepository;
    private final QuizSetRepository quizSetRepository;

    // 노트 목록 조회
    @Transactional(readOnly = true)
    public List<NoteResponse> getMyNotes(Long userId) {

        List<Note> notes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // noteId → quizSetId 맵 (N+1 쿼리 방지)
        Map<Long, Long> noteToQuizSetMap = quizSetRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .collect(Collectors.toMap(QuizSet::getNoteId, QuizSet::getId));

        return notes.stream()
                .map(note -> {
                    String content = note.getContent() != null ? note.getContent() : "";
                    int wordCount = content.length();

                    String preview = content.length() > 20
                            ? content.substring(0, 20) + "..."
                            : content;

                    return NoteResponse.builder()
                            .id(note.getId())
                            .quizSetId(noteToQuizSetMap.get(note.getId()))
                            .title(note.getTitle())
                            .createdAt(note.getCreatedAt())
                            .quizCount(note.getQuizCount())
                            .wordCount(wordCount)
                            .preview(preview)
                            .build();
                })
                .collect(Collectors.toList());
    }


    // 노트 상세 조회
    @Transactional(readOnly = true)
    public NoteResponse getNoteDetail(Long noteId, Long userId) {

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("해당 노트를 찾을 수 없습니다."));

        if (!note.getUserId().equals(userId)) {
            throw new IllegalStateException("본인의 노트 조회할 수 있는 권한이 있습니다.");
        }

        Long quizSetId = quizSetRepository.findByNoteId(noteId)
                .map(QuizSet::getId)
                .orElse(null);

        return NoteResponse.builder()
                .id(note.getId())
                .quizSetId(quizSetId)
                .title(note.getTitle())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .build();
    }


    // 노트 삭제
    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 노트를 찾을 수 없습니다."));

        if (!note.getUserId().equals(userId)) {
            throw new IllegalStateException("본인의 노트만 삭제할 수 있습니다.");
        }

        // QuizSet(및 연관된 Quiz들) 먼저 명시적으로 삭제
        quizSetRepository.findByNoteId(noteId)
                .ifPresent(quizSetRepository::delete);

        noteRepository.delete(note);
    }
}
