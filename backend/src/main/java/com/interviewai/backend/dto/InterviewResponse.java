package com.interviewai.backend.dto;

public class InterviewResponse {

        private Long id;
        private String jobRole;
        private String experienceLevel;
        private String createdAt;
    private Boolean completed;
    private Double averageScore;
    private Boolean favorite;
        public InterviewResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

    public Boolean getCompleted() {
        return completed;
    }
    public Double getAverageScore() {
        return averageScore;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }
    public Boolean getFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }
}
