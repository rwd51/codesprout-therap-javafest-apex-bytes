package com.codesprout.project_service.controller;

import com.codesprout.project_service.dto.ProjectRequest;
import com.codesprout.project_service.dto.ProjectResponse;
import com.codesprout.project_service.model.Project;
import com.codesprout.project_service.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest projectRequest){

        Project project =  projectService.createProject(projectRequest);
        if (project == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // Assuming no additional checks like authorization are needed, otherwise, include them here

        return ResponseEntity.ok(project);
    }
    @GetMapping("/allPublic/{userId}")
    public ResponseEntity<List<ProjectResponse>> getAllProjects(@PathVariable String userId){
        List<ProjectResponse> projectResponses=projectService.getAllProjects(userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(projectResponses, headers, HttpStatus.OK);

    }

    @GetMapping
    public ResponseEntity<ProjectResponse> getProjectById(@RequestParam String id) {

        ProjectResponse projectResponse = projectService.getProjectById(id);
        if (projectResponse == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Assuming no additional checks like authorization are needed, otherwise, include them here

        return ResponseEntity.ok(projectResponse);
    }

    //This api is incomplete complete korte hobe eee
    @GetMapping("/userId")
    public ResponseEntity<List<Project>> getProjectsByUserId(@RequestParam String id) {

        List<Project> projects = projectService.getProjectsByUserId(id);



        return ResponseEntity.ok(projects);
    }
    @PutMapping("/update")
    public ResponseEntity<Project> updateProject( @RequestBody Project updatedProject) {
        Project updatedProjectResponse = projectService.updateProject(updatedProject.getProjectId(), updatedProject);
        return ResponseEntity.ok(updatedProjectResponse);
    }
    @GetMapping("/collaborations/{userId}/count")
    public ResponseEntity<Map<String, Integer>> getUniqueCollaborationsCount(@PathVariable String userId) {
        int collaborationsCount = projectService.getUniqueCollaborationsCount(userId);
        Map<String, Integer> response = new HashMap<>();
        response.put("projectCollaborationCount", collaborationsCount);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PostMapping("/clone/{userId}")
    public ResponseEntity<ProjectResponse> cloneProject(@RequestBody Project project,@PathVariable String userId){
        ProjectResponse projectResponse = projectService.cloneProject(project,userId);
        if (projectResponse == null) {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(projectResponse, headers, HttpStatus.OK);

    }
    @GetMapping("/user/{userId}/topCloned")
    public ResponseEntity<List<Map<String, Object>>> getTop5ClonedProjectsByUserId(@PathVariable String userId) {
        List<Map<String, Object>> topClonedProjects = projectService.getTop5ClonedProjectsByUserId(userId);
        return ResponseEntity.ok(topClonedProjects);
    }

    @GetMapping("/user/{userId}/clones/count")
    public ResponseEntity<Map<String, Integer>> countProjectClones(@PathVariable String userId) {
        int totalClones = projectService.countProjectClonesByUserId(userId);
        Map<String, Integer> response = new HashMap<>();
        response.put("totalClones", totalClones);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // API to get the average rating of all projects of a specific user
    @GetMapping("/user/{userId}/ratings/average")
    public ResponseEntity<Map<String, Double>> getAverageRatingByUserId(@PathVariable String userId) {
        double averageRating = projectService.calculateAverageRatingByUserId(userId);
        Map<String, Double> response = new HashMap<>();
        response.put("averageRating", averageRating);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}/ratings")
    public ResponseEntity<Map<String, Object>> getAverageMaxAndTotalRatingsByUserId(@PathVariable String userId) {
        Map<String, Object> ratingResponse = projectService.getAverageMaxAndTotalRatingsByUserId(userId);
        return ResponseEntity.ok(ratingResponse);
    }
    /*@GetMapping("/user/{userId}/highestrated")
    public ResponseEntity<ProjectResponse> getHighestRatedProjectByUserId(@PathVariable String userId) {
        ProjectResponse highestRatedProject = projectService.findHighestRatedProjectByUserId(userId);
        return new ResponseEntity<>(highestRatedProject, HttpStatus.OK);
    }
    */


    // API to get the most cloned projects of a specific user
    @GetMapping("/user/{userId}/mostCloned")
    public ResponseEntity<List<Project>> getMostClonedProjectsByUserId(@PathVariable String userId) {
        List<Project> mostClonedProjects = projectService.findMostClonedProjectsByUserId(userId);
        return new ResponseEntity<>(mostClonedProjects, HttpStatus.OK);
    }

    // API to get project clone count, collaboration count, and total project count for a specific user
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserProjectStatistics(@PathVariable String userId) {
        int totalClones = projectService.getClonedProjectsCount(userId);
        int collaborationsCount = projectService.getUniqueCollaborationsCount(userId);
        long totalProjects = projectService.countTotalProjectsByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("totalClones", totalClones);
        response.put("projectCollaborationCount", collaborationsCount);
        response.put("totalProjects", totalProjects);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}/collaborating")
    public ResponseEntity<List<ProjectResponse>> getCollaboratingProjectsByUserId(@PathVariable String userId) {
        List<ProjectResponse> collaboratingProjects = projectService.getCollaboratingProjectsByUserId(userId);
        return ResponseEntity.ok(collaboratingProjects);
    }
    @GetMapping("/creativity/{userId}")
    public ResponseEntity<Map<String, Object>> getCreativityScore(@PathVariable String userId) {
        Map<String, Object> score = projectService.calculateCreativityScore(userId);
        return ResponseEntity.ok(score);
    }

    @GetMapping("/collaboration/{userId}")
    public ResponseEntity<Map<String, Object>> getCollaborationScore(@PathVariable String userId) {
        Map<String, Object> score = projectService.calculateCollaborationScore(userId);
        return ResponseEntity.ok(score);
    }

    @GetMapping("/{projectId}/clone/stats")
    public ResponseEntity<Map<String, Integer>> getCloneStatsByProjectId(@PathVariable String projectId) {
        Map<String, Integer> cloneStats = projectService.getCloneStatsByProjectId(projectId);
        return ResponseEntity.ok(cloneStats);
    }



    
}
