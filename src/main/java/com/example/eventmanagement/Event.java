package com.example.eventmanagement;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String location;
    private LocalDate date;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    // --- THIS IS THE CRUCIAL PART ---
    // Make sure this field exists and is named 'organiser'
    @ManyToOne // Defines the relationship back to User
    @JoinColumn(name = "organiser_id", nullable = false) // Specifies the foreign key column
    private User organiser;
    // ---------------------------------

    private boolean isPaid;
    private double price;

    @Column(length = 500)
    private String paymentDetails;

    @Column(length = 1000)
    private String volunteerInfo;

    // --- Getters & Setters ---
    // (Ensure you have getters and setters for ALL fields, including 'organiser')

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    // --- Getter and Setter for organiser ---
    public User getOrganiser() { return organiser; }
    public void setOrganiser(User organiser) { this.organiser = organiser; }
    // ---------------------------------------

    public boolean isPaid() { return isPaid; }
    public void setPaid(boolean paid) { isPaid = paid; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(String paymentDetails) { this.paymentDetails = paymentDetails; }
    public String getVolunteerInfo() { return volunteerInfo; }
    public void setVolunteerInfo(String volunteerInfo) { this.volunteerInfo = volunteerInfo; }
}
