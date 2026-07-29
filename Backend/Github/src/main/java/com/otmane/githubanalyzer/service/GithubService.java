package com.otmane.githubanalyzer.service;

import com.otmane.githubanalyzer.dto.AnalysisResponseDTO;
import com.otmane.githubanalyzer.dto.GithubUserDTO;
import com.otmane.githubanalyzer.dto.RepoDTO;
import com.otmane.githubanalyzer.dto.ScoreResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GithubService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${github.token:}")
    private String githubToken;

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if (githubToken != null && !githubToken.isBlank()) {
            headers.setBearerAuth(githubToken);
        }
        return headers;
    }

    public GithubUserDTO getUser(String username) {

        String url = "https://api.github.com/users/" + username;

        try {
            ResponseEntity<GithubUserDTO> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), GithubUserDTO.class
            );
            return response.getBody();
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "GitHub user '" + username + "' was not found"
            );
        } catch (HttpClientErrorException.Forbidden e) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "GitHub API rate limit reached. Try again later, or set GITHUB_TOKEN."
            );
        }

    }

    public List<RepoDTO> getRepos(String username) {

        String url = "https://api.github.com/users/" + username + "/repos";

        try {
            ResponseEntity<RepoDTO[]> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), RepoDTO[].class
            );
            RepoDTO[] repos = response.getBody();
            return repos == null ? List.of() : Arrays.asList(repos);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "GitHub user '" + username + "' was not found"
            );
        } catch (HttpClientErrorException.Forbidden e) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "GitHub API rate limit reached. Try again later, or set GITHUB_TOKEN."
            );
        }

    }

    // ---- standalone endpoints below still work independently for debugging ----

    public Map<String, Long> getLanguageStats(String username) {
        List<RepoDTO> repos = getRepos(username);
        return repos.stream()
                .filter(repo -> repo.getLanguage() != null)
                .collect(Collectors.groupingBy(RepoDTO::getLanguage, Collectors.counting()));
    }

    public Map<String, Double> getLanguagePercentages(String username) {
        return computeLanguagePercentages(getRepos(username));
    }

    public int getTotalStars(String username) {
        return getRepos(username).stream()
                .mapToInt(RepoDTO::getStargazers_count)
                .sum();
    }

    public double getScore(String username) {
        List<RepoDTO> repos = getRepos(username);
        GithubUserDTO user = getUser(username);
        int totalStars = repos.stream().mapToInt(RepoDTO::getStargazers_count).sum();
        return computeScore(repos.size(), user.getFollowers(), totalStars);
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

    // ---- combined endpoint: fetches user + repos exactly ONCE each ----

    public AnalysisResponseDTO analyze(String username) {

        GithubUserDTO user = getUser(username);
        List<RepoDTO> repos = getRepos(username);

        Map<String, Double> languages = computeLanguagePercentages(repos);
        int totalStars = repos.stream().mapToInt(RepoDTO::getStargazers_count).sum();
        double score = computeScore(repos.size(), user.getFollowers(), totalStars);
        String level = getLevel(score);

        AnalysisResponseDTO result = new AnalysisResponseDTO();
        result.setUsername(user.getLogin());
        result.setName(user.getName());
        result.setAvatarUrl(user.getAvatar_url());
        result.setFollowers(user.getFollowers());
        result.setPublicRepos(user.getPublic_repos());
        result.setLanguages(languages);
        result.setScore(score);
        result.setLevel(level);

        return result;

    }

    // ---- pure helpers: no HTTP calls, just math on data already fetched ----

    private Map<String, Double> computeLanguagePercentages(List<RepoDTO> repos) {
        Map<String, Long> counts = repos.stream()
                .filter(repo -> repo.getLanguage() != null)
                .collect(Collectors.groupingBy(RepoDTO::getLanguage, Collectors.counting()));

        int total = counts.values().stream().mapToInt(Long::intValue).sum();

        if (total == 0) {
            return Map.of();
        }

        return counts.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> (entry.getValue() / (double) total) * 100
                ));
    }

    private double computeScore(int repoCount, int followers, int totalStars) {
        return (repoCount * 10)
                + (Math.log(followers + 1) * 15)
                + (Math.log(totalStars + 1) * 15);
    }

}