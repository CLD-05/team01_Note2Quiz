package com.note2quiz.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.note2quiz.backend.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 이메일로 사용자가 존재하는지 확인하는 메서드 (나중에 중복 체크 시 사용)
    boolean existsByEmail(String email);
    
    // 이메일로 사용자 정보를 가져오는 메서드 (나중에 로그인 시 사용)
    Optional<User> findByEmail(String email);
}