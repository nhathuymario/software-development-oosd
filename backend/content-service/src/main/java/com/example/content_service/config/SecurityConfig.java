package com.example.content_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // ✅ Ảnh upload public
                        .requestMatchers("/uploads/**").permitAll()

                        // Public content
                        .requestMatchers("/api/content/public/**").permitAll()

                        // Admin content cần ADMIN
                        .requestMatchers("/api/content/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                // ❗ TẮT Basic để khỏi popup login
                .httpBasic(httpBasic -> httpBasic.disable())

                // ❗ Tắt form login
                .formLogin(form -> form.disable())

                .build();
    }
}
