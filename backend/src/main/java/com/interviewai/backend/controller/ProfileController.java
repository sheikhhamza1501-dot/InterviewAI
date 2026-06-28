package com.interviewai.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class ProfileController {
    @GetMapping("/api/profile")
    public String profile() {
        return "Welcome to InterviewAI! You are authenticated.";
    }
}
