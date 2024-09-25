package com.codesprout.parent_service.repository;


import com.codesprout.parent_service.model.Parent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ParentRepository extends MongoRepository<Parent, String> {

    Optional<Parent> findByUsername(String username);
    List<Parent> findByChildIdsContaining(String childId);



}
