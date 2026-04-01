package com.note2quiz.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie; // 추가
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 쿠키에서 토큰을 꺼냅니다. (기존 헤더 로직 대신 아래 메서드 호출)
        String token = resolveTokenFromCookie(request);

        // 2. 토큰이 존재하고 유효한지 검사합니다.
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String email = jwtTokenProvider.getEmail(token);

            // 3. 유효하다면 스프링 시큐리티에 인증 정보를 등록합니다.
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 4. 다음 필터로 넘깁니다.
        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청의 쿠키 목록에서 "accessToken"이라는 이름의 쿠키 값을 찾아 반환합니다.
     */
    private String resolveTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies(); // 요청에 담긴 모든 쿠키 가져오기
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) { // 이름이 일치하는 쿠키 찾기
                    return cookie.getValue(); // 토큰 값 반환
                }
            }
        }
        return null;
    }
}