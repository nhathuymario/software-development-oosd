package com.example.content_service.controller;

import com.example.content_service.dto.ArticleResponse;
import com.example.content_service.dto.ArticleUpsertRequest;
import com.example.content_service.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService service;

    // ===== PUBLIC =====
    @GetMapping("/api/content/public/articles")
    public Page<ArticleResponse> publicList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        return service.publicList(page, size);
    }

    @GetMapping("/api/content/public/articles/{id}")
    public ArticleResponse publicDetail(@PathVariable Long id) {
        return service.publicDetail(id);
    }

    // ===== ADMIN =====
    @GetMapping("/api/content/admin/articles")
    public Page<ArticleResponse> adminList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return service.adminList(page, size);
    }

    @GetMapping("/api/content/admin/articles/{id}")
    public ArticleResponse adminDetail(@PathVariable Long id) {
        return service.adminDetail(id);
    }

    @PostMapping("/api/content/admin/articles")
    public ArticleResponse create(@Valid @RequestBody ArticleUpsertRequest req) {
        return service.create(req);
    }

    @PutMapping("/api/content/admin/articles/{id}")
    public ArticleResponse update(@PathVariable Long id, @Valid @RequestBody ArticleUpsertRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/api/content/admin/articles/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
