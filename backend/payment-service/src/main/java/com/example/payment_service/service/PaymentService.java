package com.example.payment_service.service;

import com.example.payment_service.client.OrderClient;
import com.example.payment_service.client.ProductClient;
import com.example.payment_service.dto.OrderDto;
import com.example.payment_service.dto.OrderItemDto;
import com.example.payment_service.entity.Payment;
import com.example.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    private final ProductClient productClient;

    public Payment createPayment(Long orderId) {
        OrderDto order = orderClient.getOrderById(orderId);
        if (order == null) {
            throw new RuntimeException("Không tìm thấy đơn hàng!");
        }

        // --- TRẠNG THÁI BÌNH THƯỜNG ---
        // Giả sử: Nếu số tiền > 500 triệu thì coi như khách không đủ tiền (FAILED)
        // Còn lại thì thanh toán THÀNH CÔNG (SUCCESS)
        BigDecimal limit = new BigDecimal("500000000");
        String status = (order.getTotalAmount().compareTo(limit) > 0) ? "FAILED" : "SUCCESS";

        if ("SUCCESS".equals(status)) {
            // Thanh toán thật sự thành công mới đánh dấu đã trả tiền
            orderClient.markOrderAsPaid(orderId);
        } else {
            // Chỉ khi trạng thái là FAILED mới thực hiện hoàn kho
            if (order.getItems() != null) {
                for (OrderItemDto item : order.getItems()) {
                    productClient.addStock(item.getProductId(), item.getQuantity());
                }
            }
        }

        // Lưu đúng trạng thái thực tế vào Database
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(status);

        return paymentRepository.save(payment);
    }
}