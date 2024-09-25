package com.codesprout.codingAssistant_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PromptRequest {
    private String prompt;
    private String projectName;
    private String projectDescription;
    private String userId;
    private int numCharacters;
}
