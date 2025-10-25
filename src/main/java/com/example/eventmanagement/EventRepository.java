package com.example.eventmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // <<< Add this import

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Spring Data JPA automatically provides methods like:
    // - save()
    // - findById()
    // - findAll()
    // - deleteById()

    // === NEW METHOD ===
    // Finds all events associated with a specific organiser's ID
    List<Event> findByOrganiserId(Long organiserId);
    // ==================
}
