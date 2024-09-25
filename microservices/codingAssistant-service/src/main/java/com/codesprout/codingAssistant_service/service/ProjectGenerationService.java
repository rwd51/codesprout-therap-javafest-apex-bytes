package com.codesprout.codingAssistant_service.service;


import com.codesprout.codingAssistant_service.dto.ProjectResponse;
import com.codesprout.codingAssistant_service.dto.PromptRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectGenerationService {
    @Value("${openai.api.key}")
    private  String openAiApiKey;

    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";



    public String analyzeString(String input) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model","gpt-3.5-turbo");
            // Updated prompt to only return "yes" or "no" in lowercase
            requestBody.put("prompt", "Analyze if the following text is related to project generation using prompt or automatic code completion in a block based programming app. Reply only with 'yes' or 'no' in lowercase, nothing else:\n" + input);
            requestBody.put("max_tokens", 5);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                String completion = jsonResponse.get("choices").get(0).get("text").asText().trim();
                log.info("{}", completion);

                // Ensure the response is strictly "yes" or "no"
                if (completion.equals("yes") || completion.equals("no")) {
                    return completion;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "no";
    }
    public ProjectResponse generateProject(PromptRequest request) {
        String systemMessage = generateSystemMessage(request);

        // Prepare the OpenAI API request body
        Map<String, Object> openAiRequest = new HashMap<>();
        openAiRequest.put("model", "gpt-3.5-turbo");
        openAiRequest.put("messages", List.of(
                Map.of("role", "system", "content", systemMessage),
                Map.of("role", "user", "content", request.getPrompt())
        ));
        openAiRequest.put("max_tokens", 1500);
        openAiRequest.put("temperature", 0.7);

        // Prepare headers with Authorization and Content-Type
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openAiApiKey);

        // Create HttpEntity containing the request and headers
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(openAiRequest, headers);

        RestTemplate restTemplate = new RestTemplate();

        // Send the POST request
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                OPENAI_URL, HttpMethod.POST, entity, Map.class);

        // Parse the response
        Map<String, Object> response = responseEntity.getBody();
        log.info("{}", response);

        // Extract the 'message' content from the OpenAI response
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String generatedJson = (String) message.get("content");

        // Create ObjectMapper to parse JSON
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonResponse;
        try {
            // Parse the response JSON content into a Map
            jsonResponse = objectMapper.readValue(generatedJson, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing OpenAI response", e);
        }

        // Create a new ProjectResponse object
        ProjectResponse projectResponse = new ProjectResponse();
// Ensure correct classes for midAreaLists, characters, and active
       objectMapper = new ObjectMapper();
        try {
            // Parsing the midAreaLists, characters, and active fields into appropriate models
            List<ProjectResponse.MidAreaList> midAreaLists = objectMapper.convertValue(jsonResponse.get("midAreaLists"), new TypeReference<List<ProjectResponse.MidAreaList>>() {});
            List<ProjectResponse.Character> characters = objectMapper.convertValue(jsonResponse.get("characters"), new TypeReference<List<ProjectResponse.Character>>() {});
            ProjectResponse.Active active = objectMapper.convertValue(jsonResponse.get("active"), ProjectResponse.Active.class);

            // Assign the parsed objects to projectResponse
            projectResponse.setMidAreaLists(midAreaLists);
            projectResponse.setCharacters(characters);
            projectResponse.setActive(active);

        } catch (Exception e) {
            throw new RuntimeException("Error parsing OpenAI response fields", e);
        }

        // Set default values for other fields not generated by OpenAI
        projectResponse.setProjectName(request.getProjectName());
        projectResponse.setDescription(request.getProjectDescription());
        projectResponse.setUserId(request.getUserId());
        projectResponse.setClonedUserIds(new ArrayList<>());
        projectResponse.setTags(Arrays.asList("default", "project", "Basic"));
        projectResponse.setPublicNaki(true);
        projectResponse.setCollaborators(new ArrayList<>());
        projectResponse.setRatings(new HashMap<>());

        return projectResponse;
    }

    // System message to guide OpenAI API for generating specific sections
    private String generateSystemMessage(PromptRequest request) {
        return """
            You are tasked with generating the `midAreaLists`, `characters`, and `active` sections of a project in a block based programming app. 
            Below is an example JSON structure for reference:

            {
              "projectId":  "66dac71b481f7a72b151a96e",
              "projectName": "Basic Project",
              "description": "This is a test project",
              "userId": "66dac227aca56365d22ed637",
              "clonedUserIds": [],
              "creationDate":  "2024-09-06T09:10:51.552Z",
              "lastUpdateDate":  "2024-09-06T09:22:38.543Z",
              "tags": ["Logic", "Basic"],
              "public": true,
              "collaborators": [],
              "midAreaLists": [
                {
                  "id": "midAreaList-0",
                  "comps": [
                    {"id": "MOVE", "values": [300], "active": true},
                    {"id": "GOTO_XY", "values": [100, 200], "active": true}
                  ],
                  "characterId": "sprite0"
                },
                {
                    "id":"midArealist-1",
                    "comps" :[
                        {
                            "id":"REPEAT",
                            "values":[5,{ "id": "MOVE_Y", "values":[10],"active":"true"}]
        
                            
                        }
                    ],
                    "characterId":"sprite1"
                }
              ],
              "characters": [
                {
                  "id": "sprite0",
                  "angle": 45,
                  "type": "Knight",
                  "name": "sprite0",
                  "position": {"x": 100, "y": 200, "prevX":0,"prevY":0,"run": false},
                  "scale": 1,
                  "visible": true,
                  "showAngles": false
                },
                {
                 "id": "sprite1",
                  "angle": 60,
                  "type": "Knight",
                  "name": "sprite0",
                  "position": {"x": 10, "y": 20, "prevX":0,"prevY":0 "run": false},
                  "scale": 1,
                  "visible": true,
                  "showAngles": false
                }
              ],
              "active": {
                "id": "sprite0",
                "type": "Knight",
                "name": "sprite0",
                "angle": 45,
                "position": {"x": 100, "y": 200, "run": false},
                "scale": 1,
                "visible": true,
                "showAngles": false
              },
              "ratings": {}
            }

            You only need to generate the `midAreaLists`, `characters`, and `active` fields.
            1. `midAreaLists`: 
               - This array contains logic components representing different code blocks.Each midArealist is attached to a single character with characterId will follow the order sprite0,sprite1...respecitvely. Follow the json format shown above for reference.
                The components include:
                 - MOVE: moves in the x direction by the specified amount.
                 - MOVE_Y: moves in the y direction by the specified amount.
                 - TURN_CLOCKWISE/TURN_ANTI_CLOCKWISE: rotates by a specified amount in the respective direction(For clockwise,angle will be negative).
                 - GOTO_XY: moves along the x and y axis by the specified amounts.
                 - SAY_MESSAGE: outputs a message.
                 - HIDE_MESSAGE: hides the message.
                 - THINK: shows a thought message.
                 - REPEAT:  loop logic block
                 - Other blocks include broadcast, size adjustment, wait.
               - Ensure the characterId matches a character from the `characters` array.
            2. `characters`: 
               - Each character has properties like `id`, `angle`, `position`, `visible`, and `type`. Here position has also other informations as shown in the sample json above.
               - Select from predefined character types like [Tera,Knight, Hen, Lightning, Character1, Panther, Ghost, etc.].
               - `numCharacters` specifies how many characters to generate. The no of midArealists will be equal to number of characters
            3. `active`: 
               - This field is a copy of one of the characters, representing the currently active character. Follow the sample json as shown above

            Ensure that the `midAreaLists`' characterId matches a character from the `characters` array. 
            Values inside `id of comps` should align with the logic blocks provided.
           
            Now given a prompt you will need to generate the json with the `midAreaLists`, `characters`, and `active` fields.
            """;
    }

}
