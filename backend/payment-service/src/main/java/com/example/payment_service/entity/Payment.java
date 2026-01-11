package com.example.payment_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId; // Thanh toán cho đơn nào
    private BigDecimal amount; // Số tiền thanh toán
    private LocalDateTime paymentDate;
    private String paymentStatus; // "SUCCESS"
}