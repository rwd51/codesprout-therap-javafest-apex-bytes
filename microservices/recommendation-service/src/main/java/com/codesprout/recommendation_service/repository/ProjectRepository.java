package com.codesprout.recommendation_service.repository;

import com.codesprout.recommendation_service.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project,String> {
}
