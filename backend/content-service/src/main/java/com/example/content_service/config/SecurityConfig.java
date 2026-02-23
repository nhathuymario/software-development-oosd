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
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/content/public/**").permitAll()

                        // ✅ để gateway bảo vệ, content-service cho qua
                        .requestMatchers("/api/content/admin/**").permitAll()

                        .anyRequest().authenticated()
                )

                // ❗ TẮT Basic để khỏi popup login
                .httpBasic(httpBasic -> httpBasic.disable())

                // ❗ Tắt form login
                .formLogin(form -> form.disable())

                .build();
    }
}
