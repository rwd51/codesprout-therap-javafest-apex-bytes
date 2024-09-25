package com.codesprout.project_service.repository;

import com.codesprout.project_service.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project,String> {
    List<Project> findByUserId(String userId);
    List<Project> findByPublicNakiTrue();
    List<Project> findByCollaboratorsContaining(String userId);
    List<Project> findByPublicNakiTrueAndUserIdNot(String userId);

    List<Project> findByClonedUserIdsContaining(String userId);


    int countByUserId(String userId);

    int countByClonedUserIdsContaining(String userId);

    int countByCollaboratorsContaining(String userId);
}
