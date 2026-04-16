package com.example.eventmanagement.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String phoneNumber;

    @Size(max = 500, message = "Bio too long")
    private String bio;

    private String profileImageUrl;
}
