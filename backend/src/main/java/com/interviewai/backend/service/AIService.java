package com.interviewai.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import java.util.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.backend.entity.Interview;
import com.interviewai.backend.entity.Question;
import com.interviewai.backend.repository.InterviewRepository;
import com.interviewai.backend.repository.QuestionRepository;
import com.interviewai.backend.dto.EvaluationResponse;
@Service
public class AIService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private QuestionRepository questionRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public String getApiKey() {
        return apiKey;
    }
    public String generateQuestions(Long interviewId,String jobRole, String experienceLevel) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        String prompt = """
            Generate 5 interview questions.

            Job Role: %s
            Experience Level: %s

            Return only the questions.
            Do not add numbering explanation or markdown.
            """.formatted(jobRole, experienceLevel);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        apiUrl + "?key=" + apiKey,
                        HttpMethod.POST,
                        entity,
                        String.class
                );

        try {
            JsonNode root = objectMapper.readTree(response.getBody());

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            String[] questions = text.split("\n");

            List<String> questionList = new ArrayList<>();

            for (String questionText : questions) {

                if (!questionText.trim().isEmpty()) {

                    Question question = new Question();

                    question.setInterview(interview);
                    question.setQuestionText(questionText.trim());
                    question.setAnswer("");

                    questionRepository.save(question);

                    questionList.add(questionText.trim());
                }
            }

            return String.join("\n", questionList);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }
    public  EvaluationResponse  evaluateAnswer(String question, String answer) {

        String prompt = """
        You are an expert Java technical interviewer.

        Evaluate the candidate's answer.

        Question:
        %s

        Candidate Answer:
        %s

        Return ONLY valid JSON.

        Do not return markdown.
        Do not return explanation.
        Do not wrap JSON inside ```.

        Use exactly this format:

        {
          "score":"8/10",
          "strengths":[
            "point1",
            "point2"
          ],
          "weaknesses":[
            "point1",
            "point2"
          ],
          "correctAnswer":"..."
        }
        """.formatted(question, answer);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        apiUrl + "?key=" + apiKey,
                        HttpMethod.POST,
                        entity,
                        String.class
                );

        try {

            JsonNode root = objectMapper.readTree(response.getBody());

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
            JsonNode evaluationNode = objectMapper.readTree(text);

            EvaluationResponse evaluationResponse = new EvaluationResponse();

            evaluationResponse.setScore(
                    evaluationNode.path("score").asText()
            );

            evaluationResponse.setStrengths(
                    objectMapper.convertValue(
                            evaluationNode.path("strengths"),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(List.class, String.class)
                    )
            );

            evaluationResponse.setWeaknesses(
                    objectMapper.convertValue(
                            evaluationNode.path("weaknesses"),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(List.class, String.class)
                    )
            );

            evaluationResponse.setCorrectAnswer(
                    evaluationNode.path("correctAnswer").asText()
            );

            return evaluationResponse;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }
}
