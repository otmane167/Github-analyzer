package com.otmane.githubanalyzer.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.otmane.githubanalyzer.dto.AiRecommendationDTO;
import com.otmane.githubanalyzer.dto.RepoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ollama.url}")
    private String OLLAMA_URL;

    @Value("${ollama.model}")
    private String MODEL;

    public AiRecommendationDTO getRecommendations(String username, List<RepoDTO> repos) {

        String repoSummary = repos.stream()
                .limit(15)
                .map(r -> "- " + r.getName()
                        + " (" + (r.getLanguage() == null ? "unknown language" : r.getLanguage())
                        + ", " + r.getStargazers_count() + " stars, "
                        + r.getForks_count() + " forks)")
                .collect(Collectors.joining("\n"));

        String prompt = "You are reviewing a GitHub developer's public repositories for a portfolio review.\n"
                + "Username: " + username + "\n"
                + "Repositories:\n" + repoSummary + "\n\n"
                + "Respond ONLY with valid JSON, no markdown fences, no preamble, matching exactly this shape:\n"
                + "{\"strengths\": [\"...\"], \"weaknesses\": [\"...\"], \"suggestions\": [\"...\"]}\n"
                + "2 to 4 short, specific items per array. One sentence each.";

        try {
            String requestBody = objectMapper.writeValueAsString(
                    java.util.Map.of(
                            "model", MODEL,
                            "prompt", prompt,
                            "stream", false,
                            "format", "json"
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(OLLAMA_URL, request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("response").asText();
            String cleaned = extractJson(text);

            return objectMapper.readValue(cleaned, AiRecommendationDTO.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Could not reach the local AI model. Is Ollama running? (" + e.getMessage() + ")"
            );
        }
    }

    // Local models are less reliable about following "JSON only" instructions than
    // hosted APIs — they sometimes wrap the JSON in explanation text anyway.
    // This pulls out just the { ... } block instead of trusting the whole response is clean JSON.
    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start == -1 || end == -1 || end < start) {
            throw new IllegalStateException("Model response did not contain valid JSON: " + text);
        }
        return text.substring(start, end + 1);
    }

}