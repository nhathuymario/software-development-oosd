package com.example.payment_service.controller;

import com.example.payment_service.entity.Payment;
import com.example.payment_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // API Thanh toán mới: POST /api/payments/pay?orderId=1
    // (Không cần nhập amount nữa)
    @PostMapping("/pay")
    public Payment makePayment(@RequestParam Long orderId) {

        // Gọi hàm createPayment (hàm mà bạn vừa sửa ở bước trước)
        // Lưu ý: Tên hàm bên Service của bạn là createPayment hay processPayment
        // thì bạn gọi cho đúng tên nhé.
        return paymentService.createPayment(orderId);
    }
}