package com.example.catalog_service.repository;

import com.example.catalog_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm theo tên
    List<Product> findByNameContainingIgnoreCase(String name);

    // Lọc theo khoảng giá
    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);

    // Lọc theo Category
    List<Product> findByCategoryId(Long categoryId);

    // Kết hợp cả tên và giá
    List<Product> findByNameContainingIgnoreCaseAndPriceBetween(String name, BigDecimal min, BigDecimal max);
}