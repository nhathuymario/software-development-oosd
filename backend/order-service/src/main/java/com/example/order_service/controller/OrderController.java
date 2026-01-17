package com.example.order_service.controller;

import com.example.order_service.entity.Order;
import com.example.order_service.repository.OrderRepository; // <--- Nhớ import dòng này
import com.example.order_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository; // <--- Thêm cái này để tìm đơn hàng

    // API Đặt hàng (Giữ nguyên)
    @PostMapping("/place")
    public Order placeOrder(@RequestParam Long userId) {
        return orderService.placeOrder(userId);
    }

    // API Cập nhật trạng thái (Giữ nguyên)
    @PutMapping("/{id}/pay")
    public void markAsPaid(@PathVariable Long id) {
        orderService.markAsPaid(id);
    }

    // --- THÊM MỚI API NÀY (Để sửa lỗi 404 bên Payment) ---
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("X-User-Id") Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}