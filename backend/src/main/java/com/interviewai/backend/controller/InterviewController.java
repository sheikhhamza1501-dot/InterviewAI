package com.interviewai.backend.controller;

import com.interviewai.backend.dto.CreateInterviewRequest;
import com.interviewai.backend.dto.InterviewResponse;
import com.interviewai.backend.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import com.interviewai.backend.dto.UpdateInterviewRequest;
import com.interviewai.backend.dto.InterviewReportResponse;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping
    public InterviewResponse createInterview(@RequestBody CreateInterviewRequest request) {
        return interviewService.createInterview(request);
    }
    @GetMapping
    public List<InterviewResponse> getAllInterviews() {
        return interviewService.getAllInterviews();
    }
    @GetMapping("/{id}")
    public InterviewResponse getInterviewById(@PathVariable Long id) {
        return interviewService.getInterviewById(id);
    }
    @GetMapping("/{id}/report")
    public InterviewReportResponse getInterviewReport(@PathVariable Long id) {

        return interviewService.getInterviewReport(id);

    }
    @PutMapping("/{id}")
    public InterviewResponse updateInterview(
            @PathVariable Long id,
            @RequestBody UpdateInterviewRequest request) {

        return interviewService.updateInterview(id, request);
    }
    @DeleteMapping("/{id}")
    public String deleteInterview(@PathVariable Long id) {
        return interviewService.deleteInterview(id);
    }
}

