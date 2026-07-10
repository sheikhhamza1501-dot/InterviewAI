package com.interviewai.backend.dto;

public class ScoreTrendResponse {


    private String date;
    private double score;

    public ScoreTrendResponse() {
    }

    public ScoreTrendResponse(String date, double score) {
        this.date = date;
        this.score = score;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
