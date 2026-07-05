
package com.interviewai.backend.dto;

import java.util.List;

public class InterviewReportResponse {

    private String jobRole;

    private String experienceLevel;

    private String createdAt;

    private Integer totalQuestions;

    private Double averageScore;

    private List<QuestionReportResponse> questions;

    public InterviewReportResponse() {
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public List<QuestionReportResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionReportResponse> questions) {
        this.questions = questions;
    }
}