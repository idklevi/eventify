
package com.example.eventmanagement;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class RegistrationController {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public RegistrationController(RegistrationRepository registrationRepository,
                                  UserRepository userRepository,
                                  EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping("/register-for-event/{eventId}")
    @PreAuthorize("hasAuthority('ROLE_USER')") // Only ROLE_USER can register
    public String registerForEvent(@PathVariable("eventId") Long eventId,
                                   @AuthenticationPrincipal UserDetails userDetails,
                                   RedirectAttributes redirectAttributes) {

        // Find logged-in user
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if already registered
        if (registrationRepository.existsByUserIdAndEventId(user.getId(), event.getId())) {
            redirectAttributes.addFlashAttribute("errorMessage", "You are already registered for '" + event.getName() + "'.");
            return "redirect:/"; // Redirect back home
        }

        // Create and save registration
        Registration registration = new Registration(user, event);
        registrationRepository.save(registration);

        redirectAttributes.addFlashAttribute("successMessage", "Successfully registered for '" + event.getName() + "'!");
        return "redirect:/"; // Redirect back home
    }
}
