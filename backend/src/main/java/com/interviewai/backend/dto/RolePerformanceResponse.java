package com.interviewai.backend.dto;

public class RolePerformanceResponse {

    private String jobRole;

    private Double averageScore;

    public RolePerformanceResponse() {
    }

    public RolePerformanceResponse(String jobRole, Double averageScore) {
        this.jobRole = jobRole;
        this.averageScore = averageScore;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }
}
