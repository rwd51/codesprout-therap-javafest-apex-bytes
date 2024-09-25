package com.codesprout.user_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(value="users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String name;
    private String email;
    private int age;
    private String photo;
    private String bio;
    private List<String> parentIds;
    private List<SentRequests> sentRequests;
    private List<String> projectIds;
    private List<String> clonedProjectIds;
    private List<String> solvedPuzzleIds;
    private List<String> topicInterests;
    private List<String> badges;
    private String tag;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SentRequests{
        private String parentId;
        private String username;
        private String name;
        private String photo;
        private String email;

    }


}
