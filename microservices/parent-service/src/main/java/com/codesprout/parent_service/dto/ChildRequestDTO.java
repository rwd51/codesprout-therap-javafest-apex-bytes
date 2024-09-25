package com.codesprout.parent_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildRequestDTO {

        private String childId;
        private String username;

        private String name;

        private String photo;
        private List<String> topicInterests;
        private List<String> badges;
        private String tag;
        private String bio;


}
