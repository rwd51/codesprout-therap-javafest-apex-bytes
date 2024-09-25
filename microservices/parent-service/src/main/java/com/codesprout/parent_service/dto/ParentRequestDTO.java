package com.codesprout.parent_service.dto;

import com.codesprout.parent_service.model.Parent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentRequestDTO {

    private String username;
    private String password;
    private String name;
    private String email;

    private String photo;
    private List<String> childIds; // List of accepted child user IDs
    private List<Parent.PendingRequests> pendingRequests;
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
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
