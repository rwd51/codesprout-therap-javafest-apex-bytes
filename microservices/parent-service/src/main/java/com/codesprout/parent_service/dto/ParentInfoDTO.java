package com.codesprout.parent_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentInfoDTO {
    private String parentId;
    private String username;

    private String name;

    private String photo;
}
