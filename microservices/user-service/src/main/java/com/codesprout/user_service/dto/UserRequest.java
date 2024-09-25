package com.codesprout.user_service.dto;

import com.codesprout.user_service.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String username;
    private String password;
    private String name;
    private String email;
    private int age;
    private String photo;
    private String bio;
    private List<String> parentIds;
    private List<User.SentRequests> sentRequests;
    private List<String> projectIds;
    private List<String> clonedProjectIds;
    private List<String> solvedPuzzleIds;
    private List<String> topicInterests;
    private List<String> badges;
    private String tag;
}
