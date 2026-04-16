package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByOrganiserId(Long organiserId, Pageable pageable);

    List<Event> findByOrganiserId(Long organiserId);

    /**
     * Flexible search. All filter params are optional (null = ignored).
     * COALESCE trick keeps the query H2 + MySQL compatible without SpEL.
     */
    @Query("""
        SELECT e FROM Event e
        WHERE (COALESCE(:search, '') = ''
               OR LOWER(e.name)        LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.location)    LIKE LOWER(CONCAT('%', :search, '%')))
        AND   (COALESCE(:location, '') = ''
               OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND   (:dateFrom IS NULL OR e.date >= :dateFrom)
        AND   (:dateTo   IS NULL OR e.date <= :dateTo)
        AND   (:paid     IS NULL OR e.paid  = :paid)
        AND   (:category IS NULL OR e.category = :category)
        AND   (:status   IS NULL OR e.status   = :status)
    """)
    Page<Event> searchEvents(
        @Param("search")   String search,
        @Param("category") Event.Category category,
        @Param("location") String location,
        @Param("dateFrom") LocalDate dateFrom,
        @Param("dateTo")   LocalDate dateTo,
        @Param("paid")     Boolean paid,
        @Param("status")   Event.EventStatus status,
        Pageable pageable
    );

    List<Event> findByFeaturedTrueOrderByDateAsc();

    @Query("SELECT COUNT(e) FROM Event e")
    long countAllEvents();

    @Query("SELECT COUNT(e) FROM Event e WHERE e.date >= :today")
    long countUpcomingEvents(@Param("today") LocalDate today);
}
