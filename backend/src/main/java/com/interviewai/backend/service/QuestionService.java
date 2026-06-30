package com.interviewai.backend.service;

import com.interviewai.backend.dto.CreateQuestionRequest;
import com.interviewai.backend.dto.QuestionResponse;
import com.interviewai.backend.entity.Interview;
import com.interviewai.backend.entity.Question;
import com.interviewai.backend.repository.InterviewRepository;
import com.interviewai.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import com.interviewai.backend.dto.UpdateAnswerRequest;
import com.interviewai.backend.service.AIService;
import com.interviewai.backend.dto.EvaluationResponse;
import java.util.Arrays;
@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private AIService aiService;

    public QuestionResponse createQuestion(CreateQuestionRequest request) {

        Interview interview = interviewRepository.findById(request.getInterviewId())
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        Question question = new Question();

        question.setQuestionText(request.getQuestionText());
        question.setAnswer("");
        question.setInterview(interview);

        question = questionRepository.save(question);

        QuestionResponse response = new QuestionResponse();

        response.setId(question.getId());
        response.setQuestionText(question.getQuestionText());
        response.setAnswer(question.getAnswer());

        return response;
    }
    public List<QuestionResponse> getQuestionsByInterview(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<Question> questions = questionRepository.findByInterview(interview);

        List<QuestionResponse> responseList = new ArrayList<>();

        for (Question question : questions) {

            QuestionResponse response = new QuestionResponse();

            response.setId(question.getId());
            response.setQuestionText(question.getQuestionText());
            response.setAnswer(question.getAnswer());

            responseList.add(response);
        }

        return responseList;
    }
    public void updateAnswer(Long questionId, UpdateAnswerRequest request) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setAnswer(request.getAnswer());

// Clear previous evaluation
        question.setScore(null);
        question.setFeedback(null);

        questionRepository.save(question);
    }

    public EvaluationResponse evaluateAnswer(Long questionId) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // If already evaluated, return the saved evaluation
        if (question.getScore() != null && !question.getScore().isBlank()
                && question.getFeedback() != null && !question.getFeedback().isBlank()) {

            return buildEvaluationResponse(question);
        }

        // Otherwise, call Gemini
        EvaluationResponse evaluation = aiService.evaluateAnswer(
                question.getQuestionText(),
                question.getAnswer()
        );

        question.setScore(evaluation.getScore());

        String feedback = "Strengths:\n"
                + String.join("\n", evaluation.getStrengths())
                + "\n\nWeaknesses:\n"
                + String.join("\n", evaluation.getWeaknesses())
                + "\n\nCorrect Answer:\n"
                + evaluation.getCorrectAnswer();

        question.setFeedback(feedback);

        questionRepository.save(question);

        return evaluation;
    }

    private EvaluationResponse buildEvaluationResponse(Question question) {

        EvaluationResponse response = new EvaluationResponse();

        response.setScore(question.getScore());

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

            response.setStrengths(
                    Arrays.asList(strengthsSection.split("\\n"))
            );

            response.setWeaknesses(
                    Arrays.asList(weaknessesSection.split("\\n"))
            );

            response.setCorrectAnswer(correctAnswer);
        }

        return response;
    }
    }


