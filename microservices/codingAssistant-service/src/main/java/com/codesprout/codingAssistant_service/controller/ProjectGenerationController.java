package com.codesprout.codingAssistant_service.controller;


import com.codesprout.codingAssistant_service.dto.ProjectResponse;
import com.codesprout.codingAssistant_service.dto.PromptRequest;
import com.codesprout.codingAssistant_service.service.ProjectGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectGenerationController {

    private final ProjectGenerationService projectGenerationService;

    @PostMapping("/generate")
    public ResponseEntity<ProjectResponse> generateProject(@RequestBody PromptRequest promptRequest) {
        try {


            ProjectResponse projectRequest= projectGenerationService.generateProject(
                 promptRequest
            );
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            return new ResponseEntity<>(projectRequest, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate project");
        }
    }
    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeString(@RequestBody String input) {
        String result = projectGenerationService.analyzeString(input);
        return ResponseEntity.ok(result);
    }
}