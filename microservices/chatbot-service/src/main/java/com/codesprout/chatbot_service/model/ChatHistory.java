package com.codesprout.chatbot_service.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chatHistory")
public class ChatHistory {
    @Id
    public String historyId;
    private String userId;  // The user's unique ID

    private List<Conversation> conversations;  // A list of conversations between user and bot

    @Data
    public static class Conversation {
        private String conversationId;  // Unique ID for each conversation
        //private String conversationId = UUID.randomUUID().toString();  // Un
        private String topic;  // Topic of the conversation
        private List<Message> messages;  // List of messages in the conversation
        private LocalDateTime startTime;  // When the conversation started
        private LocalDateTime endTime;    // When the conversation ended
    }

    @Data
    public static class Message {
        private String sender;  // Either "user" or "bot"
        private String content;  // Content of the message
        private LocalDateTime timestamp;  // Time the message was sent
    }
}