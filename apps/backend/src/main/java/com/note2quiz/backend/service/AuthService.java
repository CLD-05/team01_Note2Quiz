package com.note2quiz.backend.service;

import com.note2quiz.backend.config.JwtTokenProvider; // 1. 임포트 추가
import com.note2quiz.backend.dto.LoginRequest;     // 2. 임포트 추가
import com.note2quiz.backend.dto.LoginResponse;    // 3. 임포트 추가
import com.note2quiz.backend.dto.SignupRequest;
import com.note2quiz.backend.entity.User;
import com.note2quiz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // 4. JWT 프로바이더 추가

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .build();

        userRepository.save(user);
    }

    // 5. 로그인 로직 추가
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션
    public LoginResponse login(LoginRequest request) {
        // 이메일로 유저 확인
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 비밀번호 일치 확인 (사용자가 입력한 비번 vs DB의 암호화된 비번)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getEmail());

        // 토큰과 닉네임을 응답 객체에 담아서 반환
        return new LoginResponse(token, user.getNickname());
    }
    
    public void logout(String token) {
        // 실제 운영 환경에서는 Redis 같은 곳에 토큰을 '블랙리스트'로 등록하여 
        // 유효시간이 남았어도 못 쓰게 막는 로직을 넣습니다.
        // 지금은 프론트엔드에게 성공 응답을 주는 것으로 마무리합니다.
    }
}