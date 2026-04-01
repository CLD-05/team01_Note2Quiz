package com.note2quiz.backend.repository;

import com.note2quiz.backend.entity.Note;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
	
	List<Note> findByUserIdOrderByCreatedAtDesc(Long userId);
}