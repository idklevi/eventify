package com.example.eventmanagement;

// --- Imports needed for Edit/Delete ---
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.Optional;
// -----------------------------
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventController(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    public String viewHomePage(Model model) {
        model.addAttribute("allEvents", eventRepository.findAll());
        return "index";
    }

    @GetMapping("/showNewEventForm")
    public String showNewEventForm(Model model) {
        model.addAttribute("event", new Event());
        return "new_event_form";
    }

    @PostMapping("/saveEvent")
    public String saveEvent(@ModelAttribute("event") Event event,
                            @AuthenticationPrincipal UserDetails userDetails) {

        User organiser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Organiser not found"));

        event.setOrganiser(organiser);
        eventRepository.save(event);
        return "redirect:/";
    }

    @GetMapping("/organiser/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ORGANISER')")
    public String viewOrganiserDashboard(Model model, @AuthenticationPrincipal UserDetails userDetails) {

        User organiser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Organiser not found while loading dashboard"));

        List<Event> organiserEvents = eventRepository.findByOrganiserId(organiser.getId());

        model.addAttribute("organiserEvents", organiserEvents);
        model.addAttribute("organiserName", organiser.getName());

        return "organiser_dashboard";
    }

    @GetMapping("/editEvent/{id}")
    @PreAuthorize("hasAuthority('ROLE_ORGANISER')")
    public String showEditEventForm(@PathVariable("id") Long id, Model model,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    RedirectAttributes redirectAttributes) {

        Optional<Event> eventOptional = eventRepository.findById(id);

        if (eventOptional.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Event not found.");
            return "redirect:/organiser/dashboard";
        }

        Event event = eventOptional.get();

        if (event.getOrganiser() == null || !event.getOrganiser().getEmail().equals(userDetails.getUsername())) {
             redirectAttributes.addFlashAttribute("errorMessage", "You are not authorized to edit this event.");
            return "redirect:/organiser/dashboard";
        }

        model.addAttribute("event", event);
        return "edit_event_form";
    }

    @PostMapping("/updateEvent/{id}")
    @PreAuthorize("hasAuthority('ROLE_ORGANISER')")
    public String updateEvent(@PathVariable("id") Long id,
                              @ModelAttribute("event") Event eventDetails,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes) {

        Optional<Event> eventOptional = eventRepository.findById(id);

        if (eventOptional.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Event not found.");
            return "redirect:/organiser/dashboard";
        }

        Event existingEvent = eventOptional.get();

        if (existingEvent.getOrganiser() == null || !existingEvent.getOrganiser().getEmail().equals(userDetails.getUsername())) {
             redirectAttributes.addFlashAttribute("errorMessage", "You are not authorized to update this event.");
            return "redirect:/organiser/dashboard";
        }

        existingEvent.setName(eventDetails.getName());
        existingEvent.setLocation(eventDetails.getLocation());
        existingEvent.setDate(eventDetails.getDate());
        existingEvent.setDescription(eventDetails.getDescription());
        existingEvent.setImageUrl(eventDetails.getImageUrl());
        existingEvent.setPaid(eventDetails.isPaid());
        existingEvent.setPrice(eventDetails.getPrice());
        existingEvent.setPaymentDetails(eventDetails.getPaymentDetails());
        existingEvent.setVolunteerInfo(eventDetails.getVolunteerInfo());

        eventRepository.save(existingEvent);

        redirectAttributes.addFlashAttribute("successMessage", "Event updated successfully!");
        return "redirect:/organiser/dashboard";
    }

    // === NEW METHOD: Process Event Deletion ===
    @PostMapping("/deleteEvent/{id}")
    @PreAuthorize("hasAuthority('ROLE_ORGANISER')")
    public String deleteEvent(@PathVariable("id") Long id,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes) {

        Optional<Event> eventOptional = eventRepository.findById(id);

        if (eventOptional.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Event not found.");
            return "redirect:/organiser/dashboard";
        }

        Event eventToDelete = eventOptional.get();

        if (eventToDelete.getOrganiser() == null || !eventToDelete.getOrganiser().getEmail().equals(userDetails.getUsername())) {
             redirectAttributes.addFlashAttribute("errorMessage", "You are not authorized to delete this event.");
            return "redirect:/organiser/dashboard";
        }

        try {
            eventRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Event '" + eventToDelete.getName() + "' deleted successfully!");
        } catch (Exception e) {
            // Optional: Add logging here if needed
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting event. Please try again.");
        }

        return "redirect:/organiser/dashboard";
    }
    // =======================================
}
