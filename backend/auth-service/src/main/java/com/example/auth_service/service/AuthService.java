package com.example.auth_service.service;

import com.example.auth_service.dto.*;
import com.example.auth_service.entity.Role;
import com.example.auth_service.entity.User;
import com.example.auth_service.repository.RoleRepository;
import com.example.auth_service.repository.UserRepository;
import com.example.auth_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Role roleUser = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRoles(Set.of(roleUser));

        userRepository.save(u);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        List<String> roles = user.getRoles().stream().map(Role::getName).toList();
        String token = jwtService.generateToken(user.getUsername(), roles);

        return new AuthResponse(token, user.getUsername(), roles);
    }
}
