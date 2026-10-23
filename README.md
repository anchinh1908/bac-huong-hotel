# 🏨 BẮC HƯƠNG HOTEL — REAL-TIME HOTEL MANAGEMENT & BOOKING SYSTEM

> **Bac Huong Hotel** is a full-stack, enterprise-grade web application engineered for modern hospitality management. It delivers an end-to-end digital experience for both hotel guests (online reservation portal) and hotel operators (real-time front-desk and administrative dashboards).

---

## 🌟 Overview & Key Capabilities

This system provides a complete digital transformation solution tailored for boutique hotels and hospitality services:

- **Customer Reservation Portal (Client Experience):**
  - Explore room categories with high-resolution photo galleries and extended amenity lists.
  - Smart filtering by capacity (1–4+ guests), bed type (Single, Queen, King, Family), price range, and real-time availability.
  - Standardized booking form with automated stay duration & expected check-out calculation, Vietnamese phone validation, and automated email notifications.
  - Personal booking tracking ledger where guests can monitor booking approvals, view cancellation notes, or self-cancel before arrival.
  - Bookmark & favorites management stored locally without requiring immediate sign-in.

- **Admin & Front-Desk Staff Command Center (Operations):**
  - **Color-Coded Room Matrix:** Interactive visual board depicting room states:
    - 🟢 **Available (Green):** Ready for new check-ins.
    - 🔴 **Occupied (Red):** Guest in-house, displaying guest name and scheduled check-out date.
    - 🟡 **Cleaning / Maintenance (Yellow):** Housekeeping in progress.
  - **Instant Booking Chimes & Alerts:** Audio bell notification and floating popup triggered immediately when a guest submits a new reservation.
  - **Reservation Lifecycle Management:** Review incoming bookings, one-click approval (locks room to Occupied and dispatches confirmation email) or rejection with a polite explanation note.
  - **Room Catalog Management (CRUD):** Admin-only privilege to add, update pricing, upload images, and configure room specifications with smooth 10-item pagination.
  - **Hotel Information & Branding Management:** Complete administrative control to update hotel contact info, hotline, Google Maps direct links, check-in/out policies, and add/edit/delete custom service policies.
  - **Staff Management & Role-Based Access Control (RBAC):** Super Admin can provision front-desk staff accounts or designate administrative privileges.

---

## 🛠️ Technology Stack

| Layer | Technologies / Frameworks | Purpose & Implementation |
| :--- | :--- | :--- |
| **Backend** | **Java 21 / Spring Boot 3.4+** | Core RESTful API server, transaction handling, dependency injection |
| **Database** | **MySQL 8.0** | Relational data persistence for rooms, bookings, hotel profile, and user credentials |
| **ORM / Data Access** | **Spring Data JPA / Hibernate 6** | Declarative repositories, schema synchronization, query abstraction |
| **Email Service** | **Spring Mail (Gmail SMTP)** | Automated transactional email notifications with booking codes and status updates |
| **Frontend** | **React 18 + Vite** | High-performance Single Page Application (SPA) with fast HMR |
| **Design & Icons** | **Vanilla CSS + Lucide React** | Warm Luxury Amber design system, responsive across desktop, tablet, and mobile |
| **Authentication** | **BCrypt + Google Identity OAuth2** | Credential-based login, password hashing, and 1-click Google OAuth sign-in |

---

## 🚀 Key Feature Breakdown

### 1. Client Portal
- 🔍 **Interactive Room Discovery:** View room specifications, multiple high-definition photos, bed configuration, square footage, and comprehensive amenity badges.
- 📅 **Dynamic Stay Calculator:** Selecting the number of nights automatically calculates the expected check-out date based on local time and calculates total pricing.
- 📨 **Instant Customer Confirmation:** Dispatches real-time transactional emails containing booking codes (`BH-XXXX`) upon submission and approval.

### 2. Admin & Staff Operations
- 🎨 **One-Click State Transitions:** Front-desk staff can instantly switch room statuses between Available, Occupied, and Cleaning directly on the interactive floor grid.
- 🛎️ **Front-Desk Bell Notification:** Real-time polling detects incoming reservations and sounds an alert with a visual notification bubble.
- 📊 **Comprehensive Booking Ledger:** Filter by pending, confirmed, and cancelled bookings. Paginated with 10 records per view and sorted by latest timestamp.
- ⚙️ **Hotel Profile Control:** Modify hotel address, landline, mobile hotlines, email, official check-in (14:00) and check-out (12:00) times, and manage custom operational policies.
- 👥 **Personnel Delegation:** Super Admin can safely register new staff credentials, review user roles, and revoke access when necessary.

---

## 📁 Repository Structure

```bash
bac-huong-hotel/
├── backend/                             # Spring Boot 3 backend application
│   ├── src/main/java/com/bachuong/hotel/
│   │   ├── controller/                 # REST APIs (HotelController, AuthController)
│   │   ├── model/                      # JPA Entities (Room, Booking, Account, HotelInfo)
│   │   ├── repository/                 # Spring Data JPA Repositories
│   │   └── service/                    # Automated EmailService implementation
│   ├── src/main/resources/
│   │   ├── application.properties.example # Sample database & mail configuration
│   │   └── application.properties      # Active local properties (git-ignored)
│   └── pom.xml                         # Maven build file and dependencies
│
├── frontend/                            # React + Vite frontend application
│   ├── src/
│   │   ├── components/                 # UI components (AdminDashboard, RoomDetailModal, ...)
│   │   ├── data/bacHuongData.js        # Fallback offline catalog
│   │   ├── App.jsx                     # Core application orchestrator
│   │   └── main.jsx                    # Application entry point
│   ├── package.json                    # Node dependencies and scripts
│   └── vite.config.js
│
├── database/                            # Database setup and migrations
│   └── schema.sql                      # Table schemas and initial seed data
├── run_backend.bat                      # Windows shortcut to launch backend
├── run_frontend.bat                     # Windows shortcut to launch frontend
├── .gitignore                           # Ignored build outputs and sensitive files
└── README.md                            # Project documentation
```

---

## ⚡ Installation & Quick Start

### Prerequisites
- **JDK 17 or Java 21**
- **Node.js 18+ & npm**
- **MySQL 8.0 Server** (running locally on port `3306` or `3309`)

---

### Step 1: Database Setup
1. Open your MySQL client (MySQL Workbench, DBeaver, or CLI).
2. Execute the setup script [`database/schema.sql`](database/schema.sql) to initialize the `bachuong_hotel` database, create tables, and populate seed data:
   ```sql
   source database/schema.sql;
   ```

---

### Step 2: Backend Configuration & Startup
1. Navigate to `backend/src/main/resources/`.
2. Copy `application.properties.example` to `application.properties` if not already present.
3. Verify your database connection credentials and mail settings:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3309/bachuong_hotel?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password

   # Gmail SMTP for transactional notifications
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_gmail_app_password
   ```
4. Start the Spring Boot backend server (Port `8080`):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *(Or double-click `run_backend.bat` on Windows).*

---

### Step 3: Frontend Installation & Startup
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Or double-click `run_frontend.bat` on Windows).*
2. Open your web browser and navigate to:
   ```
   http://localhost:3001
   ```

---

## 🔐 Default Access Credentials

| Role | Username / Identifier | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Supreme Admin** | `admin` | `admin123456` | Full system control: Room CRUD, Hotel Info, Staff Management, Bookings, Room Matrix |
| **Front-Desk Staff** | `Hoai` | `123456` | Operations: Room Matrix, Booking approvals/rejections, Personal password change |
| **Customer** | *(Self-register or Google Login)* | *(User set)* | Room browsing, booking submissions, booking history tracking |

---

## 📡 REST API Reference Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Public | Retrieve all rooms with real-time status and metadata |
| `POST` | `/api/rooms` | Admin | Create a new hotel room |
| `PUT` | `/api/rooms/{id}` | Admin | Update room specifications, pricing, and images |
| `DELETE` | `/api/rooms/{id}` | Admin | Delete a room from inventory |
| `PUT` | `/api/rooms/{id}/status` | Staff/Admin | Update live room status (`AVAILABLE`, `OCCUPIED`, `CLEANING`) |
| `GET` | `/api/bookings` | Staff/Admin | Retrieve all reservations sorted by newest |
| `POST` | `/api/bookings` | Public | Submit a new customer booking request |
| `PUT` | `/api/bookings/{id}/approve` | Staff/Admin | Confirm booking, assign guest to room, and send approval email |
| `PUT` | `/api/bookings/{id}/reject` | Staff/Admin | Reject booking with explanation reason sent to customer |
| `DELETE` | `/api/bookings/{id}` | Public/Staff | Cancel reservation and release assigned room |
| `GET` | `/api/hotel-info` | Public | Fetch hotel information, contact details, and policies |
| `PUT` | `/api/hotel-info` | Admin | Update hotel information and customized policies |
| `POST` | `/api/hotel-info/reset` | Admin | Reset hotel profile to initial defaults |
| `POST` | `/api/auth/login` | Public | Local authentication for Admin, Staff, or Customer |
| `POST` | `/api/auth/google` | Public | 1-Click Google OAuth authentication |
| `GET` | `/api/auth/staff` | Admin | Retrieve staff roster and account privileges |
| `POST` | `/api/auth/staff` | Admin | Create new staff or administrative credentials |
| `DELETE` | `/api/auth/staff/{id}` | Admin | Remove staff member access |
