package com.codesprout.parent_service.controller;

import com.codesprout.parent_service.dto.*;
import com.codesprout.parent_service.service.ParentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
public class ParentController {
    private final ParentService parentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ParentResponseDTO> createUser(@RequestBody ParentRequestDTO parentRequest) {
        ParentResponseDTO parentResponse=parentService.createUser(parentRequest);



        return ResponseEntity.status(HttpStatus.CREATED).body(parentResponse);
    }
    @PutMapping("/{parentId}/request")
    public void sendRequestToParent(@PathVariable String parentId, @RequestBody ChildRequestDTO request) {
        parentService.sendRequestToParent(parentId, request);
    }

    @PutMapping("/{parentId}/approve/{childId}")
    public void approveChildRequest(@PathVariable String parentId, @PathVariable String childId) {
        parentService.approveChildRequest(parentId, childId);
    }
    @GetMapping("/{parentId}/allChildren/info")
    public List<ChildInfoDTO> getAllChildrenInfo(@PathVariable String parentId) {
        return parentService.getAllChildInfo(parentId);
    }
    @GetMapping("/children/info")
    public ChildInfoDTO getChildrenInfoById( @RequestParam String childId) {
        return parentService.getAChildInfoById(childId);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        ParentResponseDTO parentResponseDTO = parentService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (parentResponseDTO != null) {
            return ResponseEntity.ok(parentResponseDTO);  // Return the user object if login is successful
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Username or password is incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);  // Return error message as JSON  // Return error message if login fails
        }
    }
    @GetMapping("/{kidId}/availableParents")
    public List<ParentResponseDTO> getAvailableParents(@PathVariable String kidId) {
        return parentService.getAllParentsExceptKidParents(kidId);
    }
    // API to get the parent information based on a user's childId
    @GetMapping("/{userId}/getParents")
    public ResponseEntity<List<ParentResponseDTO>> getParentsByUserId(@PathVariable String userId) {
        List<ParentResponseDTO> parentResponses = parentService.getParentsByChildId(userId);
        return new ResponseEntity<>(parentResponses, HttpStatus.OK);
    }
    @GetMapping("/getPendingRequests")
    public ResponseEntity<List<ChildRequestDTO>> getPendingRequests(@RequestParam String parentId){
        List<ChildRequestDTO> childPendingRequests=parentService.getAllPendingRequests(parentId);
        if (childPendingRequests == null || childPendingRequests.isEmpty()) {
            // Return a 404 Not Found response if no pending requests are found
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Collections.emptyList());
        }

        // Return a 200 OK response with the list of pending requests
        return ResponseEntity.ok(childPendingRequests);

    }
}
