package com.otmane.githubanalyzer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RepoDTO {
    private String name;
    private String language;
    private int stargazers_count;
    private int forks_count;
}
