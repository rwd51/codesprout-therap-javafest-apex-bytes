package com.codesprout.recommendation_service.repository;

import com.codesprout.recommendation_service.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String> {
}
