package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.*;
import com.note2quiz.backend.service.QuizSetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-sets")
@RequiredArgsConstructor
public class QuizSetController {

    private final QuizSetService quizSetService;

    @PostMapping
    public QuizCreateResponse createQuizSet(@RequestBody QuizCreateRequest request) {
        return quizSetService.createQuizSet(request);
    }

    @GetMapping
    public List<QuizSummaryResponse> getQuizSets() {
        return quizSetService.getQuizSets();
    }

    @GetMapping("/{quizSetId}")
    public QuizDetailResponse getQuizSetDetail(@PathVariable Long quizSetId) {
        return quizSetService.getQuizSetDetail(quizSetId);
    }
}