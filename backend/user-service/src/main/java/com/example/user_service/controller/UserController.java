package com.example.user_service.controller;

import com.example.user_service.entity.UserProfile;
import com.example.user_service.repository.IUserProfileRepository;
import com.example.user_service.repository.IUserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserProfileRepository repo;

    @PostMapping("/me")
    public UserProfile createOrUpdateProfile(
            Authentication authentication,
            @RequestBody UserProfile body) {

        // 🔒 BẢO VỆ TRƯỜNG HỢP authentication = null
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated request");
        }

        // ✅ LẤY USERNAME TỪ JWT
        String username = authentication.getName();

        UserProfile profile = repo.findByUsername(username)
                .orElseGet(UserProfile::new);

        profile.setUsername(username);
        profile.setFullName(body.getFullName());
        profile.setPhone(body.getPhone());
        profile.setAddress(body.getAddress());

        return repo.save(profile);
    }

    @GetMapping("/me")
    public UserProfile getMyProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated request");
        }

        String username = authentication.getName();

        return repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}
