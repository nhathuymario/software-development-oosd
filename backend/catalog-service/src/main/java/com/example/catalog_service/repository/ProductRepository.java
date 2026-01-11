package com.example.catalog_service.repository;

import com.example.catalog_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Có thể thêm hàm tìm kiếm sau này: findByNameContaining...
}