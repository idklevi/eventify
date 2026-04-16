package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.request.AuthRequest;
import com.example.eventmanagement.dto.response.ApiResponse;
import com.example.eventmanagement.dto.response.AuthResponse;
import com.example.eventmanagement.service.impl.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest.Login request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody AuthRequest.Register request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Registration successful", response));
    }
}
