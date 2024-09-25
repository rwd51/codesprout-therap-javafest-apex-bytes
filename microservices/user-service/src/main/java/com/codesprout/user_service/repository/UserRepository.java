package com.codesprout.user_service.repository;

import com.codesprout.user_service.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByUsername(String username);
    // Custom query to fetch all users except the one with the given userId
    @Query("{'_id': { $ne: ?0 }}")
    List<User> findAllByUserIdNot(String userId);
}
