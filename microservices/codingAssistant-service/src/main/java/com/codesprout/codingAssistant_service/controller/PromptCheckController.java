package com.codesprout.codingAssistant_service.controller;


import com.codesprout.codingAssistant_service.service.PromptCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkPrompt")
@RequiredArgsConstructor
public class PromptCheckController {
    private final PromptCheckService promptCheckService;
    @PostMapping
    public ResponseEntity<?> checkPrompt(@RequestBody Map<String, String> requestBody) {
        // Extract the user input from the request body
        String input = requestBody.get("input");


        if (input == null || input.isEmpty()) {
            return ResponseEntity.badRequest().body("Input prompt is required.");
        }

        // Call the service to check the prompt
        String result = promptCheckService.checkReqPrompt(input);
        Map<String,String>response= new HashMap<>();
        response.put("check",result);

        // Return the response (either "yes" or "no")
        return ResponseEntity.ok(response);
    }
}
