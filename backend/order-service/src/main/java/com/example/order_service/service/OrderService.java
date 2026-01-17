package com.example.order_service.service;

import com.example.order_service.client.CartClient;
import com.example.order_service.client.ProductClient;
import com.example.order_service.dto.CartDto;
import com.example.order_service.dto.CartItemDto;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.entity.OrderStatus;
import com.example.order_service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartClient cartClient;

    @Autowired
    private ProductClient productClient; // Đảm bảo bạn đã tạo file Interface này

    @Transactional // Đảm bảo nếu lỗi (hết hàng) thì rollback, không tạo đơn rác
    public Order placeOrder(Long userId) {
        // BƯỚC 1: Gọi sang Cart Service lấy giỏ hàng
        CartDto cart = cartClient.getCartByUserId(userId);

        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống! Không thể đặt hàng.");
        }

        // BƯỚC 2: Tạo đơn hàng mới (Order)
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;

        // BƯỚC 3: Duyệt từng món trong giỏ
        for (CartItemDto cartItem : cart.getItems()) {

            // --- [QUAN TRỌNG] GỌI SANG CATALOG ĐỂ TRỪ KHO ---
            // Nếu Catalog báo lỗi (Hết hàng), dòng này sẽ ném Exception
            // và dừng toàn bộ quá trình đặt hàng tại đây.
            productClient.reduceStock(cartItem.getProductId(), cartItem.getQuantity());
            // -----------------------------------------------

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);

            order.getItems().add(orderItem);

            // Cộng dồn tiền
            BigDecimal lineTotal = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);
        }

        order.setTotalAmount(totalAmount);

        // BƯỚC 4: Lưu xuống Database
        Order savedOrder = orderRepository.save(order);

        // BƯỚC 5: Xóa giỏ hàng cũ đi
        cartClient.clearCart(userId);

        return savedOrder;
    }

    public void markAsPaid(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }
}