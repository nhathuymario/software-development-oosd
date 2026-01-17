package com.example.catalog_service.service;

import com.example.catalog_service.entity.Product;
import com.example.catalog_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
    }

    public void reduceStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Hết hàng! Kho chỉ còn: " + product.getStock());
        }

        // Trừ kho
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    @Transactional
    public void addStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        product.setStock(product.getStock() + quantity); // Cộng lại kho
        productRepository.save(product);
    }

    public List<Product> searchAndFilter(String name, BigDecimal minPrice, BigDecimal maxPrice, Long categoryId) {
        if (name != null && minPrice != null && maxPrice != null) {
            return productRepository.findByNameContainingIgnoreCaseAndPriceBetween(name, minPrice, maxPrice);
        }
        if (name != null) {
            return productRepository.findByNameContainingIgnoreCase(name);
        }
        if (minPrice != null && maxPrice != null) {
            return productRepository.findByPriceBetween(minPrice, maxPrice);
        }
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}