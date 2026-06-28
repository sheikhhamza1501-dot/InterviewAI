package com.interviewai.backend.controller;

import com.interviewai.backend.dto.CreateInterviewRequest;
import com.interviewai.backend.dto.InterviewResponse;
import com.interviewai.backend.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping
    public InterviewResponse createInterview(@RequestBody CreateInterviewRequest request) {
        return interviewService.createInterview(request);
    }
}

