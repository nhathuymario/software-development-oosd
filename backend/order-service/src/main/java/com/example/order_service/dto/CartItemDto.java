package com.example.order_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDto {
    private Long id;
    private Long productId;
    private String productName; // Quan trọng: Hứng tên sản phẩm từ Cart
    private BigDecimal price;   // Quan trọng: Hứng giá từ Cart
    private Integer quantity;
}