package com.interviewai.backend.dto;

public class DashboardStatsResponse {

    private Integer totalInterviews;

    private Integer completedInterviews;

    private Integer pendingInterviews;

    private Double averageScore;

    private Double bestScore;

    public DashboardStatsResponse() {
    }

    public Integer getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(Integer totalInterviews) {
        this.totalInterviews = totalInterviews;
    }

    public Integer getCompletedInterviews() {
        return completedInterviews;
    }

    public void setCompletedInterviews(Integer completedInterviews) {
        this.completedInterviews = completedInterviews;
    }

    public Integer getPendingInterviews() {
        return pendingInterviews;
    }

    public void setPendingInterviews(Integer pendingInterviews) {
        this.pendingInterviews = pendingInterviews;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Double getBestScore() {
        return bestScore;
    }

    public void setBestScore(Double bestScore) {
        this.bestScore = bestScore;
    }
}
