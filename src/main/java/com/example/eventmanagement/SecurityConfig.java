package com.example.eventmanagement;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // Public access
                .requestMatchers(
                    "/",
                    "/login",
                    "/register",
                    "/css/**",
                    "/js/**",
                    "/h2-console/**"
                ).permitAll()

                // Organiser access
                .requestMatchers(
                    "/showNewEventForm",
                    "/saveEvent",
                    "/editEvent/**",
                    "/updateEvent/**",
                    "/deleteEvent/**",
                    "/organiser/dashboard"
                ).hasAuthority("ROLE_ORGANISER")

                // Admin access (example)
                .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

                // User access (example)
                .requestMatchers("/my-registrations", "/register-for-event/**").hasAuthority("ROLE_USER")

                // === ADD /profile permission ===
                .requestMatchers("/profile").authenticated() // Any logged-in user can see their profile
                // =============================

                // All other requests need authentication
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**")))
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}
