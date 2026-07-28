package com.otmane.githubanalyzer.controller;

import com.otmane.githubanalyzer.dto.AnalysisResponseDTO;
import com.otmane.githubanalyzer.dto.GithubUserDTO;
import com.otmane.githubanalyzer.dto.RepoDTO;
import com.otmane.githubanalyzer.dto.ScoreResponseDTO;
import com.otmane.githubanalyzer.service.GithubService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/github")
@CrossOrigin(origins = "http://localhost:5173")
public class GithubController {
    private final GithubService service;
    public GithubController (GithubService service){
        this.service=service;
    }
    @GetMapping("/{username}")
    public GithubUserDTO getUser(@PathVariable String username) {
        return service.getUser(username);
    }
    @GetMapping("/{username}/repos")
    public List<RepoDTO> getRepos(@PathVariable String username) {
        return service.getRepos(username);
    }
    @GetMapping("/{username}/languages")
    public Map<String, Long> getLanguages(@PathVariable String username) {
        return service.getLanguageStats(username);
    }
    @GetMapping("/{username}/languages/percentage")
    public Map<String, Double> getLanguagePercentages(@PathVariable String username) {
        return service.getLanguagePercentages(username);
    }
    @GetMapping("/{username}/score")
    public ScoreResponseDTO getScore(@PathVariable String username) {
        return service.getScoreWithLevel(username);
    }
    @GetMapping("/{username}/analyze")
    public AnalysisResponseDTO analyze(@PathVariable String username) {
        return service.analyze(username);
    }

}
