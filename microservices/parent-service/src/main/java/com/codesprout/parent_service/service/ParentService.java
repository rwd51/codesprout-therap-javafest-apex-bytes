package com.codesprout.parent_service.service;

import com.codesprout.parent_service.dto.*;
import com.codesprout.parent_service.model.Parent;
import com.codesprout.parent_service.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParentService {
    private final ParentRepository parentRepository;
    private final WebClient webClient;
    private final PasswordEncoder passwordEncoder;

    public ParentResponseDTO createUser(ParentRequestDTO userRequest){
        // Check if the username already exists
        parentRepository.findByUsername(userRequest.getUsername())
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Username '" + userRequest.getUsername() + "' is already taken.");
                });
        Parent parent=Parent.builder()

                .username(userRequest.getUsername())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .name(userRequest.getName())
                .email(userRequest.getEmail())
                .photo(userRequest.getPhoto())
                .childIds(userRequest.getChildIds())
                .pendingRequests(userRequest.getPendingRequests())
                .build();
        parentRepository.save(parent);
        log.info("User {} is Created",parent.getId());
        // Call UserService to add the projectId to the user's project list

        return mapToParentResponse(parent);

    }
    public List<ChildRequestDTO> getAllPendingRequests(String parentId){
        List<Parent.PendingRequests> pendingRequests=parentRepository.findById(parentId).get().getPendingRequests();
        return pendingRequests.stream()
                .map(this::mapToChildRequestDTO)
                .collect(Collectors.toList());
    }
    private ChildRequestDTO mapToChildRequestDTO(Parent.PendingRequests pendingRequest){
        return ChildRequestDTO.builder()
                .childId(pendingRequest.getChildId())
                .name(pendingRequest.getName())
                .username(pendingRequest.getUsername())
                .photo(pendingRequest.getPhoto())
                .build();
    }
    public List<ParentResponseDTO> getAllParentsExceptKidParents(String kidId) {
        // Fetch the kid's parentList by calling the User service
        List<String> kidParentIds = webClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/user/parentList")   // Define the base path
                        .queryParam("childId", kidId)   // Add the query parameter "childId"
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .block();  // Blocking for simplicity, can be non-blocking

        // Fetch all parents from the ParentRepository
        List<Parent> allParents = parentRepository.findAll();

        // Filter out the kid's parents from the list
        List<Parent> filteredParents = allParents.stream()
                .filter(parent -> !kidParentIds.contains(parent.getId()))  // Exclude kid's parents
                .collect(Collectors.toList());

        // Map to ParentResponseDTO
        return filteredParents.stream()
                .map(this::mapToParentResponse)
                .collect(Collectors.toList());
    }

    private ParentResponseDTO mapToParentResponse(Parent parent) {
        return ParentResponseDTO.builder()
                .id(parent.getId())
                .name(parent.getName())
                .username(parent.getUsername())
                .photo(parent.getPhoto())
                .email(parent.getEmail())
                .childIds(parent.getChildIds())
                .pendingRequests(parent.getPendingRequests())
                .build();
    }
    public void sendRequestToParent(String parentId, ChildRequestDTO request) {
        Optional<Parent> parent = parentRepository.findById(parentId);
        if (parent.isPresent()) {
            Parent p = parent.get();
            // Create a new PendingRequest object using the data from ChildRequestDTO
            Parent.PendingRequests pendingRequest = new Parent.PendingRequests(
                    request.getChildId(),
                    request.getUsername(),
                    request.getName(),
                    request.getPhoto(),
                    request.getTopicInterests(),
                    request.getBadges(),
                    request.getTag(),
                    request.getBio()
            );
            ParentInfoDTO parentInfoDTO=ParentInfoDTO.builder()
                    .parentId(p.getId())
                    .username(p.getUsername())
                    .name(p.getName())
                    .photo(p.getPhoto())
                    .build();

            // Add the new pending request to the pendingRequests list
            p.getPendingRequests().add(pendingRequest);
            webClient
                    .put()
                    .uri("/api/user/{kidId}/addSentRequest", request.getChildId())  // API URL for User Service
                    .body(Mono.just(parentInfoDTO), ParentInfoDTO.class)  // Pass the SentRequest in the body
                    .retrieve()
                    .bodyToMono(Void.class)  // Expecting no response body
                    .block();  // Non-blocking call

            // Save the updated parent object to the database
            parentRepository.save(p);

        }
    }

    public void approveChildRequest(String parentId, String childId) {
        Optional<Parent> parent = parentRepository.findById(parentId);
        if (parent.isPresent()) {
            Parent p = parent.get();
            p.getPendingRequests().removeIf(request -> request.getChildId().equals(childId));
                p.getChildIds().add(childId);
                log.info("{}",p.getChildIds());
                parentRepository.save(p);

                // Add the parent ID to the child's list via the User service
                webClient.put()
                        .uri(uriBuilder -> uriBuilder
                                .path("/api/user/addParent")    // Base path for your API
                                .queryParam("childId", childId)   // Add childId as query param
                                .queryParam("parentId", parentId) // Add parentId as query param
                                .build())                         // Build the final URI
                        .retrieve()
                        .bodyToMono(Void.class)  // Expecting no response body
                        .block();  // Non-blocking call
            }
        }

    // Method to get all child info (both accepted and pending)
    public List<ChildInfoDTO> getAllChildInfo(String parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        // List for storing both accepted and pending child info
        List<ChildInfoDTO> allChildrenInfo = new ArrayList<>();

        // Fetch accepted children info from childIds list
        List<ChildInfoDTO> acceptedChildren = parent.getChildIds().stream()
                .map(this::getChildInfoFromUserService)
                .collect(Collectors.toList());

        // Fetch pending requests info from pendingRequests list
        /*List<ChildRequestDTO> pendingChildren = parent.getPendingRequests().stream()
                .map(pending -> getChildInfoFromUserService(pending.getChildId()))
                .collect(Collectors.toList());

         */

        // Add both accepted and pending child info to the list
        allChildrenInfo.addAll(acceptedChildren);
       // allChildrenInfo.addAll(pendingChildren);

        return allChildrenInfo;
    }

    // Helper method to fetch child info from User service using WebClient
    private ChildInfoDTO getChildInfoFromUserService(String childId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/user/child")
                        .queryParam("id",childId)
                        .build())
                .retrieve()
                .bodyToMono(ChildInfoDTO.class)
                .block();  // Blocking for simplicity, can be made non-blocking
    }

    public ChildInfoDTO getAChildInfoById( String childId) {
        return getChildInfoFromUserService(childId);
    }

    public List<ParentResponseDTO> getParentsByChildId(String childId) {
        return parentRepository.findByChildIdsContaining(childId)
                .stream()
                .map(this::mapToParentResponse)
                .collect(Collectors.toList());
    }

    public ParentResponseDTO loginUser(String username, String rawPassword) {
        // Find parent by username using Optional to handle potential null value
        Optional<Parent> optionalParent = parentRepository.findByUsername(username);

        // If the parent exists and the password matches, return the response, otherwise return null
        return optionalParent.filter(parent -> passwordEncoder.matches(rawPassword, parent.getPassword()))
                .map(this::mapToParentResponse)
                .orElse(null);  // Return null if the login fails (username not found or password mismatch)


    }
}
