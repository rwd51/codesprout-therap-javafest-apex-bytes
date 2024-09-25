package com.codesprout.chatbot_service.repository;

import com.codesprout.chatbot_service.model.ChatHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatHistoryRepository extends MongoRepository<ChatHistory, String> {
    Optional<ChatHistory> findByUserId(String userId);  // Find chat history by userId
}