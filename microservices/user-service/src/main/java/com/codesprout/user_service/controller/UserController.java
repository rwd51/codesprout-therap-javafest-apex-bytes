package com.codesprout.user_service.controller;

import com.codesprout.user_service.dto.*;
import com.codesprout.user_service.model.User;
import com.codesprout.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        UserResponse userResponse=userService.createUser(userRequest);



        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }
    /*@GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }
    */
    //get all users exept me
    @GetMapping("/getUsersExceptMe/{userId}")
    public ResponseEntity<List<UserResponse>> getAllUsersExceptMe(@PathVariable String userId){
        List<UserResponse> userResponses=userService.getAllUsersExcept(userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(userResponses,headers,HttpStatus.OK);

    }
    // get user details
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        UserResponse userResponse = userService.getUserById(id);

        if (userResponse == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        log.info("{new ResponseEntity<>(userResponse, headers, HttpStatus.OK)}");
        return new ResponseEntity<>(userResponse, headers, HttpStatus.OK);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (user != null) {
            return ResponseEntity.ok(user);  // Return the user object if login is successful
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Username or password is incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);  // Return error message as JSON  // Return error message if login fails
        }
    }
    @PutMapping("/addProject")
    public ResponseEntity<User> addProjectIdToUser(@RequestBody ProjectInfo projectUserRequest) {
        User updatedUser = userService.addProjectIdToUser(projectUserRequest.getUserId(), projectUserRequest.getProjectId());
        log.info("Project ID added to user");
        return ResponseEntity.ok(updatedUser);
    }
    @PutMapping("/addProject/clone")
    public ResponseEntity<User> addCloneProjectIdToUser(@RequestBody ProjectInfo projectUserRequest) {
        User updatedUser = userService.addClonedProjectIdToUser(projectUserRequest.getUserId(), projectUserRequest.getProjectId());
        log.info("Project ID added to user");
        return ResponseEntity.ok(updatedUser);
    }
    @PutMapping("/add/solvedProblems")
    public ResponseEntity<User> addSolvedProblemToUser(@RequestBody ProblemUserDTO problemUserDTO) {
        User updatedUser = userService.addSolvedProblemIdToUser(problemUserDTO);
        log.info("Project ID added to user");
        return ResponseEntity.ok(updatedUser);
    }
    @PutMapping("/{userId}/infoUpdate")
    public ResponseEntity<Map<String, String>> updateTopicInterests(
            @PathVariable String userId,
            @RequestBody UpdateTopicInterestsPhotoBio updateTopicInterests) {

        userService.updateTopicInterestsPhotoBio(userId, updateTopicInterests.getTopicInterests(), updateTopicInterests.getPhoto(),updateTopicInterests.getBio());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Update successfull");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/clonedProjects/{userId}/total")
    public ResponseEntity<Map<String, Integer>> countClonedProjects(@PathVariable String userId) {
        int clonedProjectCount = userService.countClonedProjects(userId);
        Map<String, Integer> response = new HashMap<>();
        response.put("clonedProjectCount", clonedProjectCount);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/parentList")
    public List<String> getKidParentList(@RequestParam String childId) {
       return userService.getParentIds(childId);
    }
    // API endpoint to add a parent to a user
    @PutMapping("/addParent")
    public ResponseEntity<Map<String, String>> addParentToUser(@RequestParam String childId, @RequestParam String parentId) {
        userService.addParentToUser(childId, parentId);

        // Create a simple JSON response using Map
        Map<String, String> response = new HashMap<>();
        response.put("message", "Parent ID " + parentId + " added successfully to User ID " + childId);

        return ResponseEntity.ok(response);  // Return the response as JSON
    }

    // API to add a sent request for a user
    @PutMapping("/{kidId}/addSentRequest")
    public ResponseEntity<String> addSentRequest(@PathVariable String kidId, @RequestBody SentRequestDTO sentRequest) {
        userService.addSentRequest(kidId, sentRequest);

        // Return a success message as a JSON response
        return ResponseEntity.ok("Sent request added successfully for User ID " + kidId);
    }


    @GetMapping("/child")
    public ResponseEntity<KidInfo> getChildById(@RequestParam String id) {
        KidInfo kidInfo = userService.getKidById(id);

        if (kidInfo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        log.info("{new ResponseEntity<>(userResponse, headers, HttpStatus.OK)}");
        return new ResponseEntity<>(kidInfo, headers, HttpStatus.OK);
    }

    @GetMapping("/getSentRequests")
    public ResponseEntity<List<SentRequestDTO>> getAllSentRequests(@RequestParam String userId){
        List<SentRequestDTO> sentRequests=userService.getALlSentRequest(userId);
        if (sentRequests == null || sentRequests.isEmpty()) {
            // Return a 404 Not Found response if no pending requests are found
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Collections.emptyList());
        }

        // Return a 200 OK response with the list of pending requests
        return ResponseEntity.ok(sentRequests);

    }

    @GetMapping("/{userId}/projects/count")
    public Map<String, Integer> getTotalProjectsByUserId(@PathVariable String userId) {
        int totalProjects = userService.getTotalProjectsByUserId(userId);
        Map<String, Integer> response = new HashMap<>();
        response.put("totalProjectCount", totalProjects);
        return response;
    }
    @GetMapping("/{userId}/solvedProblems/count")
    public ResponseEntity<Map<String, Integer>> getTotalSolvedProblems(@PathVariable String userId) {
        int totalSolvedProblems = userService.getTotalSolvedProblemsByUserId(userId);
        Map<String, Integer> response = new HashMap<>();
        response.put("totalSolvedProblems", totalSolvedProblems);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/{userId}/solved/puzzles")
    public ResponseEntity<List<String>> getSolvedPuzzles(@PathVariable String userId) {
        List<String> solvedPuzzleIds = userService.getSolvedPuzzleIdsByUserId(userId);
        return ResponseEntity.ok(solvedPuzzleIds);
    }
    @GetMapping("/{userId}/parent/{parentId}/check")
    public ResponseEntity<Map<String,Boolean>> checkIfRequestSent(@PathVariable String userId, @PathVariable String parentId) {
        boolean isRequestSent = userService.isRequestAlreadySent(userId, parentId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("check",isRequestSent);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

}
