package com.codesprout.codingAssistant_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromptCheckService {
    @Value("${openai.api.key}")
    private  String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper;
    // Function to check the prompt via OpenAI API
    public String checkReqPrompt(String input) {
        RestTemplate restTemplate = new RestTemplate();

        // Build system message
        String systemMessage = buildSystemMessage();

        // Build user message with the provided input
        String userMessage = buildUserMessage(input);

        // Set up headers for the OpenAI request
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        // Create the request body
        Map<String, Object> systemMessageMap = new HashMap<>();
        systemMessageMap.put("role", "system");
        systemMessageMap.put("content", systemMessage);

        Map<String, Object> userMessageMap = new HashMap<>();
        userMessageMap.put("role", "user");
        userMessageMap.put("content", userMessage);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", new Object[]{systemMessageMap, userMessageMap});
        body.put("max_tokens", 2);  // Limiting the response to only "yes" or "no"
        body.put("temperature", 0.0);  // Deterministic output for yes/no responses

        // Create the HttpEntity with body and headers
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // Call OpenAI API and get the response
        ResponseEntity<String> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, String.class);

        // Extract the "content" part from the AI response
        String aiResponseContent = extractContentFromResponse(response.getBody());

        // Return the AI's direct response ("yes" or "no")
        return aiResponseContent.trim();  // Ensuring no extra spaces in the response
    }

    // Helper method to build system message (you can customize the content here)
    private String buildSystemMessage() {
        return "You are an AI that determines whether a user's prompt is related to auto completion of blocks/codes, " +
                "automated project generation, or block generation.Remember that the context is block based programming app.So project can be a game,simulation or similar things.So a prompt might contain description of projects too. Only respond with 'yes' or 'no'.";
    }

    // Helper method to build the user message with the input prompt
    private String buildUserMessage(String input) {
        return "The user prompt is: " + input;
    }

    // Helper method to extract the content from the OpenAI API response
    private String extractContentFromResponse(String responseBody) {
        try {
            Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                return (String) message.get("content");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse OpenAI response", e);
        }
        return null;
    }
}
