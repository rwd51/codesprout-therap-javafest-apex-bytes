package com.codesprout.codingAssistant_service.service;

import com.codesprout.codingAssistant_service.dto.MidAreaList;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutoCompletionService {
    @Value("${openai.api.key}")
    private String apiKey;
    private final ObjectMapper objectMapper;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public String getAutoCompletion(MidAreaList midAreaList) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", buildSystemMessage());

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        String partialJson;
        try {
            partialJson = objectMapper.writeValueAsString(midAreaList);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert MidAreaList to JSON", e);
        }
        userMessage.put("content", buildUserMessage(partialJson));

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", new Object[]{systemMessage, userMessage});
        body.put("max_tokens", 150);
        body.put("temperature", 0.7);
        body.put("stop", new String[]{"\n    ]\n}"});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, String.class);

        // Extract the "content" part from the AI response and ensure it's in JSON format
        String aiResponseContent = extractContentFromResponse(response.getBody());

        // Ensure the response content is properly formatted JSON
        return validateAndFormatJson(aiResponseContent);
    }

    private String buildSystemMessage() {
        return "You are an AI assistant for a block-based programming app. The programming app uses JSON to represent code blocks. "
                + "When generating JSON, please ensure all keys and string values are enclosed in double quotes (\" \"). Below is the format of the JSON used:\n\n"
                + "{\n"
                + "  \"id\": \"midAreaList-0\",\n"
                + "  \"comps\": [\n"
                + "    { \"id\": \"MOVE\", \"values\": [300] },\"active\" : true},\n"
                + "    { \"id\": \"GOTO_XY\", \"values\": [100,200] },\"active\" : true},\n"
                + "    { \"id\": \"REPEAT\", \"values\": [5, [{ \"id\": \"MOVE_Y\", \"values\": [300] }, { \"id\": \"TURN_CLOCKWISE\", \"values\": [-90] }] ],\"active\" : true }\n"
                + "  ],\n"
                + "  \"character_id\": \"sprite0\"\n"
                + "}\n"
                + "Available Components:\n"
                + "Motion Components: \"MOVE\", \"MOVE_Y\", \"TURN_CLOCKWISE\", \"TURN_ANTI_CLOCKWISE\", \"GOTO_XY\"\n"
                + "Looks Components: \"SAY_MESSAGE\", \"SAY_MESSAGE_WITH_TIMER\", \"THINK\", \"THINK_TIMER\", \"HIDE_MESSAGE\", \"SIZE\", \"SHOW\", \"HIDE\"\n"
                + "Events Components: \"BROADCAST\"\n"
                + "Control Components: \"WAIT\", \"REPEAT\"";
    }


    private String buildUserMessage(String partialJson) {
        return "Below is a code block that needs completion. Do not suggest a BROADCAST command in your response. "
                + "Instead, continue the sequence logically with another action, movement, or interaction. Dont change the id of midAreaList.And keep the character_id as it is.\n\n"
               // + "midAreaLists: [\n  {\n    id: \"midAreaList-0\",\n    comps: [\n      { id:\"GOTO_XY\", values:[200,100] },\n"
                //+ "      { id:\"SAY_MESSAGE\", values:[\"Hello World\"] },\n      "
                + partialJson;
    }

    private String extractContentFromResponse(String responseBody) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode contentNode = rootNode.path("choices").get(0).path("message").path("content");
            return contentNode.asText();
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    private String validateAndFormatJson(String aiResponseContent) {
        try {
            // Check if the response is valid JSON
            JsonNode jsonNode = objectMapper.readTree(aiResponseContent);

            // Pretty print the JSON to ensure proper formatting
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode);
        } catch (IOException e) {
            log.error("Invalid JSON received from AI response: {}", aiResponseContent);
            throw new RuntimeException("Received invalid JSON from AI response", e);
        }
    }


}