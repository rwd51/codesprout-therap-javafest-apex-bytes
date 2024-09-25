package com.codesprout.parent_service.model;


import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "parents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Parent {
    @Id
    private String id;
    private String username;
    private String password;
    private String name;
    private String email;

    private String photo;
    private List<String> childIds; // List of accepted child user IDs
    private List<PendingRequests> pendingRequests;
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PendingRequests{
        private String childId;
        private String username;
        private String name;
        private String photo;
        private List<String> topicInterests;
        private List<String> badges;
        private String tag;
        private String bio;

    }
}
