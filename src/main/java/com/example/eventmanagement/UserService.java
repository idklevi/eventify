package com.example.eventmanagement;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(User user, String roleName) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Find and set role
        Role userRole = roleRepository.findByName(roleName);
        if (userRole == null) {
            // This is a safety check. We'll create roles on startup.
            throw new RuntimeException("Error: Role not found.");
        }
        user.setRoles(Set.of(userRole));

        userRepository.save(user);
    }
}
