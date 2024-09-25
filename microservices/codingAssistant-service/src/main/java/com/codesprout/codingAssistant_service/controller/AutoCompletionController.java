package com.codesprout.codingAssistant_service.controller;


import com.codesprout.codingAssistant_service.dto.MidAreaList;
import com.codesprout.codingAssistant_service.dto.PromptRequest;
import com.codesprout.codingAssistant_service.service.AutoCompletionService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/codingAssistant")
@RequiredArgsConstructor
public class AutoCompletionController {
    private final AutoCompletionService autoCompletionService;

    @PostMapping
    public ResponseEntity<String> getAutoCompletion(@RequestBody MidAreaList midAreaList) {
        //String prompt = request.get("prompt");
       // String jsonFormat = promptRequest.getPrompt();  // Optional, if you want to pass a specific format
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(autoCompletionService.getAutoCompletion(midAreaList), headers, HttpStatus.OK);

    }

}
