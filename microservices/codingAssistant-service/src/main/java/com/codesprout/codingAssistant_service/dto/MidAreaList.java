package com.codesprout.codingAssistant_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MidAreaList {
    private String id;
    private List<Comp> comps;
    private String characterId;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Comp {
        private String id;
        private List<Object> values;
        private boolean active;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Character {
        private String id;
        private String name;
        private int angle;
        private String type;
        private Position position;
        private int scale;
        private boolean visible;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Position {
        private int x;
        private int y;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Active {
        private String id;
        private String type;
    }

}

