package com.example.user_service.controller;

import com.example.user_service.entity.UserProfile;
import com.example.user_service.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users") // Đây là địa chỉ cái cửa
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    // Cart Service sẽ gọi vào đường dẫn này: GET http://localhost:8086/api/users/{id}
    @GetMapping("/{id}")
    public UserProfile getUserProfile(@PathVariable Long id) {
        return userProfileService.getUserById(id);
    }
}