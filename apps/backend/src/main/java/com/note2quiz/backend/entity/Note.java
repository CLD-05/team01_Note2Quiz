package com.note2quiz.backend.entity;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notes")
@Getter 
@Setter             
@NoArgsConstructor            
@AllArgsConstructor          
@Builder                      
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(length = 200, nullable = false)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 퀴즈셋 개발 완료 시 주석 제거 예정
//    @Builder.Default 
//    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<QuizSet> quizSets = new ArrayList<>();
}
