package com.example.content_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record BannerUpsertRequest(
        @NotBlank @Size(max = 60) String position,
        @NotBlank @Size(max = 1000) String imageUrl,
        @Size(max = 1000) String linkUrl,
        @Size(max = 120) String title,
        Boolean active,
        Instant startAt,
        Instant endAt,
        Integer sortOrder
) {}
