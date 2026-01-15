package com.example.catalog_service.controller;

import com.example.catalog_service.entity.Product;
import com.example.catalog_service.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Lấy danh sách: GET /api/products
    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    // Lấy chi tiết: GET /api/products/{id}
    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Tạo mới (cho Admin): POST /api/products
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.createProduct(product);
    }
}