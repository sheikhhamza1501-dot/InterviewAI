package com.interviewai.backend.service;

import com.interviewai.backend.dto.*;
import com.interviewai.backend.entity.Interview;
import com.interviewai.backend.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.interviewai.backend.entity.User;
import java.time.LocalDateTime;

import com.interviewai.backend.entity.Question;
import com.interviewai.backend.repository.QuestionRepository;

@Service
public class InterviewService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private QuestionRepository questionRepository;

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
            response.setCompleted(interview.getCompleted());
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
        response.setCompleted(interview.getCompleted());

        return response;
    }
    public String deleteInterview(Long id) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interviewRepository.delete(interview);

        return "Interview deleted successfully";
    }

    public InterviewReportResponse getInterviewReport(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        InterviewReportResponse response = new InterviewReportResponse();

        response.setJobRole(interview.getJobRole());
        response.setExperienceLevel(interview.getExperienceLevel());
        response.setCreatedAt(interview.getCreatedAt().toString());

        List<Question> questionList = questionRepository.findByInterview(interview);

        List<QuestionReportResponse> reportQuestions = new ArrayList<>();

        for (Question question : questionList) {

            QuestionReportResponse questionResponse = new QuestionReportResponse();

            questionResponse.setQuestion(question.getQuestionText());

            questionResponse.setAnswer(question.getAnswer());

            questionResponse.setScore(question.getScore());

            if (question.getFeedback() != null) {

                String feedback = question.getFeedback();

                String[] parts = feedback.split("\\n\\nCorrect Answer:\\n");

                String strengthsAndWeaknesses = parts[0];

                String correctAnswer = parts.length > 1 ? parts[1] : "";

                String[] sections = strengthsAndWeaknesses.split("\\n\\nWeaknesses:\\n");

                String strengthsSection = sections[0]
                        .replace("Strengths:\n", "");

                String weaknessesSection = sections.length > 1
                        ? sections[1]
                        : "";

                questionResponse.setStrengths(
                        Arrays.asList(strengthsSection.split("\\n"))
                );

                questionResponse.setWeaknesses(
                        Arrays.asList(weaknessesSection.split("\\n"))
                );

                questionResponse.setCorrectAnswer(correctAnswer);

            }

            reportQuestions.add(questionResponse);

        }
        response.setQuestions(reportQuestions);

        response.setTotalQuestions(reportQuestions.size());

        double totalScore = 0;

        int evaluatedQuestions = 0;

        for (Question question : questionList) {

            if (question.getScore() != null && !question.getScore().isBlank()) {

                String scoreText = question.getScore().replace("/10", "").trim();

                totalScore += Double.parseDouble(scoreText);

                evaluatedQuestions++;

            }

        }

        if (evaluatedQuestions > 0) {

            response.setAverageScore(totalScore / evaluatedQuestions);

        }

        return response;

    }
}
