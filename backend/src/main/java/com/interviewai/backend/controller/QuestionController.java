package com.interviewai.backend.controller;

import com.interviewai.backend.dto.CreateQuestionRequest;
import com.interviewai.backend.dto.QuestionResponse;
import com.interviewai.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.interviewai.backend.dto.UpdateAnswerRequest;
import org.springframework.http.ResponseEntity;
import com.interviewai.backend.dto.EvaluationResponse;

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
    @PutMapping("/{id}/answer")
    public ResponseEntity<String> updateAnswer(
            @PathVariable Long id,
            @RequestBody UpdateAnswerRequest request) {

        questionService.updateAnswer(id, request);

        return ResponseEntity.ok("Answer saved successfully");
    }
    @PostMapping("/{id}/evaluate")
    public EvaluationResponse evaluateAnswer(
            @PathVariable Long id) {

        return questionService.evaluateAnswer(id);
    }


}
