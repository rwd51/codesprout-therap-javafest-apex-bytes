package com.codesprout.chatbot_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InitiateChatDTO {
    private String userId;
    private  String initialMessage;
    private String conversationId;
    private String historyId;
}
