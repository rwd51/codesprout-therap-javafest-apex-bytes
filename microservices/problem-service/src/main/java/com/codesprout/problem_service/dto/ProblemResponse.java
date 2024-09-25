package com.codesprout.problem_service.dto;

import com.codesprout.problem_service.model.Problem;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemResponse {
    @Id
    private String problemId;
    private String category;
    private String story;
    private String task;
    private Problem.Solution solution;
    private List<String> hint;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Solution {
        private List<Problem.MidAreaList> midAreaLists;
        private List<Problem.Character> characters;

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MidAreaList {
        private String id;
        private List<Problem.Comp> comps;
        @JsonProperty("character_id")
        private String characterId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comp {
        private String id;
        private List<Object> values;
        private boolean active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Character {
        private String id;
        private float angle;
        private String type;
        private String name;
        private Problem.Position position;
        private int scale;
        private boolean visible;
        private boolean showAngles;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Position {
        private int x;
        private int y;
        private Integer prevX;
        private Integer prevY;
        private boolean run;
    }


}
