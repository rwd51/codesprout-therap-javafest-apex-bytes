package com.codesprout.recommendation_service.controller;


import com.codesprout.recommendation_service.model.Project;
import com.codesprout.recommendation_service.model.User;
import com.codesprout.recommendation_service.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/user")
    public void addUser(@RequestBody User user) {
        recommendationService.addUserToRecombee(user);
    }

    @PostMapping("/project")
    public void addProject(@RequestBody Project project) {
        recommendationService.addProjectToRecombee(project);
    }

    @GetMapping("/recommend/{userId}")
    public List<String> recommendProjects(@PathVariable String userId, @RequestParam(defaultValue = "5") int count) {
        return recommendationService.recommendProjectsForUser(userId, count);
    }
    @PostMapping("/load-all")
    public void loadAllDataIntoRecombee() {
        recommendationService.loadAllDataIntoRecombee();
    }
}