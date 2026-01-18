package com.example.catalog_service.controller;

import com.example.catalog_service.entity.Product;
import com.example.catalog_service.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // =========================
    // PUBLIC (không cần đăng nhập)
    // =========================

    // GET /api/products/public
    @GetMapping("/public")
    public List<Product> getAllPublic() {
        return productService.getAllProducts();
    }

    // GET /api/products/public/{id}
    @GetMapping("/public/{id}")
    public Product getOnePublic(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // GET /api/products/public/search
    @GetMapping("/public/search")
    public ResponseEntity<List<Product>> searchPublic(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") BigDecimal minPrice,
            @RequestParam(defaultValue = "999999999") BigDecimal maxPrice) {

        return ResponseEntity.ok(productService.searchAndFilter(name, minPrice, maxPrice, categoryId));
    }

    // =========================
    // ADMIN (cần ROLE_ADMIN)
    // =========================

    // POST /api/products/admin
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public Product create(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // PUT /api/products/admin/{id}
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // DELETE /api/products/admin/{id}
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Stock (nếu muốn admin quản lý)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}/reduce-stock")
    public ResponseEntity<Void> reduceStock(@PathVariable Long id, @RequestParam int quantity) {
        productService.reduceStock(id, quantity);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}/add-stock")
    public ResponseEntity<Void> addStock(@PathVariable Long id, @RequestParam int quantity) {
        productService.addStock(id, quantity);
        return ResponseEntity.noContent().build();
    }
}
