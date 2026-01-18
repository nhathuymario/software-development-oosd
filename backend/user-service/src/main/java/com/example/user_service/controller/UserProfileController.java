package com.example.user_service.controller;

import com.example.user_service.entity.UserProfile;
import com.example.user_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileRepository repo;

    // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<UserProfile> getMyProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();

        return repo.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // PUT /api/users/me (upsert)
    @PutMapping("/me")
    public ResponseEntity<UserProfile> upsertMyProfile(
            Authentication authentication,
            @RequestBody UserProfile body
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();

        UserProfile profile = repo.findByUsername(username).orElseGet(UserProfile::new);

        profile.setUsername(username);
        profile.setFullName(body.getFullName());
        profile.setPhone(body.getPhone());
        profile.setAddress(body.getAddress());

        return ResponseEntity.ok(repo.save(profile));
    }

    // GET /api/users/{id} (Cart Service)
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
