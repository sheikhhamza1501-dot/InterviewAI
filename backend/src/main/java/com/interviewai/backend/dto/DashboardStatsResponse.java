package com.interviewai.backend.dto;

public class DashboardStatsResponse {

    private Integer totalInterviews;

    private Integer completedInterviews;

    private Integer pendingInterviews;

    private Double averageScore;

    private Double bestScore;

    private Long totalFavorites;

    private Double completionRate;

    private Double completedPercentage;

    private Double pendingPercentage;

    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

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
    public Long getTotalFavorites() {
        return totalFavorites;
    }

    public void setTotalFavorites(Long totalFavorites) {
        this.totalFavorites = totalFavorites;
    }
    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Double getCompletedPercentage() {
        return completedPercentage;
    }

    public void setCompletedPercentage(Double completedPercentage) {
        this.completedPercentage = completedPercentage;
    }

    public Double getPendingPercentage() {
        return pendingPercentage;
    }

    public void setPendingPercentage(Double pendingPercentage) {
        this.pendingPercentage = pendingPercentage;
    }
}
