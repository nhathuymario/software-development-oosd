package com.example.order_service.client;

import com.example.order_service.dto.CartDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Gán cứng URL của Cart Service (Port 8082)
@FeignClient(name = "cart-service", url = "http://localhost:8082")
public interface CartClient {

    // Lấy giỏ hàng về để tính tiền
    @GetMapping("/api/cart/{userId}")
    CartDto getCartByUserId(@PathVariable("userId") Long userId);

    // Đặt hàng xong thì xóa giỏ đi
    @DeleteMapping("/api/cart/{userId}")
    void clearCart(@PathVariable("userId") Long userId);
}