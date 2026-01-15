package com.example.cart_service.client;

import com.example.cart_service.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Gọi sang Catalog Service đang chạy ở port 8085
@FeignClient(name = "catalog-service", url = "http://localhost:8085")
public interface CatalogClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);
}