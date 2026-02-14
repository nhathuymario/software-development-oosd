package com.example.content_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "articles", indexes = {
        @Index(name = "idx_articles_published", columnList = "published"),
        @Index(name = "idx_articles_publishedAt", columnList = "publishedAt")
})
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 220)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(length = 1000)
    private String thumbnailUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private boolean published;

    private Instant publishedAt;

    // audit
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
