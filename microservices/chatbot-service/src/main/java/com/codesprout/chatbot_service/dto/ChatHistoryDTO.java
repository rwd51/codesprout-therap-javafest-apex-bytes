package com.codesprout.chatbot_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatHistoryDTO {
    @Id
    private String historyId;
    private String userId;  // The user's unique ID
    private List<ConversationDTO> conversations;  // A list of conversations

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ConversationDTO {

        private String conversationId;  // Unique ID for each conversation
        private String topic;  // Topic of the conversation
        private List<MessageDTO> messages;  // List of messages in the conversation
        private LocalDateTime startTime;  // When the conversation started
        private LocalDateTime endTime;    // When the conversation ended
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MessageDTO {
        private String sender;  // Either "user" or "bot"
        private String content;  // Content of the message
        private LocalDateTime timestamp;  // Time the message was sent
    }
}