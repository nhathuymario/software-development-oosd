package com.example.gateway_service.filter;

import com.example.gateway_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            // Kiểm tra xem request có header Authorization không
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                throw new RuntimeException("Thiếu Header Authorization (Chưa đăng nhập)");
            }

            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7); // Cắt bỏ chữ "Bearer " lấy token
            }

            try {
                // Kiểm tra tính hợp lệ của Token
                jwtUtil.validateToken(authHeader);
            } catch (Exception e) {
                System.out.println("Token không hợp lệ: " + e.getMessage());
                throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn!");
            }

            return chain.filter(exchange);
        });
    }

    public static class Config {
    }
}