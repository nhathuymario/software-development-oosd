package com.example.content_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArticleUpsertRequest(
        @NotBlank @Size(max = 220) String title,
        @Size(max = 500) String summary,
        @Size(max = 1000) String thumbnailUrl,
        String content,
        Boolean published
) {}
