package com.otmane.githubanalyzer.dto;

import lombok.Data;

import java.util.Map;

@Data
public class AnalysisResponseDTO {
    private String username;
    private String name;
    private String avatarUrl;
    private int followers;
    private int publicRepos;
    private Map<String, Double> languages;
    private double score;
    private String level;
}