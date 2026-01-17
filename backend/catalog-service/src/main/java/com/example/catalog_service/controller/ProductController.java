package com.example.catalog_service.controller;

import com.example.catalog_service.entity.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    // Thêm vào ProductController
    @PutMapping("/{id}/reduce-stock")
    public void reduceStock(@PathVariable Long id, @RequestParam int quantity) {
        productService.reduceStock(id, quantity);
    }

    @PutMapping("/{id}/add-stock")
    public void addStock(@PathVariable Long id, @RequestParam int quantity) {
        productService.addStock(id, quantity);
    }

    @GetMapping("/public/search") // Thêm chữ /public để dễ quản lý security
    public ResponseEntity<List<Product>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") BigDecimal minPrice,
            @RequestParam(defaultValue = "999999999") BigDecimal maxPrice) {

        // Đổi dòng này
        return ResponseEntity.ok(productService.searchAndFilter(name, minPrice, maxPrice, categoryId));
    }
}