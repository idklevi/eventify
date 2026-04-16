package com.example.eventmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Category category = Category.OTHER;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EventStatus status = EventStatus.UPCOMING;

    @Column(name = "is_paid")
    @Builder.Default
    private boolean paid = false;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "payment_details")
    private String paymentDetails;

    @Column(name = "volunteer_info", columnDefinition = "TEXT")
    private String volunteerInfo;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @Column(name = "is_featured")
    @Builder.Default
    private boolean featured = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organiser_id")
    private User organiser;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Registration> registrations = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public boolean isPaid() {
        return paid;
    }

    public int getRegistrationCount() {
        return registrations != null ? registrations.size() : 0;
    }

    public boolean isAtCapacity() {
        return maxCapacity != null && getRegistrationCount() >= maxCapacity;
    }

    public enum Category {
        MUSIC, TECH, SPORTS, FOOD, ART, BUSINESS, EDUCATION, HEALTH, OTHER
    }

    public enum EventStatus {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }
}
