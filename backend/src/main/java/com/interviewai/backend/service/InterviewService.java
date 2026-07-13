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
import com.interviewai.backend.dto.DashboardStatsResponse;
import com.interviewai.backend.dto.ScoreTrendResponse;
import com.interviewai.backend.entity.Question;
import com.interviewai.backend.repository.QuestionRepository;
import com.interviewai.backend.dto.RolePerformanceResponse;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import com.interviewai.backend.dto.WeeklyActivityResponse;
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
            response.setFavorite(interview.getFavorite());
            System.out.println("Interview ID: " + interview.getId());

            if (interview.getQuestions() == null) {
                System.out.println("Questions = NULL");
            } else {
                System.out.println("Question Count = " + interview.getQuestions().size());

                interview.getQuestions().forEach(q ->
                        System.out.println("Score = " + q.getScore())
                );
            }
            double averageScore = 0.0;

            if (interview.getQuestions() != null && !interview.getQuestions().isEmpty()) {

                averageScore = interview.getQuestions()
                        .stream()
                        .mapToDouble(question -> {
                            try {
                                String scoreText = question.getScore()
                                        .replace("/10", "")
                                        .trim();
                                return Double.parseDouble(scoreText);
                            } catch (Exception e) {
                                return 0.0;
                            }
                        })
                        .average()
                        .orElse(0.0);
            }

            response.setAverageScore(averageScore);
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
    public DashboardStatsResponse getDashboardStats() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Interview> interviews = interviewRepository.findByUser(user);

        DashboardStatsResponse response = new DashboardStatsResponse();

        response.setTotalInterviews(interviews.size());

        int completed = 0;

        for (Interview interview : interviews) {

            if (Boolean.TRUE.equals(interview.getCompleted())) {

                completed++;

            }

        }

        response.setCompletedInterviews(completed);

        int pending = interviews.size() - completed;

        response.setPendingInterviews(pending);

        double totalScore = 0;

        int evaluatedQuestions = 0;

        for (Interview interview : interviews) {

            List<Question> questions = questionRepository.findByInterview(interview);

            for (Question question : questions) {

                if (question.getScore() != null && !question.getScore().isBlank()) {

                    String scoreText = question.getScore()
                            .replace("/10", "")
                            .trim();

                    totalScore += Double.parseDouble(scoreText);

                    evaluatedQuestions++;

                }

            }

        }

        if (evaluatedQuestions > 0) {

            response.setAverageScore(totalScore / evaluatedQuestions);

        }

        double bestScore = 0;

        for (Interview interview : interviews) {

            List<Question> questions = questionRepository.findByInterview(interview);

            for (Question question : questions) {

                if (question.getScore() != null && !question.getScore().isBlank()) {

                    double score = Double.parseDouble(
                            question.getScore()
                                    .replace("/10", "")
                                    .trim()
                    );

                    if (score > bestScore) {

                        bestScore = score;

                    }

                }

            }

        }

        response.setBestScore(bestScore);

        return response;
    }
    public List<ScoreTrendResponse> getScoreTrend(Integer days) {


        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Interview> interviews = interviewRepository.findByUser(user);

        if (days != null) {

            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);

            interviews = interviews.stream()

                    .filter(interview ->
                            interview.getCreatedAt().isAfter(cutoffDate))

                    .toList();

        }

        List<ScoreTrendResponse> trend = new ArrayList<>();

        for (Interview interview : interviews) {

            if (!Boolean.TRUE.equals(interview.getCompleted())) {
                continue;
            }

            double total = 0;
            int count = 0;

            if (interview.getQuestions() != null) {

                for (Question question : interview.getQuestions()) {

                    try {

                        String scoreText = question.getScore()
                                .replace("/10", "")
                                .trim();

                        total += Double.parseDouble(scoreText);

                        count++;

                    } catch (Exception e) {

                        System.out.println("Invalid Score = " + question.getScore());

                    }

                }

            }

            double average = count == 0 ? 0 : total / count;

            trend.add(

                    new ScoreTrendResponse(

                            interview.getCreatedAt().toLocalDate().toString(),

                            average

                    )

            );

        }

        return trend;
    }
    public List<RolePerformanceResponse> getRolePerformance(Integer days) {

        List<Interview> interviews = interviewRepository.findCompletedInterviews();
        if (days != null) {

            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);

            interviews = interviews.stream()

                    .filter(interview ->
                            interview.getCreatedAt().isAfter(cutoffDate))

                    .toList();

        }
        Map<String, List<Double>> roleScores = new HashMap<>();

        for (Interview interview : interviews) {

            double total = 0;
            int count = 0;

            for (Question q : interview.getQuestions()) {

                if (q.getScore() != null && !q.getScore().isEmpty()) {

                    String scoreText = q.getScore().split("/")[0];

                    total += Double.parseDouble(scoreText);

                    count++;

                }

            }

            if (count > 0) {

                double avg = total / count;

                roleScores
                        .computeIfAbsent(interview.getJobRole(), k -> new ArrayList<>())
                        .add(avg);

            }

        }

        List<RolePerformanceResponse> result = new ArrayList<>();

        for (String role : roleScores.keySet()) {

            List<Double> scores = roleScores.get(role);

            double sum = scores.stream().mapToDouble(Double::doubleValue).sum();

            result.add(new RolePerformanceResponse(role, sum / scores.size()));

        }

        return result;
    }
    public List<MonthlyStatsResponse> getMonthlyStats(Integer days) {

        List<Interview> interviews = interviewRepository.findAll();
        if (days != null) {

            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);

            interviews = interviews.stream()

                    .filter(interview ->
                            interview.getCreatedAt().isAfter(cutoffDate))

                    .toList();

        }
        Map<String, Long> monthMap = new LinkedHashMap<>();

        monthMap.put("Jan", 0L);
        monthMap.put("Feb", 0L);
        monthMap.put("Mar", 0L);
        monthMap.put("Apr", 0L);
        monthMap.put("May", 0L);
        monthMap.put("Jun", 0L);
        monthMap.put("Jul", 0L);
        monthMap.put("Aug", 0L);
        monthMap.put("Sep", 0L);
        monthMap.put("Oct", 0L);
        monthMap.put("Nov", 0L);
        monthMap.put("Dec", 0L);

        String[] months = {
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
        };

        for (Interview interview : interviews) {

            int monthIndex = interview.getCreatedAt().getMonthValue() - 1;

            String month = months[monthIndex];

            monthMap.put(month, monthMap.get(month) + 1);

        }

        List<MonthlyStatsResponse> result = new ArrayList<>();

        for (Map.Entry<String, Long> entry : monthMap.entrySet()) {

            result.add(
                    new MonthlyStatsResponse(
                            entry.getKey(),
                            entry.getValue()
                    )
            );

        }

        return result;
    }
    public List<WeeklyActivityResponse> getWeeklyActivity(Integer days) {

        List<Interview> interviews = interviewRepository.findAll();
        if (days != null) {

            LocalDateTime cutoff = LocalDateTime.now().minusDays(days);

            interviews = interviews.stream()
                    .filter(i -> i.getCreatedAt().isAfter(cutoff))
                    .toList();
        }
        Map<String, Long> dayMap = new LinkedHashMap<>();

        dayMap.put("Mon", 0L);
        dayMap.put("Tue", 0L);
        dayMap.put("Wed", 0L);
        dayMap.put("Thu", 0L);
        dayMap.put("Fri", 0L);
        dayMap.put("Sat", 0L);
        dayMap.put("Sun", 0L);

        for (Interview interview : interviews) {

            String day = interview.getCreatedAt()
                    .getDayOfWeek()
                    .toString();

            switch (day) {

                case "MONDAY" -> dayMap.put("Mon", dayMap.get("Mon") + 1);

                case "TUESDAY" -> dayMap.put("Tue", dayMap.get("Tue") + 1);

                case "WEDNESDAY" -> dayMap.put("Wed", dayMap.get("Wed") + 1);

                case "THURSDAY" -> dayMap.put("Thu", dayMap.get("Thu") + 1);

                case "FRIDAY" -> dayMap.put("Fri", dayMap.get("Fri") + 1);

                case "SATURDAY" -> dayMap.put("Sat", dayMap.get("Sat") + 1);

                case "SUNDAY" -> dayMap.put("Sun", dayMap.get("Sun") + 1);

            }

        }

        List<WeeklyActivityResponse> result = new ArrayList<>();

        for (Map.Entry<String, Long> entry : dayMap.entrySet()) {

            result.add(new WeeklyActivityResponse(
                    entry.getKey(),
                    entry.getValue()
            ));

        }

        return result;

    }

    public Interview toggleFavorite(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interview.setFavorite(!Boolean.TRUE.equals(interview.getFavorite()));

        return interviewRepository.save(interview);
    }

}
