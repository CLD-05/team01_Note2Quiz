package com.note2quiz.backend.repository;

import com.note2quiz.backend.entity.QuizSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizSetRepository extends JpaRepository<QuizSet, Long> {
    List<QuizSet> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<QuizSet> findByNoteId(Long noteId);
}