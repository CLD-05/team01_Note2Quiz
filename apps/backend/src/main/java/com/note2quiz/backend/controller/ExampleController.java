package com.note2quiz.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExampleController {
	@GetMapping("/api/test")
    public String test() {
        return "Backend Server is running! 🚀";
    }
}
