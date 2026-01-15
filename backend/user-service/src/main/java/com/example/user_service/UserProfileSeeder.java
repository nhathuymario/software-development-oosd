package com.example.user_service;

import com.example.user_service.entity.UserProfile;
import com.example.user_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
public class UserProfileSeeder {

    private final UserProfileRepository userProfileRepository;

    @PostConstruct
    public void seed() {

        if (!userProfileRepository.existsByUsername("admin")) {
            UserProfile p = new UserProfile();
            p.setUsername("admin");
            p.setFullName("Admin MiniStore");
            p.setPhone("0900000000");
            p.setAddress("Hà Nội");
            userProfileRepository.save(p);
        }

        if (!userProfileRepository.existsByUsername("user")) {
            UserProfile p = new UserProfile();
            p.setUsername("user");
            p.setFullName("User MiniStore");
            p.setPhone("0911111111");
            p.setAddress("TP HCM");
            userProfileRepository.save(p);
        }
    }
}
