package com.example.eventmanagement.dto.response;

import com.example.eventmanagement.entity.Event;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String imageUrl;
    private Event.Category category;
    private Event.EventStatus status;
    private boolean paid;
    private BigDecimal price;
    private String paymentDetails;
    private String volunteerInfo;
    private Integer maxCapacity;
    private int registrationCount;
    private boolean atCapacity;
    private boolean featured;
    private OrganiserInfo organiser;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class OrganiserInfo {
        private Long id;
        private String name;
        private String email;
        private String profileImageUrl;
    }
}
