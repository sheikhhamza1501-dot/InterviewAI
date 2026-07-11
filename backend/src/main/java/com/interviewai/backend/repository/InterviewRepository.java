package com.interviewai.backend.repository;

import com.interviewai.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.interviewai.backend.entity.User;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUser(User user);
    @Query("""
SELECT i
FROM Interview i
WHERE i.completed = true
""")
    List<Interview> findCompletedInterviews();
    List<Interview> findAll();
}
