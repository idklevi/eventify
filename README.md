# Eventify 🗓️

A web application for managing and discovering events, built with Java and Spring Boot.

## 🌟 About

Eventify is a platform designed to connect event organisers and attendees. It allows organisers to create, manage, and promote their events, while users can browse, discover, and register for events happening around them. The application features role-based access control for different user types (User, Organiser, Admin).

---

## ✨ Features

-   **Role-Based Access Control** - Distinct permissions for Users, Organisers, and Admins.
-   **User Authentication** - Secure Sign Up and Sign In functionality using Spring Security.
-   **Event Management (Organiser)** - Create, edit, update, and delete events.
-   **Event Discovery (Public/User)** - Browse upcoming events on the homepage.
-   **Event Registration (User)** - Users can register for events they are interested in.
-   **Paid/Free Events** - Organisers can specify if an event is free or paid, including price and payment details.
-   **Volunteer Information** - Organisers can add details about volunteer opportunities for their events.
-   **Organiser Dashboard** - View and manage events created by the organiser.
-   **User Profile Page** - View user details (name, email, roles).
-   **"My Registrations" Page** - Users can view the events they have registered for.
-   **Persistent Storage** - Uses an H2 file-based database to retain data across application restarts.
-   **Responsive UI** - Clean and modern user interface built with Bootstrap 5 and Thymeleaf.

---

## 🛠️ Tech Stack

-   **Java 17+** - Core programming language
-   **Spring Boot 3.2.0** - Application framework
-   **Spring Data JPA** - Database interaction
-   **Spring Security** - Authentication and authorization
-   **Thymeleaf** - Server-side templating engine
-   **H2 Database** - File-based relational database
-   **Maven** - Build and dependency management
-   **Bootstrap 5** - Frontend CSS framework
-   **HTML5 & CSS3** - Structure and custom styling

---

## 📦 Setup & Installation

**Prerequisites:**
* Java Development Kit (JDK) 17 or higher installed.
* Apache Maven installed.

```bash
# Clone the repository
git clone <your-repository-url> # Replace with your actual repo URL
# Example: git clone [https://github.com/yourusername/eventify-5.0.git](https://github.com/yourusername/eventify-5.0.git)

# Navigate to project directory
cd eventify-5.0

# Run the application using Maven
mvn spring-boot:run
