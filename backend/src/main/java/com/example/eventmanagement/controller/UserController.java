package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.request.ProfileUpdateRequest;
import com.example.eventmanagement.dto.response.ApiResponse;
import com.example.eventmanagement.dto.response.UserResponse;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.service.impl.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    // ─── Profile ─────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.getProfile(userDetails.getUsername())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateProfile(userDetails.getUsername(), request)));
    }

    // ─── Admin ────────────────────────────────────────────────
    @GetMapping("/admin/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.getAllUsers(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @PatchMapping("/admin/users/{id}/toggle-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status updated", null));
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.countAllUsers());
        stats.put("totalEvents", eventRepository.countAllEvents());
        stats.put("upcomingEvents", eventRepository.countUpcomingEvents(LocalDate.now()));
        stats.put("totalRegistrations", registrationRepository.countAllRegistrations());
        stats.put("totalOrganisers", userRepository.countOrganisers());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ─── Organiser Dashboard Stats ────────────────────────────
    @GetMapping("/organiser/stats")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANISER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrganiserStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var events = eventRepository.findByOrganiserId(user.getId());

        long totalRegistrations = events.stream()
                .mapToLong(e -> registrationRepository.countByEventId(e.getId()))
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", events.size());
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("upcomingEvents", events.stream()
                .filter(e -> !e.getDate().isBefore(LocalDate.now())).count());

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
