package com.interviewai.backend.controller;

import com.interviewai.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @GetMapping("/test")
    public String testApiKey() {
        return aiService.getApiKey();
    }
    @GetMapping("/generate")
    public String generateQuestions(  @RequestParam Long interviewId,
                                      @RequestParam String jobRole,
                                      @RequestParam String experienceLevel) {
        return aiService.generateQuestions(interviewId,
                jobRole,
                experienceLevel);
    }
}
