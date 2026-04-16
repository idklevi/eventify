package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.response.ApiResponse;
import com.example.eventmanagement.dto.response.RegistrationResponse;
import com.example.eventmanagement.service.impl.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getMyRegistrations(userDetails.getUsername())));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getEventRegistrations(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getEventRegistrations(eventId, userDetails.getUsername())));
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        RegistrationResponse response = registrationService.register(eventId, userDetails.getUsername());
        return ResponseEntity.status(201).body(ApiResponse.success("Successfully registered for event!", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        registrationService.cancel(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled", null));
    }
}
