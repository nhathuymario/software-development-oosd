package com.example.user_service.repository;

import com.example.user_service.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // Có sẵn hàm findById của JPA rồi, không cần viết thêm gì
}