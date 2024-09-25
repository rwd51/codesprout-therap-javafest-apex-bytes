package com.codesprout.user_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SentRequestDTO {
    private String parentId;
    private String username;
    private String name;
    private String photo;
    private String email;
}
