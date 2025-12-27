package com.example.user_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_profiles")
@Getter @Setter
@NoArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // map theo username trong JWT (sub)
    @Column(unique = true, nullable = false)
    private String username;

    private String fullName;
    private String phone;
    private String address;
}
