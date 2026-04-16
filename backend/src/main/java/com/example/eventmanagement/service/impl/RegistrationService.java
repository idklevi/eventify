package com.example.eventmanagement.service.impl;

import com.example.eventmanagement.dto.response.RegistrationResponse;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.Registration;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.exception.BadRequestException;
import com.example.eventmanagement.exception.ConflictException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventService eventService;

    public List<RegistrationResponse> getMyRegistrations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return registrationRepository.findByUserIdWithDetails(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<RegistrationResponse> getEventRegistrations(Long eventId, String requesterEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = requester.getRoles().stream()
                .anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
        boolean isOrganiser = event.getOrganiser() != null &&
                event.getOrganiser().getEmail().equals(requesterEmail);

        if (!isAdmin && !isOrganiser) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }

        return registrationRepository.findByEventId(eventId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public RegistrationResponse register(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        if (registrationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new ConflictException("You are already registered for this event.");
        }

        if (event.isAtCapacity()) {
            throw new BadRequestException("This event has reached maximum capacity.");
        }

        Registration registration = Registration.builder()
                .user(user)
                .event(event)
                .status(Registration.RegistrationStatus.CONFIRMED)
                .build();

        return toResponse(registrationRepository.save(registration));
    }

    @Transactional
    public void cancel(Long registrationId, String userEmail) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration", registrationId));

        if (!registration.getUser().getEmail().equals(userEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot cancel another user's registration");
        }

        registration.setStatus(Registration.RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
    }

    private RegistrationResponse toResponse(Registration reg) {
        return RegistrationResponse.builder()
                .id(reg.getId())
                .status(reg.getStatus())
                .registrationTime(reg.getRegistrationTime())
                .event(reg.getEvent() != null ? eventService.toResponse(reg.getEvent()) : null)
                .userId(reg.getUser().getId())
                .userName(reg.getUser().getName())
                .build();
    }
}
