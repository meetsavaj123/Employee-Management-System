# Software Requirements Specification (SRS) - Employee Management System

## 1. Introduction

### 1.1 Purpose
This document provides a comprehensive Software Requirements Specification (SRS) for the **Employee Management System (EMS)** built using **ASP.NET Core 8 Web API**, **Angular 18**, and **PostgreSQL**.

### 1.2 Scope
The Employee Management System automates personnel records management, department assignment, designation mapping, role-based access control (Admin & Employee roles), profile management, and workforce analytics reporting.

### 1.3 Definitions & Abbreviations
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **EF Core**: Entity Framework Core
- **DTO**: Data Transfer Object
- **CRUD**: Create, Read, Update, Delete

---

## 2. Overall Description

### 2.1 Product Perspective
The system operates as a client-server architecture:
- **Frontend Layer**: Single Page Application (SPA) developed in Angular 18 with reactive forms, HTTP interceptors, and custom glassmorphism styling.
- **Backend API Layer**: RESTful API developed in ASP.NET Core 8 with Clean Architecture, dependency injection, and Swagger documentation.
- **Database Layer**: PostgreSQL database managed via Entity Framework Core ORM.

### 2.2 User Roles & Permissions
1. **Administrator (Admin)**:
   - Full CRUD control over Employees, Departments, and Designations.
   - Access to real-time executive dashboard metrics.
   - User account creation and role assignment.
2. **Employee**:
   - Access to view executive metrics and search employee directory.
   - View and update personal profile information.
   - Change account security password.

---

## 3. Functional Requirements

### 3.1 Authentication & Security (AUTH-01)
- **AUTH-01.1**: The system shall authenticate users using username and password.
- **AUTH-01.2**: Passwords shall be hashed using BCrypt hashing algorithm prior to storage.
- **AUTH-01.3**: Upon successful login, the system shall issue a JWT Bearer Token valid for 24 hours.
- **AUTH-01.4**: All API endpoints except `/api/auth/login` shall enforce JWT token authorization.

### 3.2 Executive Dashboard (DASH-01)
- **DASH-01.1**: Display total employee count, active count, inactive count, and department total.
- **DASH-01.2**: Display top 5 recently added employees with quick details link.

### 3.3 Department Management (DEPT-01)
- **DEPT-01.1**: Admin can create, read, update, and delete departments.
- **DEPT-01.2**: Department names must be non-empty and unique.
- **DEPT-01.3**: Cannot delete a department with active assigned employees.

### 3.4 Designation Management (DESIG-01)
- **DESIG-01.1**: Admin can manage designations associated with specific departments.
- **DESIG-01.2**: Designation names must be non-empty.

### 3.5 Employee Management (EMP-01)
- **EMP-01.1**: Admin can create new employee records with fields: Code, First Name, Last Name, Email, Mobile, Gender, DOB, Address, City, State, Country, Department, Designation, Salary, Joining Date, Photo, Status.
- **EMP-01.2**: Emails and Mobile numbers must be strictly unique across the system.
- **EMP-01.3**: Salary must be non-negative ($\ge 0$).
- **EMP-01.4**: System shall support profile image upload (JPG, PNG, WebP).
- **EMP-01.5**: Employee table shall support instant searching, department filtering, status filtering, sorting, and pagination.

---

## 4. Non-Functional Requirements

### 4.1 Performance & Scalability
- Page load time < 1.5 seconds under standard broadband connection.
- Database queries optimized with foreign key indexes (`IX_Employees_DepartmentId`, `IX_Employees_Email`).

### 4.2 Security
- Claims-based authorization (`[Authorize(Roles = "Admin")]`).
- CORS policy configured for origin safety.
- Input validation on both client (Angular Reactive Forms) and server (Data Annotations & Service Validation).

### 4.3 Maintainability & Code Quality
- Clean Architecture separation (`Controllers`, `Services`, `DTOs`, `Models`, `Data`).
- Swagger / OpenAPI live API specification.
