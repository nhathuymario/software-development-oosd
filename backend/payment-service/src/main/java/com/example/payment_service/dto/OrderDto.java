package com.example.payment_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private BigDecimal totalAmount; // Quan trọng nhất là cái này
    // private Long userId; (Nếu cần kiểm tra thêm user)
    private List<OrderItemDto> items;
}