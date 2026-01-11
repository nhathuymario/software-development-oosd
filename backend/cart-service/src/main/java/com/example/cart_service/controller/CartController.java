package com.example.cart_service.controller;

import com.example.cart_service.entity.Cart;
import com.example.cart_service.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // API: Xem giỏ hàng -> GET /api/cart/{userId}
    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }

    // API mới: Không cần truyền tên và giá nữa
    // POST /api/cart/add?userId=1&productId=1&quantity=1
    @PostMapping("/add")
    public Cart addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity
    ) {
        // Gọi service (Service sẽ tự đi hỏi Catalog lấy giá)
        return cartService.addToCart(userId, productId, quantity);
    }

    // API: Xóa giỏ -> DELETE /api/cart/{userId}
    @DeleteMapping("/{userId}")
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}