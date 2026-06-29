package com.interviewai.backend.repository;

import com.interviewai.backend.entity.Question;
import com.interviewai.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByInterview(Interview interview);

}