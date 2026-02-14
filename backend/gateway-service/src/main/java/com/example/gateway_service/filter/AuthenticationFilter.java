package com.example.gateway_service.filter;

import com.example.gateway_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthenticationFilter
        extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public String name() {
        return "Authentication";
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            // ✅ thiếu token => 401
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return reject(exchange, HttpStatus.UNAUTHORIZED, "Missing Bearer token");
            }

            String token = authHeader.substring(7);

            try {
                jwtUtil.validateToken(token);
            } catch (Exception e) {
                return reject(exchange, HttpStatus.UNAUTHORIZED, "Invalid token");
            }

            List<String> roles = jwtUtil.getRoles(token);

            // ✅ check role mềm: accept ROLE_ADMIN hoặc ADMIN
            String requiredRole = config.getRequiredRole();
            if (requiredRole != null && !requiredRole.isBlank()) {
                if (!hasRole(roles, requiredRole.trim())) {
                    return reject(exchange, HttpStatus.FORBIDDEN, "Forbidden: require " + requiredRole);
                }
            }

            return chain.filter(exchange);
        };
    }

    private boolean hasRole(List<String> roles, String requiredRole) {
        if (roles == null || roles.isEmpty()) return false;

        String r = requiredRole;
        String alt = r.startsWith("ROLE_") ? r.substring(5) : "ROLE_" + r;

        // có thể JWT trả "ROLE_ADMIN" hoặc "ADMIN"
        return roles.contains(r) || roles.contains(alt);
    }

    private Mono<Void> reject(ServerWebExchange exchange, HttpStatus status, String message) {
        exchange.getResponse().setStatusCode(status);
        // nếu muốn message rõ hơn thì set header (tránh body vì gateway đôi khi không write body)
        exchange.getResponse().getHeaders().add("X-Error", message);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        private String requiredRole;

        public String getRequiredRole() {
            return requiredRole;
        }

        public void setRequiredRole(String requiredRole) {
            this.requiredRole = requiredRole;
        }
    }
}
