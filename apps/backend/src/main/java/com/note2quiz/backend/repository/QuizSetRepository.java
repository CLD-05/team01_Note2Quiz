package com.note2quiz.backend.repository;

import com.note2quiz.backend.entity.QuizSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizSetRepository extends JpaRepository<QuizSet, Long> {
    List<QuizSet> findByUserIdOrderByCreatedAtDesc(Long userId);
}