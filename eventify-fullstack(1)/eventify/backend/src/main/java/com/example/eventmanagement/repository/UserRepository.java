package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u")
    long countAllUsers();

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = 'ROLE_ORGANISER'")
    long countOrganisers();
}
