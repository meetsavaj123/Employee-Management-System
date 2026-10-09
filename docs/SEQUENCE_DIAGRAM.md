# Sequence Diagram

This document illustrates the sequence of operations during JWT Authentication and Employee Creation.

## Sequence 1: JWT Authentication & Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Admin
    participant UI as Angular 18 Frontend
    participant API as AuthController
    participant Service as AuthService
    participant DB as PostgreSQL / EF Core

    User->>UI: Input Username & Password
    UI->>API: POST /api/auth/login
    API->>Service: LoginAsync(LoginDto)
    Service->>DB: FirstOrDefaultAsync(Username)
    DB-->>Service: User Entity & PasswordHash
    Service->>Service: Verify BCrypt Hash & Claims
    Service->>Service: Generate JWT Security Token
    Service-->>API: AuthResponseDto (Token, Role, UserId)
    API-->>UI: 200 OK (JWT Token)
    UI->>UI: Store Token in LocalStorage
    UI-->>User: Navigate to /dashboard
```

## Sequence 2: Employee Creation Flow (Admin)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin User
    participant UI as Angular 18 Frontend
    participant Interceptor as JwtInterceptor
    participant API as EmployeesController
    participant Service as EmployeeService
    participant DB as PostgreSQL / EF Core

    Admin->>UI: Fill Form & Click "Save Employee"
    UI->>Interceptor: Intercept Request
    Interceptor->>Interceptor: Inject Bearer JWT Token
    Interceptor->>API: POST /api/employees (Bearer Token)
    API->>API: Validate [Authorize(Roles = "Admin")]
    API->>Service: CreateAsync(EmployeeCreateDto)
    Service->>DB: Check Unique Email & Mobile
    DB-->>Service: Unique Constraints Passed
    Service->>DB: Save Employee Record
    DB-->>Service: Saved Entity with Generated EmployeeId
    Service-->>API: EmployeeResponseDto
    API-->>UI: 201 Created
    UI->>UI: Display Toast Notification
    UI-->>Admin: Redirect to /employees Directory
```
