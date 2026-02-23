package com.example.gateway_service.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public void validateToken(String token) {
        Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    public List<String> getRoles(String token) {
        Claims claims = parseClaims(token);

        Object rs = claims.get("roles");
        if (rs == null) return Collections.emptyList();

        if (rs instanceof List<?>) {
            List<?> raw = (List<?>) rs;
            return raw.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toList());
        }

        String s = String.valueOf(rs);
        if (s.isBlank()) return Collections.emptyList();

        if (s.contains(",")) {
            return Arrays.stream(s.split(","))
                    .map(String::trim)
                    .filter(x -> !x.isBlank())
                    .collect(Collectors.toList());
        }

        return Collections.singletonList(s.trim());
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
