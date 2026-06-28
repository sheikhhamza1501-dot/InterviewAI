package com.interviewai.backend.service;

import com.interviewai.backend.dto.CreateInterviewRequest;
import com.interviewai.backend.dto.InterviewResponse;
import com.interviewai.backend.entity.Interview;
import com.interviewai.backend.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import com.interviewai.backend.dto.UpdateInterviewRequest;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.interviewai.backend.entity.User;
import java.time.LocalDateTime;

@Service
public class InterviewService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    public InterviewResponse createInterview(CreateInterviewRequest request) {

        Interview interview = new Interview();

        interview.setJobRole(request.getJobRole());
        interview.setExperienceLevel(request.getExperienceLevel());
        interview.setCreatedAt(LocalDateTime.now());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        interview.setUser(user);

        interview = interviewRepository.save(interview);

        InterviewResponse response = new InterviewResponse();

        response.setId(interview.getId());
        response.setJobRole(interview.getJobRole());
        response.setExperienceLevel(interview.getExperienceLevel());
        response.setCreatedAt(interview.getCreatedAt().toString());

        return response;
    }
    public List<InterviewResponse> getAllInterviews() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Interview> interviews = interviewRepository.findByUser(user);

        List<InterviewResponse> responseList = new ArrayList<>();

        for (Interview interview : interviews) {

            InterviewResponse response = new InterviewResponse();

            response.setId(interview.getId());
            response.setJobRole(interview.getJobRole());
            response.setExperienceLevel(interview.getExperienceLevel());
            response.setCreatedAt(interview.getCreatedAt().toString());

            responseList.add(response);
        }

        return responseList;
    }
    public InterviewResponse getInterviewById(Long id) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        InterviewResponse response = new InterviewResponse();

        response.setId(interview.getId());
        response.setJobRole(interview.getJobRole());
        response.setExperienceLevel(interview.getExperienceLevel());
        response.setCreatedAt(interview.getCreatedAt().toString());

        return response;
    }
    public InterviewResponse updateInterview(Long id, UpdateInterviewRequest request) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interview.setJobRole(request.getJobRole());
        interview.setExperienceLevel(request.getExperienceLevel());

        interview = interviewRepository.save(interview);

        InterviewResponse response = new InterviewResponse();

        response.setId(interview.getId());
        response.setJobRole(interview.getJobRole());
        response.setExperienceLevel(interview.getExperienceLevel());
        response.setCreatedAt(interview.getCreatedAt().toString());

        return response;
    }
    public String deleteInterview(Long id) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interviewRepository.delete(interview);

        return "Interview deleted successfully";
    }
}
