package com.example.payment_service.client;

import com.example.payment_service.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

// Gọi trực tiếp vào Order Service (Port 8083)
@FeignClient(name = "order-service", url = "http://localhost:8083")
public interface OrderClient {

    @GetMapping("/api/orders/{id}")
    OrderDto getOrderById(@PathVariable("id") Long id);

    // Gọi sang API: PUT /api/orders/{id}/pay bên Order Service
    @PutMapping("/api/orders/{id}/pay")
    void markOrderAsPaid(@PathVariable("id") Long id);
}