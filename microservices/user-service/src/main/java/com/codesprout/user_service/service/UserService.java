package com.codesprout.user_service.service;

import com.codesprout.user_service.dto.*;
import com.codesprout.user_service.model.User;
import com.codesprout.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WebClient webClient;
    public UserResponse createUser(UserRequest userRequest){
        // Check if the username already exists
        userRepository.findByUsername(userRequest.getUsername())
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Username '" + userRequest.getUsername() + "' is already taken.");
                });
        User user=User.builder()
                .name(userRequest.getName())
                .username(userRequest.getUsername())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .age(userRequest.getAge())
                .photo(userRequest.getPhoto())
                .bio(userRequest.getBio())
                .email(userRequest.getEmail())
                .parentIds(userRequest.getParentIds())
                .sentRequests(userRequest.getSentRequests())
                .solvedPuzzleIds(userRequest.getSolvedPuzzleIds())
                .projectIds(userRequest.getProjectIds())
                .clonedProjectIds(userRequest.getClonedProjectIds())
                .tag(userRequest.getTag())
                .badges(userRequest.getBadges())
                .topicInterests(userRequest.getTopicInterests())
                .build();
        userRepository.save(user);
        log.info("User {} is Created",user.getId());
        // Call UserService to add the projectId to the user's project list

        return mapToUserResponse(user);

    }

    public int getTotalProjectsByUserId(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getProjectIds().size(); // Count the number of project IDs
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public int getTotalProjectsForAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .mapToInt(user -> user.getProjectIds() != null ? user.getProjectIds().size() : 0)
                .sum();
    }

    public List<UserResponse> getAllUsers() {
        List<User> users=userRepository.findAll();
        return users.stream().map(this::mapToUserResponse).toList();


    }
    public User loginUser(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user != null && passwordEncoder.matches(rawPassword, user.getPassword())) {
            return user;
        } else {
            return null;  // Login failed
        }
    }

    public User addProjectIdToUser(String userId, String projectId) {
        Optional<User> userOptional = userRepository.findById(userId);
        log.info("user Serivce called");
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getProjectIds().add(projectId); // Add the new projectId to the list
            return userRepository.save(user); // Save the updated user back to the database
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public User addClonedProjectIdToUser(String userId, String projectId) {
        Optional<User> userOptional = userRepository.findById(userId);
        log.info("user Serivce called");
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getClonedProjectIds().add(projectId); // Add the new projectId to the list
            return userRepository.save(user); // Save the updated user back to the database
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public User addSolvedProblemIdToUser(ProblemUserDTO problemUserDTO) {
        Optional<User> userOptional = userRepository.findById(problemUserDTO.getUserId());
        log.info("user Serivce called");
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getSolvedPuzzleIds().add(problemUserDTO.getProblemId()); // Add the new projectId to the list
            return userRepository.save(user); // Save the updated user back to the database
        } else {
            throw new RuntimeException("User not found");
        }
    }
    // Method to count the number of cloned projects for a user
    public int countClonedProjects(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getClonedProjectIds() != null) {
                return user.getClonedProjectIds().size(); // Return the count of cloned projects
            }
            return 0; // No cloned projects found
        } else {
            throw new RuntimeException("User not found");
        }
    }
    // Method to get the total number of solved problems for a specific user
    public int getTotalSolvedProblemsByUserId(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getSolvedPuzzleIds() != null) {
                return user.getSolvedPuzzleIds().size(); // Return the number of solved problems
            }
            return 0; // No solved problems found
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public User addParentToUser(String userId,String parentId) {
        Optional<User> userOptional = userRepository.findById(userId);
        log.info("user Serivce called");
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getParentIds().add(parentId); // Add the new projectId to the list

            user.getSentRequests().removeIf(request -> request.getParentId().equals(parentId));


            return userRepository.save(user); // Save the updated user back to the database
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void addSentRequest(String kidId, SentRequestDTO sentRequest) {
        // Fetch the user by kidId
        User user = userRepository.findById(kidId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User.SentRequests sentNewRequest=new User.SentRequests();
        sentNewRequest.setParentId(sentRequest.getParentId());
        sentNewRequest.setName(sentRequest.getName());
        sentNewRequest.setPhoto(sentRequest.getPhoto());
        sentNewRequest.setUsername(sentRequest.getUsername());

        // Add the sent request to the user's list of sentRequests
        user.getSentRequests().add(sentNewRequest);

        // Save the updated user to the database
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .age(user.getAge())
                .photo(user.getPhoto())
                .bio(user.getBio())
                .email(user.getEmail())
                .parentIds(user.getParentIds())
                .sentRequests(user.getSentRequests())
                .solvedPuzzleIds(user.getSolvedPuzzleIds())
                .projectIds(user.getProjectIds())
                .clonedProjectIds(user.getClonedProjectIds())
                .tag(user.getTag())
                .badges(user.getBadges())
                .topicInterests(user.getTopicInterests())
                .build();
    }
    /*public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToUserResponse(user);
    }
     */
    public UserResponse getUserById(String id) {
        log.info("method called");
        return userRepository.findById(id)
                .map(this::mapToUserResponse)
                .orElse(null);
    }
    public User updateTopicInterestsPhotoBio(String userId, List<String> topicInterests,String photo,String bio) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getTopicInterests().addAll(topicInterests); // Update the tag field with the new tags
            user.setPhoto(photo);
            user.setBio(bio);
            String recommendationServiceUrl = "http://localhost:8083/api/recommendation/user";



            webClient.post()
                    .uri(recommendationServiceUrl)
                    .bodyValue(user)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
            return userRepository.save(user); // Save the updated user back to the database
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public List<UserResponse> getAllUsersExcept(String userId) {
        List<User> users = userRepository.findAllByUserIdNot(userId);
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }
    public List<String> getParentIds(String userId){
        User kid = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kid not found"));
        return kid.getParentIds();
    }


    public KidInfo getKidById(String id) {
        return userRepository.findById(id)
                .map(this::mapToKidInfo)
                .orElse(null);
    }
    public List<SentRequestDTO> getALlSentRequest(String userId){
        List<User.SentRequests> sentRequests=userRepository.findById(userId).get().getSentRequests();
        return sentRequests.stream()
                .map(this::mapToSentRequestDTO)
                .collect(Collectors.toList());
    }
    public List<String> getSolvedPuzzleIdsByUserId(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getSolvedPuzzleIds();
    }
    public boolean isRequestAlreadySent(String userId, String parentId) {
        // Fetch the user by userId
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if any SentRequest contains the given parentId
        if (user.getSentRequests() != null) {
            return user.getSentRequests().stream()
                    .anyMatch(request -> parentId.equals(request.getParentId()));
        }

        // If sentRequests is null or empty, return false
        return false;
    }
    private SentRequestDTO mapToSentRequestDTO(User.SentRequests sentRequests){
        return SentRequestDTO.builder()
                .parentId(sentRequests.getParentId())
                .name(sentRequests.getName())
                .photo(sentRequests.getPhoto())
                .username(sentRequests.getUsername())

                .build();

    }

    private KidInfo mapToKidInfo(User user) {
        return KidInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .age(user.getAge())
                .photo(user.getPhoto())
                .bio(user.getBio())
                .topicInterests(user.getTopicInterests())
                .badges(user.getBadges())
                .tag(user.getTag())
                .build();
    }

}
