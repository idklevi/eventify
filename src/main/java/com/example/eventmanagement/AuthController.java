package com.example.eventmanagement;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize; // Add import
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.ArrayList; // Keep this import
import java.util.List;      // <<< Add this import

@Controller
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository; // <<< Add RegistrationRepository

    // <<< Modify constructor to accept RegistrationRepository >>>
    public AuthController(UserService userService,
                          UserRepository userRepository,
                          RegistrationRepository registrationRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository; // <<< Assign it
    }

    @GetMapping("/login")
    public String viewLoginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(
            @Valid @ModelAttribute("user") User user,
            BindingResult result,
            @RequestParam("role") String role,
            Model model) {

        if (result.hasErrors()) {
            return "register";
        }

        try {
            userService.registerUser(user, role);
        } catch (RuntimeException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "register";
        }

        return "redirect:/login?register_success";
    }

    @GetMapping("/profile")
    public String viewProfilePage(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        model.addAttribute("user", currentUser);
        return "profile";
    }

    // === UPDATED Method for User Registrations Page ===
    @GetMapping("/my-registrations")
    @PreAuthorize("hasAuthority('ROLE_USER')") // Ensure only logged-in users can access
    public String viewMyRegistrations(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // === FETCH ACTUAL REGISTRATIONS ===
        List<Registration> userRegistrations = registrationRepository.findByUserId(currentUser.getId());
        // ==================================

        model.addAttribute("userName", currentUser.getName());
        model.addAttribute("registrations", userRegistrations); // <<< Pass the fetched list

        return "my_registrations"; // Name of the HTML file
    }
    // ==========================================
}
