package com.interviewai.backend.repository;

import com.interviewai.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.interviewai.backend.entity.User;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUser(User user);
}
