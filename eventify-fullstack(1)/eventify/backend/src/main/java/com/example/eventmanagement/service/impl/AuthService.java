package com.example.eventmanagement.service.impl;

import com.example.eventmanagement.dto.request.AuthRequest;
import com.example.eventmanagement.dto.response.AuthResponse;
import com.example.eventmanagement.entity.Role;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.exception.BadRequestException;
import com.example.eventmanagement.exception.ConflictException;
import com.example.eventmanagement.repository.RoleRepository;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse login(AuthRequest.Login request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateToken(authentication);

        var userDetails = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists.");
        }

        String roleName = (request.getRole() != null && request.getRole().startsWith("ROLE_"))
                ? request.getRole() : "ROLE_USER";

        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(roleName);
            // Prevent self-assigning admin
            if (roleEnum == Role.RoleName.ROLE_ADMIN) {
                roleEnum = Role.RoleName.ROLE_USER;
            }
        } catch (IllegalArgumentException e) {
            roleEnum = Role.RoleName.ROLE_USER;
        }

        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new BadRequestException("Role not configured. Please contact support."));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtUtils.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(List.of(roleEnum.name()))
                .build();
    }
}
