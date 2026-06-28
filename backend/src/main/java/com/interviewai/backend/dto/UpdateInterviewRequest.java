package com.interviewai.backend.dto;

public class UpdateInterviewRequest {


    private String jobRole;
    private String experienceLevel;

    public UpdateInterviewRequest() {
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
