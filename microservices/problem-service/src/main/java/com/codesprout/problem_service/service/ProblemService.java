package com.codesprout.problem_service.service;

import com.codesprout.problem_service.config.WebClientConfig;
import com.codesprout.problem_service.dto.ProblemRequest;
import com.codesprout.problem_service.dto.ProblemResponse;
import com.codesprout.problem_service.dto.ProblemUserDTO;
import com.codesprout.problem_service.dto.SolutionCheckDTO;
import com.codesprout.problem_service.model.Problem;
import com.codesprout.problem_service.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final WebClient webClient;
    public ProblemResponse createProblem(ProblemRequest problemRequest) {
        // Map ProblemRequest to Problem
        Problem newProblem = new Problem();
        newProblem.setCategory(problemRequest.getCategory());
        newProblem.setStory(problemRequest.getStory());
        newProblem.setTask(problemRequest.getTask());
        newProblem.setSolution(problemRequest.getSolution());
        newProblem.setHint(problemRequest.getHint());

        // Save to MongoDB, problemId will be automatically generated
        newProblem = problemRepository.save(newProblem);

        // Return ProblemResponse
        return mapToProblemResponse(newProblem);
    }

    public ProblemResponse getProblemById(String id) {
        Optional<Problem> existingProblemOpt = problemRepository.findById(id);
        return existingProblemOpt.map(this::mapToProblemResponse).orElse(null);
    }

    public List<ProblemResponse> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(this::mapToProblemResponse)
                .collect(Collectors.toList());
    }

    public ProblemResponse updateProblem(String id, ProblemRequest problemRequest) {
        Optional<Problem> existingProblemOpt = problemRepository.findById(id);

        if (existingProblemOpt.isPresent()) {
            Problem existingProblem = existingProblemOpt.get();
            // Update fields
            existingProblem.setCategory(problemRequest.getCategory());
            existingProblem.setStory(problemRequest.getStory());
            existingProblem.setTask(problemRequest.getTask());
            existingProblem.setSolution(problemRequest.getSolution());
            existingProblem.setHint(problemRequest.getHint());

            // Save the updated problem
            existingProblem = problemRepository.save(existingProblem);

            return mapToProblemResponse(existingProblem);
        }
        return null;  // Or throw a NotFoundException
    }


    public void deleteProblem(String id) {
        problemRepository.deleteById(id);
    }
    public Problem addSolution(String problemId, Problem.Solution solution) {
        Optional<Problem> existingProblemOpt = problemRepository.findById(problemId);

        if (existingProblemOpt.isPresent()) {
            Problem existingProblem = existingProblemOpt.get();
            // Set the solution
            existingProblem.setSolution(solution);
            // Save the updated problem with the solution
            return problemRepository.save(existingProblem);
        }
        return null;
    }
    public List<Problem> getProblemsByCategory(String category) {
        return problemRepository.findByCategory(category);
    }
    // Helper function to compare solutions deeply

    public boolean compareSolutions(SolutionCheckDTO submittedSolutionDTO) {
        // Fetch the problem by its ID
        Optional<Problem> optProblem = problemRepository.findById(submittedSolutionDTO.getProblemId());

        // Return false early if the problem is not found
        if (!optProblem.isPresent()) {
            return false;
        }

        // Get the correct solution's MidAreaList
        List<Problem.MidAreaList> correctSolution = optProblem.get().getSolution().getMidAreaLists();
        List<Problem.MidAreaList> submittedSolution = submittedSolutionDTO.getMidAreaLists();

        // Check if the size of both solutions is different
        if (correctSolution.size() != submittedSolution.size()) {
            return false;
        }

        // Compare each MidAreaList's fields, including comps and other fields
        for (int i = 0; i < correctSolution.size(); i++) {
            Problem.MidAreaList correctList = correctSolution.get(i);
            Problem.MidAreaList submittedList = submittedSolution.get(i);

            // Compare components (comps)
            if (!compareComponents(correctList.getComps(), submittedList.getComps())) {
                return false;
            }
        }

        // Update user with solved problem (add timeout for safety)
        String userServiceUrl = "/api/user/add/solvedProblems";
        ProblemUserDTO problemUserDTO = new ProblemUserDTO();
        problemUserDTO.setProblemId(submittedSolutionDTO.getProblemId());
        problemUserDTO.setUserId(submittedSolutionDTO.getUserId());

        webClient.put()
                .uri(userServiceUrl)
                .bodyValue(problemUserDTO)
                .retrieve()
                .bodyToMono(Void.class)

                .block();

        return true;
    }

    // Helper function to compare the list of Comp objects
    private boolean compareComponents(List<Problem.Comp> correctComps, List<Problem.Comp> submittedComps) {
        // Return false if either list is null
        if (correctComps == null || submittedComps == null) {
            log.info("null mistake");
            return false;
        }

        // Check size of both Comp lists
        if (correctComps.size() != submittedComps.size()) {
            log.info("size mistake");
            return false;
        }

        // Compare each Comp object
        for (int i = 0; i < correctComps.size(); i++) {
            Problem.Comp correctComp = correctComps.get(i);
            Problem.Comp submittedComp = submittedComps.get(i);

            // Compare Comp ID
            if (!correctComp.getId().equals(submittedComp.getId())) {
                log.info("string mistake");
                return false;
            }

            // Compare values in the Comp
            if (!compareValues(correctComp.getValues(), submittedComp.getValues())) {
                log.info("values");
                return false;
            }

            // Compare active status
            if (correctComp.isActive() != submittedComp.isActive()) {
                log.info("Active");
                return false;
            }
        }

        return true;
    }

    // Helper function to compare List<Object> values
    private boolean compareValues(List<Object> correctValues, List<Object> submittedValues) {
        if (correctValues == null || submittedValues == null) {
            return false;
        }

        if (correctValues.size() != submittedValues.size()) {
            return false;
        }

        for (int i = 0; i < correctValues.size(); i++) {
            Object correctValue = correctValues.get(i);
            Object submittedValue = submittedValues.get(i);

            // Compare individual values using equals
            if (!correctValue.equals(submittedValue)) {
                return false;
            }
        }

        return true;
    }

    public Map<String, Long> getSolveCountByCategory(String userId) {
        // Fetch solved problem IDs from User service
        List<String> solvedPuzzleIds = webClient
                .get()
                .uri("/api/user/{userId}/solved/puzzles", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .block();
        // If solvedPuzzleIds is null or empty, return counts set to 0 for each category
        if (solvedPuzzleIds == null || solvedPuzzleIds.isEmpty()) {
            Map<String, Long> emptyCountMap = new HashMap<>();
            emptyCountMap.put("Beginner", 0L);
            emptyCountMap.put("Intermediate", 0L);
            emptyCountMap.put("Advanced", 0L);
            return emptyCountMap;
        }

        // Fetch problem details for the solved problems
        List<Problem> solvedProblems = problemRepository.findByProblemIdIn(solvedPuzzleIds);

        // Count problems by category
        Map<String, Long> solveCountByCategory = solvedProblems.stream()
                .collect(Collectors.groupingBy(Problem::getCategory, Collectors.counting()));
        // If a category doesn't exist, explicitly set it to 0
        solveCountByCategory.putIfAbsent("Beginner", 0L);
        solveCountByCategory.putIfAbsent("Intermediate", 0L);
        solveCountByCategory.putIfAbsent("Advanced", 0L);

        return solveCountByCategory;
    }
    public Map<String, Long> getCategoryWiseSolvedCount(String userId) {
        // Step 1: Fetch solved problem IDs from User microservice
        List<String> solvedPuzzleIds = webClient
                .get()
                .uri("/api/user/{userId}/solved/puzzles", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .block();

        // Step 2: Fetch problem details by IDs from Problem microservice
        List<Problem> solvedProblems = problemRepository.findByProblemIdIn(solvedPuzzleIds);

        // Step 3: Group problems by category and count
        Map<String, Long> categoryWiseCount = solvedProblems.stream()
                .collect(Collectors.groupingBy(Problem::getCategory, Collectors.counting()));

        return categoryWiseCount;
    }
    public Map<String, Object> calculateProblemSolvingScore(String userId) {
        // Step 1: Fetch solved problem IDs from User service
        List<String> solvedPuzzleIds = webClient
                .get()
                .uri("/api/user/{userId}/solved/puzzles", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .block();

        // Step 2: Fetch problem details by IDs
        List<Problem> solvedProblems = problemRepository.findByProblemIdIn(solvedPuzzleIds);

        // Step 3: Count problems by category
        long beginnerSolved = solvedProblems.stream().filter(p -> "Beginner".equals(p.getCategory())).count();
        long intermediateSolved = solvedProblems.stream().filter(p -> "Intermediate".equals(p.getCategory())).count();
        long advancedSolved = solvedProblems.stream().filter(p -> "Advanced".equals(p.getCategory())).count();

        // Step 4: Calculate the numerator and denominator for the formula
        double numerator = beginnerSolved + intermediateSolved + advancedSolved;
        double denominator = (5 * beginnerSolved) + (3 * intermediateSolved) + (2 * advancedSolved);

        // Step 5: Calculate the problem-solving score (handle case where denominator is 0)
        double problemSolvingScore = denominator > 0 ? (numerator / denominator) * 100 : 0;

        // Step 6: Return all parameters and the score
        Map<String, Object> result = new HashMap<>();
        result.put("problemSolvingScore", problemSolvingScore);
        result.put("beginnerSolved", beginnerSolved);
        result.put("intermediateSolved", intermediateSolved);
        result.put("advancedSolved", advancedSolved);
        result.put("numerator", numerator);
        result.put("denominator", denominator);

        return result;
    }


        private ProblemResponse mapToProblemResponse(Problem problem) {
        return new ProblemResponse(
                problem.getProblemId(),  // Convert ObjectId to String
                problem.getCategory(),
                problem.getStory(),
                problem.getTask(),
                problem.getSolution(),
                problem.getHint()
        );
    }

}
