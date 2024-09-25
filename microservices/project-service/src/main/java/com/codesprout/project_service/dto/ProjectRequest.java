package com.codesprout.project_service.dto;

import com.codesprout.project_service.model.Project;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRequest {
    private String projectName;
    private String description;
    private String userId;
    private List<String> clonedUserIds;
    private List<String> tags;
    @JsonProperty("public")
    private boolean publicNaki;
    private List<String> collaborators;
    private List<Project.MidAreaList> midAreaLists;
    private List<Project.Character> characters;
    private Project.Active active;
    //private List<Integer> ratings;
    private Map<String, Float> ratings;

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
