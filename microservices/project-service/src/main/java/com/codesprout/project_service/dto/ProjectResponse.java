package com.codesprout.project_service.dto;

import com.codesprout.project_service.model.Project;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({
        "projectId",
        "projectName",
        "description",
        "userId",
        "clonedUserIds",
        "creationDate",
        "lastUpdateDate",
        "tags",
        "public",  // Ensure the order is correct
        "collaborators",
        "midAreaLists",
        "characters",
        "active",
        "ratings"
})

public class ProjectResponse {
    @Id
    private String projectId;
    private String projectName;
    private String description;
    private String userId;
    private List<String> clonedUserIds;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;
    private List<String> tags;
    @JsonProperty("public")
    private boolean publicNaki;
    private List<String> collaborators;
    private List<Project.MidAreaList> midAreaLists;
    private List<Project.Character> characters;
    private Project.Active active;
    private Map<String, Float> ratings;  // Updated here

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MidAreaList {
        private String id;
        private List<Project.Comp> comps;
        @JsonProperty("character_id")
        private String characterId;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comp {
        private String id;
        private List<Object> values;
        private boolean active;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Character {
        private String id;
        private float angle;
        private String type;
        private String name;
        private Project.Position position;
        private int scale;
        private boolean visible;
        private boolean showAngles;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Position {
        private int x;
        private int y;
        private Integer prevX;
        private Integer prevY;
        private boolean run;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Active {
        private String id;
        private String type;
        private String name;
        private float angle;
        private Project.Position position;
        private int scale;
        private boolean visible;
        private boolean showAngles;
    }
}
