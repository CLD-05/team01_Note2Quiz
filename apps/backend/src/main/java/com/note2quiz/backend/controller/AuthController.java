package com.note2quiz.backend.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders; // 추가
import org.springframework.http.ResponseCookie; // 추가
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.note2quiz.backend.config.JwtTokenProvider; // 추가
import com.note2quiz.backend.dto.LoginRequest;
import com.note2quiz.backend.dto.LoginResponse;
import com.note2quiz.backend.dto.SignupRequest;
import com.note2quiz.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider; // 쿠키 생성을 위해 주입 추가

    // 1. 회원가입 (기존과 동일)
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 2. 로그인 (쿠키 설정 로직 추가)
    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@Valid @RequestBody LoginRequest request) {
        // 서비스에서 로그인을 수행하고 토큰 문자열을 받아옵니다.
        // (주의: 기존 LoginResponse 객체 대신 토큰 문자열만 받도록 AuthService 수정이 필요할 수 있습니다.)
        LoginResponse loginResponse = authService.login(request);
        String token = loginResponse.getAccessToken();
        
        // 1. 쿠키 생성 (HttpOnly 설정 포함)
        ResponseCookie cookie = jwtTokenProvider.createCookie(token);
        
        // 2. 응답 헤더(SET_COOKIE)에 실어서 보냅니다.
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("nickname", loginResponse.getNickname())); // 이제 바디에 토큰을 담지 않아도 브라우저가 자동으로 쿠키를 저장합니다.
    }

    // 3. 로그아웃 (서버에서 쿠키를 삭제하도록 명령)
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // 수명이 0인 빈 쿠키를 생성하여 브라우저의 쿠키를 덮어씌워 삭제합니다.
        ResponseCookie cookie = jwtTokenProvider.createEmptyCookie();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("로그아웃 되었습니다.");
    }

    // 4. 토큰 검증 테스트
    @GetMapping("/me")
    public String getMyInfo() {
        return "당신은 인증된 사용자입니다!";
    }
}