package com.example.content_service.dto;

import com.example.content_service.entity.Banner;
import lombok.Builder;

import java.time.Instant;

@Builder
public record BannerResponse(
        Long id,
        String position,
        String imageUrl,
        String linkUrl,
        String title,
        boolean active,
        Instant startAt,
        Instant endAt,
        int sortOrder,
        Instant createdAt,
        Instant updatedAt
) {
    public static BannerResponse from(Banner b) {
        return BannerResponse.builder()
                .id(b.getId())
                .position(b.getPosition())
                .imageUrl(b.getImageUrl())
                .linkUrl(b.getLinkUrl())
                .title(b.getTitle())
                .active(b.isActive())
                .startAt(b.getStartAt())
                .endAt(b.getEndAt())
                .sortOrder(b.getSortOrder())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
