package com.example.catalog_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Tên sản phẩm

    @Column(length = 1000)
    private String description; // Mô tả

    private BigDecimal price;   // Giá bán

    private Integer stock;      // Số lượng tồn kho

    private String imageUrl;    // Link ảnh

    private Long categoryId;
}