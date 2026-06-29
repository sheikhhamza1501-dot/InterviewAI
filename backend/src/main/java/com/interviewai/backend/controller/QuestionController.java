package com.interviewai.backend.controller;

import com.interviewai.backend.dto.CreateQuestionRequest;
import com.interviewai.backend.dto.QuestionResponse;
import com.interviewai.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @PostMapping
    public QuestionResponse createQuestion(@RequestBody CreateQuestionRequest request) {
        return questionService.createQuestion(request);
    }
    @GetMapping("/interview/{interviewId}")
    public List<QuestionResponse> getQuestionsByInterview(@PathVariable Long interviewId) {
        return questionService.getQuestionsByInterview(interviewId);
    }
}
