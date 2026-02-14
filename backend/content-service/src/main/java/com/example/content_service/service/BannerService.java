package com.example.content_service.service;

import com.example.content_service.dto.BannerResponse;
import com.example.content_service.dto.BannerUpsertRequest;

import java.util.List;

public interface BannerService {

    // ===== PUBLIC =====

    /**
     * Lấy banner active theo position (HOME_TOP, HOME_MIDDLE...)
     */
    List<BannerResponse> publicBanners(String position);


    // ===== ADMIN =====

    /**
     * Lấy toàn bộ banner (admin)
     */
    List<BannerResponse> adminList();

    /**
     * Xem chi tiết banner
     */
    BannerResponse adminDetail(Long id);

    /**
     * Tạo banner mới
     */
    BannerResponse create(BannerUpsertRequest request);

    /**
     * Cập nhật banner
     */
    BannerResponse update(Long id, BannerUpsertRequest request);

    /**
     * Xoá banner
     */
    void delete(Long id);
}
