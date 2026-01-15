package com.example.order_service.entity;

public enum OrderStatus {
    PENDING,   // Chờ thanh toán
    PAID,      // Đã thanh toán
    CANCELLED  // Đã hủy
}