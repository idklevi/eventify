package com.example.eventmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Find registrations by user ID (to show in "My Registrations")
    List<Registration> findByUserId(Long userId);

    // Check if a user is already registered for an event
    Optional<Registration> findByUserAndEvent(User user, Event event);

    // Check if a user is already registered using IDs
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}
