package com.example.eventmanagement.dto.request;

import com.example.eventmanagement.entity.Event;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventRequest {

    @NotBlank(message = "Event name is required")
    @Size(min = 3, max = 200, message = "Event name must be between 3 and 200 characters")
    private String name;

    @Size(max = 5000, message = "Description too long")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Event date cannot be in the past")
    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;
    private String imageUrl;

    private Event.Category category = Event.Category.OTHER;

    private boolean paid = false;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price = BigDecimal.ZERO;

    private String paymentDetails;
    private String volunteerInfo;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer maxCapacity;
}
