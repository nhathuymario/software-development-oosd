package com.example.content_service.repository;

import com.example.content_service.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findByPublishedTrue(Pageable pageable);
    Optional<Article> findByIdAndPublishedTrue(Long id);
}
