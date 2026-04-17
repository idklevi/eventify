package com.example.eventmanagement.config;

import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.Role;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RoleRepository;
import com.example.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Seeds roles, demo users, and demo events on every startup.
 *
 * KEY DESIGN: each seed method runs in its OWN transaction
 * (Propagation.REQUIRES_NEW) so that roles committed in seedRoles()
 * are immediately visible when seedUsers() queries for them.
 * This prevents the H2 read-isolation issue that caused
 * "invalid email or password" for demo accounts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository     roleRepository;
    private final UserRepository     userRepository;
    private final EventRepository    eventRepository;
    private final PasswordEncoder    passwordEncoder;

    // ─── Entry point (no transaction — delegates to methods that own theirs) ──
    @Override
    public void run(String... args) {
        seedRoles();   // tx 1 — commits before seedUsers() starts
        seedUsers();   // tx 2 — roles are now visible
        seedEvents();  // tx 3 — users are now visible
        log.info("✅ Data initialisation complete.");
    }

    // ─── Roles ────────────────────────────────────────────────────────────────
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void seedRoles() {
        for (Role.RoleName name : Role.RoleName.values()) {
            if (roleRepository.findByName(name).isEmpty()) {
                roleRepository.save(Role.builder().name(name).build());
                log.info("  → Created role: {}", name);
            }
        }
    }

    // ─── Demo users ───────────────────────────────────────────────────────────
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void seedUsers() {
        createUserIfMissing(
            "Admin",
            "admin@eventify.com",
            "admin123",
            Role.RoleName.ROLE_ADMIN
        );
        createUserIfMissing(
            "Jane Organiser",
            "organiser@eventify.com",
            "password123",
            Role.RoleName.ROLE_ORGANISER
        );
        createUserIfMissing(
            "John User",
            "user@eventify.com",
            "password123",
            Role.RoleName.ROLE_USER
        );
    }

    private void createUserIfMissing(String name, String email,
                                     String rawPassword, Role.RoleName roleName) {
        if (userRepository.existsByEmail(email)) {
            log.info("  → User already exists: {}", email);
            return;
        }

        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new IllegalStateException(
                "Role " + roleName + " not found — seedRoles() must run first"));

        // Explicitly build the roles set so Lombok @Builder.Default is respected
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
            .name(name)
            .email(email)
            .password(passwordEncoder.encode(rawPassword))
            .active(true)
            .roles(roles)
            .build();

        userRepository.save(user);
        log.info("  → Created user: {} / {} (role: {})", email, rawPassword, roleName);
    }

    // ─── Demo events ──────────────────────────────────────────────────────────
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void seedEvents() {
        if (eventRepository.count() > 0) {
            log.info("  → Events already seeded, skipping.");
            return;
        }

        User organiser = userRepository.findByEmail("organiser@eventify.com")
            .orElse(null);
        if (organiser == null) {
            log.warn("  → Organiser user not found — skipping event seeding.");
            return;
        }

        eventRepository.saveAll(List.of(
            event("TechConf 2025",
                "The premier tech conference for developers, designers, and innovators.",
                "San Francisco, CA", 30,
                Event.Category.TECH,
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                true, new BigDecimal("299.00"), "Pay via Stripe at checkout", 500, true, organiser),

            event("Jazz Under the Stars",
                "An enchanting evening of live jazz in the open air.",
                "Central Park, New York", 14,
                Event.Category.MUSIC,
                "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
                false, BigDecimal.ZERO, null, null, true, organiser),

            event("Street Food Festival",
                "Sample cuisines from 50+ local vendors — tacos to sushi.",
                "Downtown Austin, TX", 7,
                Event.Category.FOOD,
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
                true, new BigDecimal("15.00"), "Pay at gate", 2000, false, organiser),

            event("Startup Pitch Night",
                "10 startups pitch to top VCs. Networking drinks follow.",
                "WeWork, Chicago", 21,
                Event.Category.BUSINESS,
                "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
                true, new BigDecimal("49.00"), "Eventbrite checkout", 150, true, organiser),

            event("Morning Yoga in the Park",
                "90-minute outdoor yoga suitable for all levels.",
                "Griffith Park, Los Angeles", 3,
                Event.Category.HEALTH,
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
                false, BigDecimal.ZERO, null, 50, false, organiser),

            event("Modern Art Exhibition",
                "30 emerging artists exploring identity, technology, and nature.",
                "Gallery District, Miami", 45,
                Event.Category.ART,
                "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800",
                true, new BigDecimal("20.00"), "Pay online", null, false, organiser)
        ));
        log.info("  → Seeded 6 demo events.");
    }

    // ─── Builder helper ───────────────────────────────────────────────────────
    private Event event(String name, String description, String location,
                        int daysFromNow, Event.Category category,
                        String imageUrl, boolean paid, BigDecimal price,
                        String paymentDetails, Integer capacity,
                        boolean featured, User organiser) {
        return Event.builder()
            .name(name)
            .description(description)
            .location(location)
            .date(LocalDate.now().plusDays(daysFromNow))
            .startTime(LocalTime.of(10, 0))
            .category(category)
            .imageUrl(imageUrl)
            .paid(paid)
            .price(price)
            .paymentDetails(paymentDetails)
            .maxCapacity(capacity)
            .featured(featured)
            .organiser(organiser)
            .build();
    }
}
