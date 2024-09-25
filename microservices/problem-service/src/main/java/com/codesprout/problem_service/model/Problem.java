package com.codesprout.problem_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Problem {
    @Id
    private String problemId;
    private String category;
    private String story;
    private String task;
    private Solution solution;
    private List<String> hint;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Solution {
        private List<MidAreaList> midAreaLists;
        private List<Character> characters;

    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MidAreaList {
        private String id;
        private List<Comp> comps;
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
        private Position position;
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


}