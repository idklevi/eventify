package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUserIdOrderByRegistrationTimeDesc(Long userId);

    List<Registration> findByEventId(Long eventId);

    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    long countByEventId(Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r")
    long countAllRegistrations();

    @Query("SELECT r FROM Registration r JOIN FETCH r.event JOIN FETCH r.user WHERE r.user.id = :userId")
    List<Registration> findByUserIdWithDetails(@Param("userId") Long userId);
}
