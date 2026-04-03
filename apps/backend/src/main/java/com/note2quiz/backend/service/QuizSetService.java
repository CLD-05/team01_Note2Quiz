package com.note2quiz.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.note2quiz.backend.dto.*;
import com.note2quiz.backend.entity.Note;
import com.note2quiz.backend.entity.Quiz;
import com.note2quiz.backend.entity.QuizSet;
import com.note2quiz.backend.repository.NoteRepository;
import com.note2quiz.backend.repository.QuizSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuizSetService {

    private final QuizSetRepository quizSetRepository;
    private final QuizGeneratorService quizGeneratorService;
    private final NoteRepository noteRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public QuizCreateResponse createQuizSet(QuizCreateRequest request, Long userId) {

        Map<String, Object> generated = quizGeneratorService.generateQuizSet(request.getContent());

        String title = (String) generated.get("title");
        List<Map<String, Object>> quizzes = (List<Map<String, Object>>) generated.get("quizzes");

        // 1. note 먼저 저장
        Note note = Note.builder()
                .userId(userId)
                .title(title)
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .quizCount(quizzes.size())
                .build();
        
        Note savedNote = noteRepository.save(note);

        // 2. quizSet 저장
        QuizSet quizSet = QuizSet.builder()
                .noteId(savedNote.getId())
                .userId(userId)
                .title(title)
                .createdAt(LocalDateTime.now())
                .build();

        for (Map<String, Object> item : quizzes) {
            try {
                String optionsJson = objectMapper.writeValueAsString(item.get("options"));

                Quiz quiz = Quiz.builder()
                        .question((String) item.get("question"))
                        .options(optionsJson)
                        .answer((Integer) item.get("answer"))
                        .explanation((String) item.get("explanation"))
                        .tip((String) item.get("tip"))
                        .build();

                quizSet.addQuiz(quiz);
            } catch (Exception e) {
                throw new RuntimeException("퀴즈 JSON 변환 실패", e);
            }
        }

        QuizSet savedQuizSet = quizSetRepository.save(quizSet);

        return QuizCreateResponse.builder()
                .quizSetId(savedQuizSet.getId())
                .noteId(savedNote.getId())
                .title(title)
                .questionCount(savedQuizSet.getQuizzes().size())
                .createdAt(savedQuizSet.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<QuizSummaryResponse> getQuizSets(Long userId) {
        return quizSetRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(quizSet -> QuizSummaryResponse.builder()
                        .quizSetId(quizSet.getId())
                        .title(quizSet.getTitle())
                        .createdAt(quizSet.getCreatedAt())
                        .questionCount(quizSet.getQuizzes().size())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public QuizDetailResponse getQuizSetDetail(Long quizSetId) {
        QuizSet quizSet = quizSetRepository.findById(quizSetId)
                .orElseThrow(() -> new IllegalArgumentException("퀴즈셋이 존재하지 않습니다. id=" + quizSetId));

        Note note = noteRepository.findById(quizSet.getNoteId()).orElse(null);
        String noteContent = note != null ? note.getContent() : null;

        List<QuizItemResponse> quizzes = quizSet.getQuizzes()
                .stream()
                .map(quiz -> {
                    try {
                        List<String> options = objectMapper.readValue(
                                quiz.getOptions(),
                                new TypeReference<List<String>>() {}
                        );

                        return QuizItemResponse.builder()
                                .id(quiz.getId())
                                .question(quiz.getQuestion())
                                .options(options)
                                .answer(quiz.getAnswer())
                                .explanation(quiz.getExplanation())
                                .tip(quiz.getTip())
                                .build();
                    } catch (Exception e) {
                        throw new RuntimeException("options JSON 파싱 실패", e);
                    }
                })
                .toList();

        return QuizDetailResponse.builder()
                .id(quizSet.getId())
                .title(quizSet.getTitle())
                .createdAt(quizSet.getCreatedAt())
                .quizzes(quizzes)
                .noteContent(noteContent)
                .build();
    }
}