package com.otmane.githubanalyzer.dto;

import lombok.Data;

import java.util.List;

@Data
public class AiRecommendationDTO {
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
}