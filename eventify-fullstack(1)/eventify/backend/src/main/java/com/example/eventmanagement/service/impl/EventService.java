package com.example.eventmanagement.service.impl;

import com.example.eventmanagement.dto.request.EventRequest;
import com.example.eventmanagement.dto.response.EventResponse;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.exception.BadRequestException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Page<EventResponse> searchEvents(String search, Event.Category category,
                                             String location, LocalDate dateFrom, LocalDate dateTo,
                                             Boolean paid, Event.EventStatus status, Pageable pageable) {
        Page<Event> events = eventRepository.searchEvents(
                search, category, location, dateFrom, dateTo, paid, status, pageable);
        return events.map(this::toResponse);
    }

    public EventResponse getById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));
        return toResponse(event);
    }

    public Page<EventResponse> getByOrganiser(Long organiserId, Pageable pageable) {
        return eventRepository.findByOrganiserId(organiserId, pageable).map(this::toResponse);
    }

    public List<EventResponse> getFeatured() {
        return eventRepository.findByFeaturedTrueOrderByDateAsc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public EventResponse create(EventRequest request, String organiserEmail) {
        User organiser = userRepository.findByEmail(organiserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory() != null ? request.getCategory() : Event.Category.OTHER)
                .paid(request.isPaid())
                .price(request.getPrice())
                .paymentDetails(request.getPaymentDetails())
                .volunteerInfo(request.getVolunteerInfo())
                .maxCapacity(request.getMaxCapacity())
                .organiser(organiser)
                .build();

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse update(Long id, EventRequest request, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));

        checkOwnership(event, userEmail);

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setDate(request.getDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setImageUrl(request.getImageUrl());
        event.setCategory(request.getCategory() != null ? request.getCategory() : Event.Category.OTHER);
        event.setPaid(request.isPaid());
        event.setPrice(request.getPrice());
        event.setPaymentDetails(request.getPaymentDetails());
        event.setVolunteerInfo(request.getVolunteerInfo());
        event.setMaxCapacity(request.getMaxCapacity());

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void delete(Long id, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));
        checkOwnership(event, userEmail);
        eventRepository.delete(event);
    }

    private void checkOwnership(Event event, String userEmail) {
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean isAdmin = requester.getRoles().stream()
                .anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
        if (!isAdmin && (event.getOrganiser() == null || !event.getOrganiser().getEmail().equals(userEmail))) {
            throw new AccessDeniedException("You are not the organiser of this event.");
        }
    }

    public EventResponse toResponse(Event event) {
        EventResponse.OrganiserInfo organiserInfo = null;
        if (event.getOrganiser() != null) {
            organiserInfo = EventResponse.OrganiserInfo.builder()
                    .id(event.getOrganiser().getId())
                    .name(event.getOrganiser().getName())
                    .email(event.getOrganiser().getEmail())
                    .profileImageUrl(event.getOrganiser().getProfileImageUrl())
                    .build();
        }

        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .location(event.getLocation())
                .date(event.getDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .imageUrl(event.getImageUrl())
                .category(event.getCategory())
                .status(event.getStatus())
                .paid(event.isPaid())
                .price(event.getPrice())
                .paymentDetails(event.getPaymentDetails())
                .volunteerInfo(event.getVolunteerInfo())
                .maxCapacity(event.getMaxCapacity())
                .registrationCount(event.getRegistrationCount())
                .atCapacity(event.isAtCapacity())
                .featured(event.isFeatured())
                .organiser(organiserInfo)
                .createdAt(event.getCreatedAt())
                .build();
    }
}
