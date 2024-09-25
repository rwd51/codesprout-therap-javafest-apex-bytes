package com.codesprout.problem_service.controller;

import com.codesprout.problem_service.dto.SolutionCheckDTO;
import com.codesprout.problem_service.model.Problem;
import com.codesprout.problem_service.service.ProblemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.codesprout.problem_service.dto.ProblemRequest;
import com.codesprout.problem_service.dto.ProblemResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    // Create a new problem
    @PostMapping
    public ProblemResponse createProblem(@RequestBody ProblemRequest problemRequest) {
        return problemService.createProblem(problemRequest);
    }

    // Get a problem by ID
    @GetMapping("/{id}")
    public ProblemResponse getProblemById(@PathVariable("id") String id) {
        return problemService.getProblemById(id);
    }

    // Get all problems
    @GetMapping
    public List<ProblemResponse> getAllProblems() {
        return problemService.getAllProblems();
    }

    // Update a problem by ID
    @PutMapping("/{id}")
    public ProblemResponse updateProblem(@PathVariable("id") String id, @RequestBody ProblemRequest problemRequest) {
        return problemService.updateProblem(id, problemRequest);
    }

    // Delete a problem by ID
    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable("id") String id) {
        problemService.deleteProblem(id);
    }
    @PutMapping("/{problemId}/solution")
    public Problem addSolution(@PathVariable("problemId") String problemId, @RequestBody Problem.Solution solution) {
        return problemService.addSolution(problemId, solution);
    }
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Problem>> getProblemsByCategory(@PathVariable String category) {
        List<Problem> problems = problemService.getProblemsByCategory(category);
        // Return an empty list as JSON if no problems are found
        return new ResponseEntity<>(problems, HttpStatus.OK);
    }
    @PostMapping("/check")
    public ResponseEntity<Map<String, String>> solveProblem(
            @RequestBody SolutionCheckDTO submittedSolution) {

        // Compare all components of midAreaLists
        boolean isCorrect = problemService.compareSolutions(submittedSolution);

        // Prepare response map
        Map<String, String> response = new HashMap<>();
        if (isCorrect) {
            response.put("result", "correct");
        } else {
            response.put("result", "incorrect");
        }

        // Return the response map
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/solveCount")
    public ResponseEntity<Map<String, Long>> getSolveCountByCategory(@PathVariable String userId) {
        Map<String, Long> solveCount = problemService.getSolveCountByCategory(userId);
        return ResponseEntity.ok(solveCount);
    }
    @GetMapping("/user/{userId}/problemScore")
    public ResponseEntity<Map<String, Object>> getProblemSolvingScore(@PathVariable String userId) {
        Map<String, Object> scoreData = problemService.calculateProblemSolvingScore(userId);
        return ResponseEntity.ok(scoreData);
    }
   /* @GetMapping("/problem/solving/{userId}")
    public ResponseEntity<Map<String, Object>> getProblemSolvingScore(@PathVariable String userId) {
        Map<String, Object> score = problemService.calculateProblemSolvingScore(userId);
        return ResponseEntity.ok(score);
    }

    */

}