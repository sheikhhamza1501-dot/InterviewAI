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

        questionRepository.save(question);
    }
    public EvaluationResponse evaluateAnswer(Long questionId) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        String feedback = aiService.evaluateAnswer(
                question.getQuestionText(),
                question.getAnswer()
        );

        EvaluationResponse response = new EvaluationResponse();
        response.setFeedback(feedback);

        return response;
    }

}
