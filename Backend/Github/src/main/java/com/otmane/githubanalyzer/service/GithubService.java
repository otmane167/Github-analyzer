package com.otmane.githubanalyzer.service;

import com.otmane.githubanalyzer.dto.GithubUserDTO;
import com.otmane.githubanalyzer.dto.RepoDTO;
import com.otmane.githubanalyzer.dto.ScoreResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.otmane.githubanalyzer.dto.AnalysisResponseDTO;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GithubService {

    private final RestTemplate restTemplate = new RestTemplate();

    public GithubUserDTO getUser(String username) {

        String url = "https://api.github.com/users/" + username;

        try {
            return restTemplate.getForObject(url, GithubUserDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "GitHub user '" + username + "' was not found"
            );
        }

    }

    public List<RepoDTO> getRepos(String username) {

        String url = "https://api.github.com/users/" + username + "/repos";

        RepoDTO[] repos = restTemplate.getForObject(url, RepoDTO[].class);

        return Arrays.asList(repos);

    }

    public Map<String, Long> getLanguageStats(String username) {
        List<RepoDTO> repos = getRepos(username);
        return repos.stream()
                .filter(repo -> repo.getLanguage() != null)
                .collect(Collectors.groupingBy(RepoDTO::getLanguage, Collectors.counting()));
    }

    public Map<String, Double> getLanguagePercentages(String username) {

        Map<String, Long> counts = getLanguageStats(username);

        int total = counts.values().stream()
                .mapToInt(Long::intValue)
                .sum();

        return counts.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> (entry.getValue() / (double) total) * 100
                ));

    }

    public int getTotalStars(String username) {
        List<RepoDTO> repos = getRepos(username);
        return repos.stream()
                .mapToInt(RepoDTO::getStargazers_count)
                .sum();
    }

    public double getScore(String username) {

        List<RepoDTO> repos = getRepos(username);
        GithubUserDTO user = getUser(username);

        int repoCount = repos.size();
        int totalStars = getTotalStars(username);

        double score = (repoCount * 10)
                + (Math.log(user.getFollowers() + 1) * 15)
                + (Math.log(totalStars + 1) * 15);

        return score;
    }

    public String getLevel(double score) {
        if (score < 100) {
            return "Beginner";
        } else if (score < 200) {
            return "Intermediate";
        } else if (score < 350) {
            return "Advanced";
        } else {
            return "Expert";
        }
    }

    public ScoreResponseDTO getScoreWithLevel(String username) {

        double score = getScore(username);
        String level = getLevel(score);

        ScoreResponseDTO result = new ScoreResponseDTO();
        result.setScore(score);
        result.setLevel(level);

        return result;

    }
    public AnalysisResponseDTO analyze(String username) {

        GithubUserDTO user = getUser(username);
        Map<String, Double> languages = getLanguagePercentages(username);
        ScoreResponseDTO scoreResult = getScoreWithLevel(username);

        AnalysisResponseDTO result = new AnalysisResponseDTO();
        result.setUsername(user.getLogin());
        result.setName(user.getName());
        result.setAvatarUrl(user.getAvatar_url());
        result.setFollowers(user.getFollowers());
        result.setPublicRepos(user.getPublic_repos());
        result.setLanguages(languages);
        result.setScore(scoreResult.getScore());
        result.setLevel(scoreResult.getLevel());

        return result;

    }

}