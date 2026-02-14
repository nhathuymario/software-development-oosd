package com.example.content_service.dto;

import com.example.content_service.entity.Article;
import lombok.Builder;

import java.time.Instant;

@Builder
public record ArticleResponse(
        Long id,
        String title,
        String summary,
        String thumbnailUrl,
        String content,
        boolean published,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt
) {
    public static ArticleResponse from(Article a, boolean includeContent) {
        return ArticleResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .summary(a.getSummary())
                .thumbnailUrl(a.getThumbnailUrl())
                .content(includeContent ? a.getContent() : null)
                .published(a.isPublished())
                .publishedAt(a.getPublishedAt())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
