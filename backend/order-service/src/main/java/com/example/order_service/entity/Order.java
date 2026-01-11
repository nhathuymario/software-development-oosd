package com.example.order_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "t_orders") // Tránh trùng từ khóa SQL
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber; // Mã đơn hàng (VD: ORD-12345)
    private Long userId;        // Người đặt
    private BigDecimal totalAmount; // Tổng tiền

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // Trạng thái

    private LocalDateTime orderDate; // Ngày đặt

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}