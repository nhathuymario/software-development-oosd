package com.example.content_service.service;

import com.example.content_service.dto.ArticleResponse;
import com.example.content_service.dto.ArticleUpsertRequest;
import org.springframework.data.domain.Page;

public interface ArticleService {

    // ===== PUBLIC =====

    /**
     * Lấy danh sách bài viết đã publish (public)
     */
    Page<ArticleResponse> publicList(int page, int size);

    /**
     * Lấy chi tiết bài viết public theo id
     */
    ArticleResponse publicDetail(Long id);


    // ===== ADMIN =====

    /**
     * Lấy toàn bộ bài viết (admin)
     */
    Page<ArticleResponse> adminList(int page, int size);

    /**
     * Xem chi tiết bài viết (admin)
     */
    ArticleResponse adminDetail(Long id);

    /**
     * Tạo bài viết mới
     */
    ArticleResponse create(ArticleUpsertRequest request);

    /**
     * Cập nhật bài viết
     */
    ArticleResponse update(Long id, ArticleUpsertRequest request);

    /**
     * Xoá bài viết
     */
    void delete(Long id);
}
