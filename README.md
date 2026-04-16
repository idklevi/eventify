# Eventify — Full-Stack Event Management Platform

A production-grade event management platform built with **Spring Boot 3** + **React 18** + **Tailwind CSS**.

---

## 🏗️ Architecture

```
eventify/
├── backend/          Spring Boot 3 REST API (Java 17)
└── frontend/         React 18 + Vite + Tailwind CSS
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- (Optional) MySQL 8 for production

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Starts on **http://localhost:8080**  
H2 console: **http://localhost:8080/h2-console**  
JDBC URL: `jdbc:h2:mem:eventifydb`, User: `sa`, Password: (empty)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Starts on **http://localhost:5173** (proxies `/api` → backend)

---

## 🔑 Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@eventify.com | admin123 | Admin |
| organiser@eventify.com | password123 | Organiser |
| user@eventify.com | password123 | User |

---

## 📡 API Reference

All endpoints return `ApiResponse<T>`:
```json
{ "success": true, "message": "...", "data": {...}, "timestamp": "..." }
```

### Auth
| Method | Endpoint | Body | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | `{email, password}` | Public |
| POST | `/api/auth/register` | `{name, email, password, role}` | Public |

### Events
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/events?search=&category=&page=0&size=12` | Public |
| GET | `/api/events/featured` | Public |
| GET | `/api/events/{id}` | Public |
| POST | `/api/events` | ORGANISER / ADMIN |
| PUT | `/api/events/{id}` | Owner / ADMIN |
| DELETE | `/api/events/{id}` | Owner / ADMIN |

### Registrations
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/registrations/my` | Authenticated |
| POST | `/api/registrations/event/{eventId}` | Authenticated |
| DELETE | `/api/registrations/{id}` | Owner |

### Users
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/profile` | Authenticated |
| PUT | `/api/profile` | Authenticated |
| GET | `/api/admin/users` | ADMIN |
| GET | `/api/admin/stats` | ADMIN |
| GET | `/api/organiser/stats` | ORGANISER |

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ to Vercel — vercel.json handles SPA routing
```

Set environment variable in Vercel dashboard:
```
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend → Railway / Render

Set these environment variables:
```
DATABASE_URL=jdbc:mysql://host:3306/eventifydb
DATABASE_USERNAME=your_user
DATABASE_PASSWORD=your_password
DATABASE_DRIVER=com.mysql.cj.jdbc.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect
JPA_DDL_AUTO=update
H2_CONSOLE_ENABLED=false
JWT_SECRET=your-min-32-char-secret-key-here
CORS_ORIGINS=https://your-frontend.vercel.app
PORT=8080
```

Build command: `./mvnw clean package -DskipTests`  
Start command: `java -jar target/eventmanagement-0.0.1-SNAPSHOT.jar`

---

## 🔒 Security

- **JWT** stateless authentication (HS512, 24h expiry)
- **Role-based access**: `ROLE_USER`, `ROLE_ORGANISER`, `ROLE_ADMIN`
- **BCrypt** password encoding
- **CORS** configured via environment variable
- **Input validation** via Hibernate Validator on all DTOs
- **Global exception handler** — all errors return structured JSON

---

## 🗂️ Project Structure

### Backend
```
src/main/java/com/example/eventmanagement/
├── config/          SecurityConfig, DataInitializer
├── controller/      AuthController, EventController, RegistrationController, UserController
├── dto/
│   ├── request/     AuthRequest, EventRequest, ProfileUpdateRequest
│   └── response/    ApiResponse<T>, AuthResponse, EventResponse, UserResponse, RegistrationResponse
├── entity/          User, Event, Role, Registration
├── exception/       GlobalExceptionHandler, custom exceptions
├── repository/      JPA repositories with custom queries
├── security/        JwtUtils, JwtAuthenticationFilter, JwtAuthEntryPoint, UserDetailsServiceImpl
└── service/impl/    AuthService, EventService, RegistrationService, UserService
```

### Frontend
```
src/
├── components/
│   ├── events/      EventCard, EventFiltersBar, EventForm
│   ├── layout/      Layout, Navbar, Footer, AuthLayout
│   └── ui/          StatCard, EmptyState, Pagination, LoadingSpinner, ...
├── pages/           All 11 pages
├── services/        api.ts (Axios + JWT interceptors), eventify.ts (all API calls)
├── store/           authStore.ts (Zustand + persist)
├── types/           Full TypeScript types
└── utils/           helpers.ts (formatDate, cn, CATEGORY_META, ...)
```
