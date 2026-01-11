package com.example.order_service.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;          // Khớp với Long id
    private String username;  // Khớp với String username
    private String fullName;  // Khớp với String fullName
    private String phone;     // Khớp với String phone
    private String address;   // Khớp với String address
}