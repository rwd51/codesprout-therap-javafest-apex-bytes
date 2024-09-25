package com.codesprout.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTopicInterestsPhotoBio {
    private List<String> topicInterests;
    private String photo;
    private String bio;

}

