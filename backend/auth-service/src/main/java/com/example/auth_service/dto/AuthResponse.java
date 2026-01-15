package com.example.auth_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor // Quan trọng: Để tạo constructor có tham số
public class AuthResponse {
    private String token;
    private String username;
    private List<String> roles;
}