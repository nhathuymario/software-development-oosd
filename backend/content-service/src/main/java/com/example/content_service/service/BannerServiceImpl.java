package com.example.content_service.service;

import com.example.content_service.dto.BannerResponse;
import com.example.content_service.dto.BannerUpsertRequest;
import com.example.content_service.entity.Banner;
import com.example.content_service.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository repo;

    // ===== PUBLIC =====
    @Override
    public List<BannerResponse> publicBanners(String position) {
        return repo.findByActiveTrueAndPositionOrderBySortOrderAsc(position)
                .stream()
                // optional: lọc theo khoảng thời gian chạy campaign
                .filter(b -> inRange(b.getStartAt(), b.getEndAt()))
                .map(BannerResponse::from)
                .toList();
    }

    private boolean inRange(Instant start, Instant end) {
        Instant now = Instant.now();
        if (start != null && now.isBefore(start)) return false;
        if (end != null && now.isAfter(end)) return false;
        return true;
    }

    // ===== ADMIN =====
    @Override
    public List<BannerResponse> adminList() {
        return repo.findAll().stream()
                .map(BannerResponse::from)
                .toList();
    }

    @Override
    public BannerResponse adminDetail(Long id) {
        Banner b = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));
        return BannerResponse.from(b);
    }

    @Override
    @Transactional
    public BannerResponse create(BannerUpsertRequest request) {
        Banner b = Banner.builder()
                .position(request.position())
                .imageUrl(request.imageUrl())
                .linkUrl(request.linkUrl())
                .title(request.title())
                .active(Boolean.TRUE.equals(request.active()))
                .startAt(request.startAt())
                .endAt(request.endAt())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .build();

        b = repo.save(b);
        return BannerResponse.from(b);
    }

    @Override
    @Transactional
    public BannerResponse update(Long id, BannerUpsertRequest request) {
        Banner b = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        b.setPosition(request.position());
        b.setImageUrl(request.imageUrl());
        b.setLinkUrl(request.linkUrl());
        b.setTitle(request.title());

        if (request.active() != null) b.setActive(request.active());
        b.setStartAt(request.startAt());
        b.setEndAt(request.endAt());
        if (request.sortOrder() != null) b.setSortOrder(request.sortOrder());

        return BannerResponse.from(b);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Banner not found");
        repo.deleteById(id);
    }
}
