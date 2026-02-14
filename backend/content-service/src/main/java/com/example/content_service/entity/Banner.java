package com.example.content_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "banners", indexes = {
        @Index(name = "idx_banners_active", columnList = "active"),
        @Index(name = "idx_banners_position", columnList = "position")
})
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // HOME_TOP, HOME_MIDDLE, HOME_BOTTOM...
    @Column(nullable = false, length = 60)
    private String position;

    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String linkUrl;

    @Column(length = 120)
    private String title;

    @Column(nullable = false)
    private boolean active;

    // nếu muốn chạy campaign theo thời gian
    private Instant startAt;
    private Instant endAt;

    // sort order trong cùng position
    @Column(nullable = false)
    private int sortOrder;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
