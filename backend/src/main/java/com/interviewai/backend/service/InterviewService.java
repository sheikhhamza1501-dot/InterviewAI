package com.interviewai.backend.service;

import com.interviewai.backend.dto.CreateInterviewRequest;
import com.interviewai.backend.dto.InterviewResponse;
import com.interviewai.backend.entity.Interview;
import com.interviewai.backend.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    public InterviewResponse createInterview(CreateInterviewRequest request) {

        Interview interview = new Interview();

        interview.setJobRole(request.getJobRole());
        interview.setExperienceLevel(request.getExperienceLevel());
        interview.setCreatedAt(LocalDateTime.now());

        interview = interviewRepository.save(interview);

        InterviewResponse response = new InterviewResponse();

        response.setId(interview.getId());
        response.setJobRole(interview.getJobRole());
        response.setExperienceLevel(interview.getExperienceLevel());
        response.setCreatedAt(interview.getCreatedAt().toString());

        return response;
    }
}
