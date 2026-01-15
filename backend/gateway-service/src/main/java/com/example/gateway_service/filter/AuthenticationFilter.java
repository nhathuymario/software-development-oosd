package com.example.gateway_service.filter;

import com.example.gateway_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Thiếu Header Authorization (Chưa đăng nhập)");
            }

            String token = authHeader.substring(7);

            // validate + lấy roles
            jwtUtil.validateToken(token);
            List<String> roles = jwtUtil.getRoles(token);

            if (config.requiredRole != null && !config.requiredRole.isBlank()) {
                if (!roles.contains(config.requiredRole)) {
                    throw new RuntimeException("Không đủ quyền: cần " + config.requiredRole);
                }
            }

            return chain.filter(exchange);
        };
    }

    public static class Config {
        private String requiredRole;

        public String getRequiredRole() { return requiredRole; }
        public void setRequiredRole(String requiredRole) { this.requiredRole = requiredRole; }
    }
}
