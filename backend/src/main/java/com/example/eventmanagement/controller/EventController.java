package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.request.EventRequest;
import com.example.eventmanagement.dto.response.ApiResponse;
import com.example.eventmanagement.dto.response.EventResponse;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.service.impl.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Event.Category category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) Boolean paid,
            @RequestParam(required = false) Event.EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<EventResponse> events = eventService.searchEvents(
                search, category, location, dateFrom, dateTo, paid, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getFeatured()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANISER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> create(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EventResponse event = eventService.create(request, userDetails.getUsername());
        return ResponseEntity.status(201).body(ApiResponse.success("Event created successfully", event));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANISER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EventResponse event = eventService.update(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANISER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        eventService.delete(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANISER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        var organiser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new com.example.eventmanagement.exception.ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return ResponseEntity.ok(ApiResponse.success(eventService.getByOrganiser(organiser.getId(), pageable)));
    }
}
