package com.codesprout.problem_service.repository;
import com.codesprout.problem_service.model.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import java.util.List;


public interface ProblemRepository extends MongoRepository<Problem, String> {
    List<Problem> findByCategory(String category);
    List<Problem> findByProblemIdIn(List<String> problemIds);

    //int countBySolvedByUserIdAndCategory(String userId, String beginner);
}