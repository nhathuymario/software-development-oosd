package com.example.auth_service.dto;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    // Có thể thêm email, fullName nếu muốn mở rộng sau này
}