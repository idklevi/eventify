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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedRoles();
        seedUsers();
        seedEvents();
        log.info("✅ Data initialization complete.");
    }

    private void seedRoles() {
        for (Role.RoleName name : Role.RoleName.values()) {
            if (roleRepository.findByName(name).isEmpty()) {
                roleRepository.save(Role.builder().name(name).build());
                log.info("Created role: {}", name);
            }
        }
    }

    private void seedUsers() {
        // Admin
        if (!userRepository.existsByEmail("admin@eventify.com")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN).orElseThrow();
            userRepository.save(User.builder()
                    .name("Admin")
                    .email("admin@eventify.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build());
            log.info("Created admin user: admin@eventify.com / admin123");
        }

        // Demo Organiser
        if (!userRepository.existsByEmail("organiser@eventify.com")) {
            Role orgRole = roleRepository.findByName(Role.RoleName.ROLE_ORGANISER).orElseThrow();
            userRepository.save(User.builder()
                    .name("Jane Organiser")
                    .email("organiser@eventify.com")
                    .password(passwordEncoder.encode("password123"))
                    .bio("Passionate event organiser with 5 years of experience.")
                    .roles(Set.of(orgRole))
                    .build());
            log.info("Created organiser: organiser@eventify.com / password123");
        }

        // Demo User
        if (!userRepository.existsByEmail("user@eventify.com")) {
            Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER).orElseThrow();
            userRepository.save(User.builder()
                    .name("John User")
                    .email("user@eventify.com")
                    .password(passwordEncoder.encode("password123"))
                    .roles(Set.of(userRole))
                    .build());
            log.info("Created user: user@eventify.com / password123");
        }
    }

    private void seedEvents() {
        if (eventRepository.count() > 0) return;

        User organiser = userRepository.findByEmail("organiser@eventify.com").orElse(null);
        if (organiser == null) return;

        eventRepository.saveAll(List.of(
            Event.builder()
                .name("TechConf 2025")
                .description("The premier technology conference bringing together developers, designers, and innovators from around the world.")
                .location("San Francisco, CA")
                .date(LocalDate.now().plusDays(30))
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(18, 0))
                .category(Event.Category.TECH)
                .imageUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800")
                .paid(true)
                .price(new BigDecimal("299.00"))
                .paymentDetails("Pay via Stripe at checkout")
                .maxCapacity(500)
                .featured(true)
                .organiser(organiser)
                .build(),

            Event.builder()
                .name("Jazz Under the Stars")
                .description("An enchanting evening of live jazz music in the open air. Bring a blanket and enjoy world-class musicians.")
                .location("Central Park, New York")
                .date(LocalDate.now().plusDays(14))
                .startTime(LocalTime.of(19, 30))
                .endTime(LocalTime.of(23, 0))
                .category(Event.Category.MUSIC)
                .imageUrl("https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800")
                .paid(false)
                .featured(true)
                .organiser(organiser)
                .build(),

            Event.builder()
                .name("Street Food Festival")
                .description("Sample incredible cuisines from 50+ local vendors. From tacos to sushi, there's something for every palate.")
                .location("Downtown Austin, TX")
                .date(LocalDate.now().plusDays(7))
                .startTime(LocalTime.of(11, 0))
                .endTime(LocalTime.of(21, 0))
                .category(Event.Category.FOOD)
                .imageUrl("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800")
                .paid(true)
                .price(new BigDecimal("15.00"))
                .maxCapacity(2000)
                .organiser(organiser)
                .build(),

            Event.builder()
                .name("Startup Pitch Night")
                .description("Watch 10 promising startups pitch to a panel of top VCs. Networking drinks follow the main event.")
                .location("WeWork, Chicago")
                .date(LocalDate.now().plusDays(21))
                .startTime(LocalTime.of(18, 0))
                .category(Event.Category.BUSINESS)
                .imageUrl("https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800")
                .paid(true)
                .price(new BigDecimal("49.00"))
                .maxCapacity(150)
                .featured(true)
                .organiser(organiser)
                .build(),

            Event.builder()
                .name("Morning Yoga in the Park")
                .description("Start your weekend right with a 90-minute outdoor yoga session suitable for all levels.")
                .location("Griffith Park, Los Angeles")
                .date(LocalDate.now().plusDays(3))
                .startTime(LocalTime.of(7, 0))
                .endTime(LocalTime.of(8, 30))
                .category(Event.Category.HEALTH)
                .imageUrl("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800")
                .paid(false)
                .maxCapacity(50)
                .organiser(organiser)
                .build(),

            Event.builder()
                .name("Modern Art Exhibition")
                .description("Featuring works from 30 emerging artists exploring themes of identity, technology, and the natural world.")
                .location("Gallery District, Miami")
                .date(LocalDate.now().plusDays(45))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(20, 0))
                .category(Event.Category.ART)
                .imageUrl("https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800")
                .paid(true)
                .price(new BigDecimal("20.00"))
                .organiser(organiser)
                .build()
        ));
        log.info("Seeded {} demo events", 6);
    }
}
