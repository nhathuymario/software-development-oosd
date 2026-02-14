package com.example.content_service.controller;

import com.example.content_service.dto.BannerResponse;
import com.example.content_service.dto.BannerUpsertRequest;
import com.example.content_service.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BannerController {

    private final BannerService service;

    // ===== PUBLIC =====
    @GetMapping("/api/content/public/banners")
    public List<BannerResponse> publicBanners(@RequestParam String position) {
        return service.publicBanners(position);
    }

    // ===== ADMIN =====
    @GetMapping("/api/content/admin/banners")
    public List<BannerResponse> adminList() {
        return service.adminList();
    }

    @GetMapping("/api/content/admin/banners/{id}")
    public BannerResponse adminDetail(@PathVariable Long id) {
        return service.adminDetail(id);
    }

    @PostMapping("/api/content/admin/banners")
    public BannerResponse create(@Valid @RequestBody BannerUpsertRequest req) {
        return service.create(req);
    }

    @PutMapping("/api/content/admin/banners/{id}")
    public BannerResponse update(@PathVariable Long id, @Valid @RequestBody BannerUpsertRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/api/content/admin/banners/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
