package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.*;
import com.note2quiz.backend.repository.UserRepository;
import com.note2quiz.backend.service.QuizSetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-sets")
@RequiredArgsConstructor
public class QuizSetController {

    private final QuizSetService quizSetService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("인증된 사용자를 찾을 수 없습니다."))
                .getId();
    }

    @PostMapping
    public QuizCreateResponse createQuizSet(@RequestBody QuizCreateRequest request) {
        return quizSetService.createQuizSet(request, getCurrentUserId());
    }

    @GetMapping
    public List<QuizSummaryResponse> getQuizSets() {
        return quizSetService.getQuizSets(getCurrentUserId());
    }

    @GetMapping("/{quizSetId}")
    public QuizDetailResponse getQuizSetDetail(@PathVariable Long quizSetId) {
        return quizSetService.getQuizSetDetail(quizSetId);
    }
}