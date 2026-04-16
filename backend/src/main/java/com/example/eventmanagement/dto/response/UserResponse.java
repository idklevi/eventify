package com.example.eventmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String bio;
    private String profileImageUrl;
    private boolean active;
    private List<String> roles;
    private LocalDateTime createdAt;
    private int eventCount;
    private int registrationCount;
}
