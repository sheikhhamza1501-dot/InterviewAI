package com.interviewai.backend.dto;

public class CreateInterviewRequest {

    private String jobRole;
    private String experienceLevel;

    public CreateInterviewRequest() {
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
}
