package com.example.content_service.service;

import com.example.content_service.dto.ArticleResponse;
import com.example.content_service.dto.ArticleUpsertRequest;
import com.example.content_service.entity.Article;
import com.example.content_service.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository repo;

    // ===== PUBLIC =====
    @Override
    public Page<ArticleResponse> publicList(int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "publishedAt", "id")
        );

        return repo.findByPublishedTrue(pageable)
                .map(a -> ArticleResponse.from(a, false)); // list: không cần content
    }

    @Override
    public ArticleResponse publicDetail(Long id) {
        Article a = repo.findByIdAndPublishedTrue(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        return ArticleResponse.from(a, true);
    }

    // ===== ADMIN =====
    @Override
    public Page<ArticleResponse> adminList(int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "updatedAt", "id")
        );

        return repo.findAll(pageable)
                .map(a -> ArticleResponse.from(a, false));
    }

    @Override
    public ArticleResponse adminDetail(Long id) {
        Article a = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        return ArticleResponse.from(a, true);
    }

    @Override
    @Transactional
    public ArticleResponse create(ArticleUpsertRequest request) {
        boolean publish = Boolean.TRUE.equals(request.published());

        Article a = Article.builder()
                .title(request.title())
                .summary(request.summary())
                .thumbnailUrl(request.thumbnailUrl())
                .content(request.content())
                .published(publish)
                .publishedAt(publish ? Instant.now() : null)
                .build();

        a = repo.save(a);
        return ArticleResponse.from(a, true);
    }

    @Override
    @Transactional
    public ArticleResponse update(Long id, ArticleUpsertRequest request) {
        Article a = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        a.setTitle(request.title());
        a.setSummary(request.summary());
        a.setThumbnailUrl(request.thumbnailUrl());
        a.setContent(request.content());

        // publish/unpublish
        if (request.published() != null) {
            boolean before = a.isPublished();
            boolean after = request.published();

            a.setPublished(after);

            if (!before && after) {
                a.setPublishedAt(Instant.now());
            } else if (before && !after) {
                a.setPublishedAt(null);
            }
        }

        // JPA dirty checking -> auto update
        return ArticleResponse.from(a, true);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Article not found");
        repo.deleteById(id);
    }
}
