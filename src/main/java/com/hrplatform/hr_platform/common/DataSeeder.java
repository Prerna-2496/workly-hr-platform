package com.hrplatform.hr_platform.common;

import com.hrplatform.hr_platform.module.auth.entity.Role;
import com.hrplatform.hr_platform.module.auth.entity.User;
import com.hrplatform.hr_platform.module.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@workly.io")) {
            User superAdmin = new User();
            superAdmin.setName("Super Admin");
            superAdmin.setEmail("admin@workly.io");
            superAdmin.setPassword(passwordEncoder.encode("Workly@2024"));
            superAdmin.setRole(Role.SUPER_ADMIN);
            superAdmin.setTenantId(0L);
            superAdmin.setIsActive(true);
            superAdmin.setIsApproved(true);
            userRepository.save(superAdmin);
            System.out.println("=== Super Admin created: admin@workly.io / Workly@2024 ===");
        } else {
            System.out.println("=== Super Admin already exists ===");
        }
    }
}