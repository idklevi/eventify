package com.example.eventmanagement.dto.response;

import com.example.eventmanagement.entity.Registration;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RegistrationResponse {
    private Long id;
    private Registration.RegistrationStatus status;
    private LocalDateTime registrationTime;
    private EventResponse event;
    private Long userId;
    private String userName;
}
