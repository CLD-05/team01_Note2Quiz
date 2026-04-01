package com.note2quiz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String accessToken; // 프론트엔드가 보관할 열쇠
    private String nickname;    // 화면에 표시할 사용자 이름
}