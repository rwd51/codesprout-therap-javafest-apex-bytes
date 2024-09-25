package com.codesprout.recommendation_service.service;

import com.codesprout.recommendation_service.config.RecombeeConfig;
import com.codesprout.recommendation_service.model.Project;
import com.codesprout.recommendation_service.model.User;
import com.recombee.api_client.RecombeeClient;
import com.recombee.api_client.api_requests.*;
import com.recombee.api_client.bindings.RecommendationResponse;
import com.recombee.api_client.exceptions.ApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.recombee.api_client.exceptions.ApiException;

@Service
public class RecommendationService {

    @Autowired
    private RecombeeClient recombeeClient;

    @Autowired
    private RecombeeConfig recombeeConfig;

    @Autowired
    private DataService dataService;
    public void clearRecombeeDatabase() {
        try {
            recombeeConfig.executeRecombeeRequest(recombeeClient, new ResetDatabase());
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to clear Recombee database", e);
        }
    }

    public void initializeRecombeeProperties() {
        recombeeConfig.executeRecombeeRequest(recombeeClient, new AddUserProperty("topicInterests", "set"));
        recombeeConfig.executeRecombeeRequest(recombeeClient, new AddItemProperty("tags", "set"));
    }

    public void addUserToRecombee(User user) {
        recombeeConfig.executeRecombeeRequest(recombeeClient, new AddUser(user.getId()));

        Map<String, Object> userValues = new HashMap<>();
        userValues.put("topicInterests", user.getTopicInterests());
        recombeeConfig.executeRecombeeRequest(recombeeClient, new SetUserValues(user.getId(), userValues));
    }

    public void addProjectToRecombee(Project project) {
        recombeeConfig.executeRecombeeRequest(recombeeClient, new AddItem(project.getProjectId()));

        Map<String, Object> projectValues = new HashMap<>();
        projectValues.put("tags", project.getTags());
        recombeeConfig.executeRecombeeRequest(recombeeClient, new SetItemValues(project.getProjectId(), projectValues));
    }

    public List<String> recommendProjectsForUser(String userId, int count) {
        RecommendationResponse response = null;
        try {
            response = recombeeClient.send(new RecommendItemsToUser(userId, count));
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (response != null) {
            return List.of(response.getIds());
        }
        return null;
    }

    public void loadAllDataIntoRecombee() {
       // clearRecombeeDatabase();
        initializeRecombeeProperties();  // Ensure properties are created first

        List<User> users = dataService.getAllUsers();
        List<Project> projects = dataService.getAllProjects();

        for (User user : users) {
            addUserToRecombee(user);
        }

        for (Project project : projects) {
            addProjectToRecombee(project);
        }
    }
}