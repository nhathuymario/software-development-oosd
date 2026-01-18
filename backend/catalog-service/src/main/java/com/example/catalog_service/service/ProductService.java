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

    // PUBLIC
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // PUBLIC
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
    }

    // ADMIN
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // ADMIN
    @Transactional
    public Product updateProduct(Long id, Product req) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        existing.setName(req.getName());
        existing.setDescription(req.getDescription());
        existing.setPrice(req.getPrice());
        existing.setStock(req.getStock());
        existing.setImageUrl(req.getImageUrl());
        existing.setCategoryId(req.getCategoryId());

        return productRepository.save(existing);
    }

    // ADMIN
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        productRepository.deleteById(id);
    }

    // INTERNAL/ADMIN (tuỳ bạn chặn ở Controller/Gateway)
    @Transactional
    public void reduceStock(Long productId, int quantity) {
        if (quantity <= 0) throw new RuntimeException("quantity phải > 0");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Hết hàng! Kho chỉ còn: " + product.getStock());
        }

        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    // INTERNAL/ADMIN
    @Transactional
    public void addStock(Long productId, int quantity) {
        if (quantity <= 0) throw new RuntimeException("quantity phải > 0");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
    }

    // PUBLIC
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
}
