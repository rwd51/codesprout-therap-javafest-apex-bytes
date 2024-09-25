package com.codesprout.problem_service.dto;

import com.codesprout.problem_service.model.Problem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolutionCheckDTO {
    private String userId;
    private String problemId;
    private List<Problem.MidAreaList> midAreaLists;
}
