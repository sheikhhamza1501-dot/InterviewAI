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
import com.interviewai.backend.dto.DashboardStatsResponse;
import com.interviewai.backend.dto.ScoreTrendResponse;
import com.interviewai.backend.dto.RolePerformanceResponse;
import com.interviewai.backend.dto.MonthlyStatsResponse;
import com.interviewai.backend.dto.WeeklyActivityResponse;
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

    @GetMapping("/dashboard/stats")
    public DashboardStatsResponse getDashboardStats() {

        return interviewService.getDashboardStats();

    }
    @GetMapping("/dashboard/score-trend")
    public List<ScoreTrendResponse> getScoreTrend(

            @RequestParam(required = false) Integer days

    ) {

        return interviewService.getScoreTrend(days);

    }
    @GetMapping("/role-performance")
    public List<RolePerformanceResponse> getRolePerformance(

            @RequestParam(required = false) Integer days

    ) {

        return interviewService.getRolePerformance(days);

    }
    @GetMapping("/monthly-stats")
    public List<MonthlyStatsResponse> getMonthlyStats(

            @RequestParam(required = false) Integer days

    ) {

        return interviewService.getMonthlyStats(days);

    }
    @GetMapping("/weekly-activity")
    public List<WeeklyActivityResponse> getWeeklyActivity() {

        return interviewService.getWeeklyActivity();

    }
}

