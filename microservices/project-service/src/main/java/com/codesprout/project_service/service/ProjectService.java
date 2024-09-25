package com.codesprout.project_service.service;

import com.codesprout.project_service.dto.ProjectRequest;
import com.codesprout.project_service.dto.ProjectResponse;
import com.codesprout.project_service.dto.ProjectUserRequest;
import com.codesprout.project_service.model.Project;
import com.codesprout.project_service.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final WebClient webClient;
    public Project createProject(ProjectRequest projectRequest){
        LocalDateTime creationDate = LocalDateTime.now();
        Project project = Project.builder()
                .projectName(projectRequest.getProjectName())
                .description(projectRequest.getDescription())
                .userId(projectRequest.getUserId())
                .clonedUserIds(projectRequest.getClonedUserIds())
                .creationDate(creationDate)
                .lastUpdateDate(creationDate)
                .tags(projectRequest.getTags())
                .publicNaki(projectRequest.isPublicNaki())
                .collaborators(projectRequest.getCollaborators())
                .midAreaLists(projectRequest.getMidAreaLists())
                .characters(projectRequest.getCharacters())
                .active(projectRequest.getActive())
                .ratings(projectRequest.getRatings() != null ? projectRequest.getRatings() : new HashMap<>())

                .build();
        projectRepository.save(project);

        log.info("User ID for the project: {}", project.getUserId());

        // Call UserService to add the projectId to the user's project list
        String userServiceUrl = "/api/user/addProject";

        ProjectUserRequest projectUserRequest = new ProjectUserRequest();
        projectUserRequest.setUserId(String.valueOf(project.getUserId()));
        projectUserRequest.setProjectId(project.getProjectId());

        webClient.put()
                .uri(userServiceUrl)
                .bodyValue(projectUserRequest)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
        String recommendationServiceUrl = "http://localhost:8083/api/recommendation/project";



        webClient.post()
                .uri(recommendationServiceUrl)
                .bodyValue(project)
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        log.info("Project is saved and UserService is notified");
        return project;
    }
    public List<ProjectResponse> getAllProjects(String userId){
        return projectRepository.findByPublicNakiTrueAndUserIdNot(userId).stream().map(this::mapToProjectResponse).collect(Collectors.toList());
    }
    public List<Project> getProjectsByUserId(String id) {

        return projectRepository.findByUserId(id);
    }
    public int getUniqueCollaborationsCount(String userId) {
        List<Project> projects = projectRepository.findByCollaboratorsContaining(userId);
        return projects.size(); // Returns the count of unique projects the user is collaborating on
    }
    public ProjectResponse getProjectById(String id) {

        return projectRepository.findById(id)
                .map(this::mapToProjectResponse)
                .orElse(null);
    }
    public Project updateProject(String projectId, Project updatedProject) {
        // Find the existing project by projectId
        Optional<Project> existingProjectOptional = projectRepository.findById(projectId);

        if (existingProjectOptional.isPresent()) {
            Project existingProject = existingProjectOptional.get();
            LocalDateTime currentDate = LocalDateTime.now();
            // Update the existing project's fields with the new data
            existingProject.setProjectName(updatedProject.getProjectName());
            existingProject.setDescription(updatedProject.getDescription());
            existingProject.setUserId(updatedProject.getUserId());
            existingProject.setClonedUserIds(updatedProject.getClonedUserIds());
            existingProject.setCreationDate(updatedProject.getCreationDate());
            existingProject.setLastUpdateDate(currentDate);
            existingProject.setTags(updatedProject.getTags());
            existingProject.setPublicNaki(updatedProject.isPublicNaki());
            existingProject.setCollaborators(updatedProject.getCollaborators());
            existingProject.setMidAreaLists(updatedProject.getMidAreaLists());
            existingProject.setCharacters(updatedProject.getCharacters());
            existingProject.setActive(updatedProject.getActive());
            existingProject.setRatings(updatedProject.getRatings());

            // Save the updated project back to the repository
            return projectRepository.save(existingProject);
        } else {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
    }

    public int getClonedProjectsCount(String userId) {
        List<Project> projects = projectRepository.findByClonedUserIdsContaining(userId);
        return projects.size(); // Return the number of projects where the user has cloned
    }
    // Method to count how many times a user's projects have been cloned
    public int countProjectClonesByUserId(String userId) {
        List<Project> userProjects = projectRepository.findByUserId(userId);
        return userProjects.stream()
                .mapToInt(project -> project.getClonedUserIds() != null ? project.getClonedUserIds().size() : 0)
                .sum(); // Sum the lengths of the clonedUserIds lists
    }
    public double calculateAverageRatingByUserId(String userId) {
        List<Project> userProjects = projectRepository.findByUserId(userId);

        double totalRatingsSum = 0;
        int totalRatingCount = 0;

        // Iterate over all projects of the user and sum their ratings
        for (Project project : userProjects) {
            if (project.getRatings() != null && !project.getRatings().isEmpty()) {
                Map<String, Float> ratings = project.getRatings();
                totalRatingsSum += ratings.values().stream().mapToDouble(Float::doubleValue).sum();
                totalRatingCount += ratings.size();
            }
        }

        // Calculate the average rating
        return totalRatingCount > 0 ? totalRatingsSum / totalRatingCount : 0;
    }
    // Method to find the highest-rated project for a specific user
    public float findMaxRatingByUserId(String userId) {
        List<Project> userProjects = projectRepository.findByUserId(userId);

        return userProjects.stream()
                .filter(project -> project.getRatings() != null && !project.getRatings().isEmpty())
                .flatMap(project -> project.getRatings().values().stream())
                .max(Float::compareTo)
                .orElse(0.0f);
    }
    public Map<String, Object> getAverageMaxAndTotalRatingsByUserId(String userId) {
        List<Project> userProjects = projectRepository.findByUserId(userId);

        double totalRatingsSum = 0;
        int totalRatingCount = 0;
        float maxRating = 0.0f;

        // Iterate over all projects of the user
        for (Project project : userProjects) {
            if (project.getRatings() != null && !project.getRatings().isEmpty()) {
                Map<String, Float> ratings = project.getRatings();
                totalRatingsSum += ratings.values().stream().mapToDouble(Float::doubleValue).sum();
                totalRatingCount += ratings.size();

                // Find max rating
                float currentMax = ratings.values().stream().max(Float::compareTo).orElse(0.0f);
                if (currentMax > maxRating) {
                    maxRating = currentMax;
                }
            }
        }

        // Calculate the average rating
        double averageRating = totalRatingCount > 0 ? totalRatingsSum / totalRatingCount : 0;

        // Prepare response as a map
        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", averageRating);
        response.put("maxRating", maxRating);
        response.put("totalRatings", totalRatingCount);

        return response;
    }
    // Method to count total number of projects for a specific user
    public long countTotalProjectsByUserId(String userId) {
        return projectRepository.findByUserId(userId).size();
    }
    public List<Map<String, Object>> getTop5ClonedProjectsByUserId(String userId) {
        List<Project> userProjects = projectRepository.findByUserId(userId);

        // Sort projects by size of clonedUserIds and limit to top 5
        return userProjects.stream()
                .filter(project -> project.getClonedUserIds() != null)  // Ensure clonedUserIds is not null
                .sorted(Comparator.comparingInt((Project p) -> p.getClonedUserIds().size()).reversed()) // Sort by clone count
                .limit(5)
                .map(project -> {
                    Map<String, Object> projectInfo = Map.of(
                            "projectId", project.getProjectId(),
                            "projectName", project.getProjectName(),
                            "description", project.getDescription(),
                            "tags", project.getTags(),
                            "clonedCount", project.getClonedUserIds().size()
                    );
                    return projectInfo;
                })
                .collect(Collectors.toList());
    }

    // Method to calculate the average rating for a project
    private double calculateAverageRating(Project project) {
        Map<String, Float> ratings = project.getRatings();
        OptionalDouble average = ratings.values().stream().mapToDouble(Float::doubleValue).average();
        return average.isPresent() ? average.getAsDouble() : 0;
    }

    // Method to find the most cloned projects
    public List<Project> findMostClonedProjectsAmongAll() {
        List<Project> allProjects = projectRepository.findAll();

        // Sort the projects by the number of clonedUserIds (descending order) and return the top projects
        return allProjects.stream()
                .filter(project -> project.getClonedUserIds() != null && !project.getClonedUserIds().isEmpty())
                .sorted(Comparator.comparingInt((Project p) -> p.getClonedUserIds().size()).reversed())
                .collect(Collectors.toList());
    }

    // Method to find the most cloned projects for a specific user
    public List<Project> findMostClonedProjectsByUserId(String userId) {
        List<Project> userProjects = projectRepository.findByUserId(userId);

        // Sort the projects by the number of clonedUserIds (descending order) and return the sorted list
        return userProjects.stream()
                .filter(project -> project.getClonedUserIds() != null && !project.getClonedUserIds().isEmpty())
                .sorted(Comparator.comparingInt((Project p) -> p.getClonedUserIds().size()).reversed())
                .collect(Collectors.toList());
    }
    public ProjectResponse cloneProject(Project project,String userId){
            LocalDateTime currentDate = LocalDateTime.now();
            Project newProject = Project.builder()
                    .projectName(project.getProjectName())
                    .description(project.getDescription())
                    .userId(userId)
                    .clonedUserIds(new ArrayList<>())
                    .creationDate(currentDate)
                    .lastUpdateDate(currentDate)
                    .tags(project.getTags())
                    .publicNaki(project.isPublicNaki())
                    .collaborators(new ArrayList<>())
                    .midAreaLists(project.getMidAreaLists())
                    .characters(project.getCharacters())
                    .active(project.getActive())
                    .ratings( new HashMap<>())
                    .build();
            projectRepository.save(newProject);
        // Call UserService to add the projectId to the user's project list
        String userServiceUrl = "/api/user/addProject/clone";

        ProjectUserRequest projectUserRequest = new ProjectUserRequest();
        projectUserRequest.setUserId(String.valueOf(newProject.getUserId()));
        projectUserRequest.setProjectId(newProject.getProjectId());

        webClient.put()
                .uri(userServiceUrl)
                .bodyValue(projectUserRequest)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
        Optional<Project> existingProjectOptional = projectRepository.findById(project.getProjectId());
        if (existingProjectOptional.isPresent()) {
            Project existingProject = existingProjectOptional.get();
            List<String> clonedUserIds = existingProject.getClonedUserIds();
            if (clonedUserIds == null) {
                clonedUserIds = new ArrayList<>();  // Initialize the list if it's null
            }
            clonedUserIds.add(userId);  // Add the new userId to the list
            existingProject.setClonedUserIds(clonedUserIds);  // Set the updated list back to the project
            projectRepository.save(existingProject);

            return mapToProjectResponse(newProject);


        }else {
            throw new RuntimeException("Project not found with id: " + project.getProjectId());
        }







    }
    public List<ProjectResponse> getCollaboratingProjectsByUserId(String userId) {
        // Fetch projects where the user is collaborating
        List<Project> collaboratingProjects = projectRepository.findByCollaboratorsContaining(userId);

        // Convert Project to ProjectResponseDTO
        return collaboratingProjects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> calculateCreativityScore(String userId) {
        // Fetch user projects
        int ownProjectsCount = projectRepository.countByUserId(userId);
        int clonedProjectsCount = projectRepository.countByClonedUserIdsContaining(userId);
        int collaboratingProjectsCount = projectRepository.countByCollaboratorsContaining(userId);
        log.info("{}",collaboratingProjectsCount);

        // Total projects
        int totalProjects = ownProjectsCount + clonedProjectsCount + collaboratingProjectsCount;

        // Calculate creativity score
        double creativityScore = (ownProjectsCount / (double) totalProjects) * 100;

        // Return score and parameters used
        Map<String, Object> result = new HashMap<>();
        result.put("creativityScore", creativityScore);
        result.put("ownProjectsCount", ownProjectsCount);
        result.put("totalProjects", totalProjects);
        result.put("clonedProjectsCount",clonedProjectsCount);
        result.put("collaboratingProjectsCount",collaboratingProjectsCount);
        return result;
    }

    public Map<String, Object> calculateCollaborationScore(String userId) {
        // Fetch collaborating projects count
        int collaboratingProjectsCount = projectRepository.countByCollaboratorsContaining(userId);
        int ownProjectsCount = projectRepository.countByUserId(userId);
        int clonedProjectsCount = projectRepository.countByClonedUserIdsContaining(userId);

        // Total projects (including own, cloned, and collaborating)
        int totalProjects = ownProjectsCount + clonedProjectsCount + collaboratingProjectsCount;

        // Calculate collaboration score, prevent division by zero
        double collaborationScore = 0;
        if (totalProjects > 0) {
            collaborationScore = (collaboratingProjectsCount / (double) totalProjects) * 100;
        }

        // Return score and parameters used
        Map<String, Object> result = new HashMap<>();
        result.put("collaborationScore", collaborationScore);  // If totalProjects == 0, score will be 0
        result.put("collaboratingProjectsCount", collaboratingProjectsCount);
        result.put("totalProjects", totalProjects);

        return result;
    }

    public Map<String, Integer> getCloneStatsByProjectId(String projectId) {
        // Fetch the project by projectId
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Count how many times each user cloned this project
        Map<String, Long> cloneCounts = project.getClonedUserIds().stream()
                .collect(Collectors.groupingBy(userId -> userId, Collectors.counting()));

        // Initialize a map to store the clone stats
        Map<String, Integer> cloneStats = new HashMap<>();
        cloneStats.put("1X", 0);
        cloneStats.put("2X", 0);
        cloneStats.put("3X", 0);
        cloneStats.put("4X", 0);
        cloneStats.put("5X", 0);

        // Iterate through the clone counts and populate the stats
        cloneCounts.forEach((userId, count) -> {
            if (count >= 1 && count <= 5) {
                String key = count + "X"; // e.g., "1X", "2X"
                cloneStats.put(key, cloneStats.get(key) + 1);
            }
        });

        return cloneStats;
    }


    private ProjectResponse mapToProjectResponse(Project project) {
        return ProjectResponse.builder()
                .projectId(project.getProjectId())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .userId(project.getUserId())
                .clonedUserIds(project.getClonedUserIds())
                .creationDate(project.getCreationDate())
                .lastUpdateDate(project.getLastUpdateDate())
                .tags(project.getTags())
                .publicNaki(project.isPublicNaki())
                .collaborators(project.getCollaborators())
                .midAreaLists(project.getMidAreaLists()) // Assuming midAreaLists is properly mapped
                .characters(project.getCharacters())     // Assuming characters is properly mapped
                .active(project.getActive())
                .ratings(project.getRatings())// Assuming active is properly mapped
                .build();
    }

}
