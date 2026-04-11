
# 📌 Eventify – Event Management System

Eventify is a backend application built using Spring Boot that allows users to manage events, registrations, and authentication with role-based access control. It provides REST APIs for handling users, events, and registrations efficiently.

---

## 🚀 Features

* User authentication & authorization (Spring Security)
* Role-based access control (Admin/User)
* Event creation and management
* User registration for events
* RESTful API architecture
* MySQL database integration
* Secure password handling

---

## 🛠️ Tech Stack

* **Backend:** Spring Boot
* **Language:** Java
* **Database:** MySQL
* **Security:** Spring Security
* **Build Tool:** Maven

---

## 📂 Project Structure

```
src/main/java/com/example/eventmanagement
│
├── controller        # Handles API requests
├── model             # Entity classes (User, Event, Role, Registration)
├── repository        # JPA repositories
├── service           # Business logic
├── config            # Security configuration
├── DataInitializer   # Initial data setup
└── main application  # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eventify.git
cd eventify
```

### 2. Configure MySQL

Create a database in MySQL:

```sql
CREATE DATABASE eventify_db;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eventify_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

### 3. Run the application

```bash
mvn spring-boot:run
```

App will start at:

```
http://localhost:8080
```

---

## 🔐 Authentication

* Uses Spring Security
* Users are assigned roles:

  * `ROLE_USER`
  * `ROLE_ADMIN`

---

## 📌 API Overview

### Auth

* Register user
* Login user

### Events

* Create event (Admin)
* View events
* Update/Delete events (Admin)

### Registration

* Register for event
* View registrations

---

## 🧪 Sample Entities

* **User** → Stores user details and roles
* **Event** → Event information
* **Registration** → Links users to events
* **Role** → Defines permissions

---

## 📦 Build

```bash
mvn clean install
```

---

## 📄 Future Improvements

* Add frontend (React / Angular)
* Email notifications
* JWT-based authentication
* Pagination & filtering
* Docker deployment


