package com.note2quiz.backend.controller;

import com.note2quiz.backend.dto.LoginRequest;
import com.note2quiz.backend.dto.LoginResponse;
import com.note2quiz.backend.dto.SignupRequest;
import com.note2quiz.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 1. 회원가입 (이미 완성됨)
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 2. 로그인 (새로 추가)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // 서비스에서 로그인을 수행하고 토큰이 담긴 응답 객체를 받습니다.
        LoginResponse response = authService.login(request);
        
        // HTTP 200 OK와 함께 토큰 정보를 반환합니다.
        return ResponseEntity.ok(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        // 토큰은 "Bearer "로 시작하므로 실제 토큰값만 서비스로 넘길 수 있습니다.
        authService.logout(token.substring(7));
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
    // 토큰 검증 테스트
    @GetMapping("/me")
    public String getMyInfo() {
        return "당신은 인증된 사용자입니다!";
    }
}