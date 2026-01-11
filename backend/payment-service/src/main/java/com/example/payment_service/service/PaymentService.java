package com.example.payment_service.service;

import com.example.payment_service.client.OrderClient;
import com.example.payment_service.dto.OrderDto;
import com.example.payment_service.entity.Payment;
import com.example.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    // Khai báo đầy đủ Repository và Client
    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;

    public Payment createPayment(Long orderId) {
        // 1. Gọi sang Order Service để lấy tiền
        OrderDto order = orderClient.getOrderById(orderId);

        if (order == null) {
            throw new RuntimeException("Không tìm thấy đơn hàng!");
        }

        // 2. Tạo thanh toán
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus("SUCCESS");

        orderClient.markOrderAsPaid(orderId);

        return paymentRepository.save(payment);
    }
}