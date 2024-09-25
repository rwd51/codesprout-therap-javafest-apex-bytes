package com.codesprout.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KidInfo {
    private String id;
    private String username;
    private String name;
    private String email;
    private int age;
    private String photo;
    private String bio;
    private List<String> topicInterests;
    private List<String> badges;
    private String tag;
}
