package com.example.eventmanagement.service.impl;

import com.example.eventmanagement.dto.request.ProfileUpdateRequest;
import com.example.eventmanagement.dto.response.UserResponse;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user);
    }

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());

        return toResponse(userRepository.save(user));
    }

    // Admin only
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public UserResponse toResponse(User user) {
        int eventCount = eventRepository.findByOrganiserId(user.getId()).size();
        int registrationCount = registrationRepository.findByUserIdOrderByRegistrationTimeDesc(user.getId()).size();

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .active(user.isActive())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .toList())
                .createdAt(user.getCreatedAt())
                .eventCount(eventCount)
                .registrationCount(registrationCount)
                .build();
    }
}
