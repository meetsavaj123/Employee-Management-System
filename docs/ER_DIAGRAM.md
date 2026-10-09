# Entity-Relationship (ER) Diagram

This document contains the Entity-Relationship (ER) Diagram for the **Employee Management System** using Mermaid notation.

```mermaid
erDiagram
    USERS ||--o| EMPLOYEES : "associated with"
    DEPARTMENTS ||--o{ DESIGNATIONS : "contains"
    DEPARTMENTS ||--o{ EMPLOYEES : "employs"
    DESIGNATIONS ||--o{ EMPLOYEES : "assigns"

    USERS {
        int UserId PK
        string Username UK
        string PasswordHash
        string Role
        datetime CreatedDate
    }

    DEPARTMENTS {
        int DepartmentId PK
        string DepartmentName UK
        string Description
        datetime CreatedDate
    }

    DESIGNATIONS {
        int DesignationId PK
        int DepartmentId FK
        string DesignationName
        string Description
        datetime CreatedDate
    }

    EMPLOYEES {
        int EmployeeId PK
        string EmployeeCode UK
        string FirstName
        string LastName
        string Email UK
        string Mobile UK
        string Gender
        date DOB
        string Address
        string City
        string State
        string Country
        int DepartmentId FK
        int DesignationId FK
        decimal Salary
        date JoiningDate
        string Photo
        string Status
        int UserId FK, UK
        datetime CreatedDate
    }
```

## Entity Descriptions

1. **USERS**: Stores authentication credentials, hashed passwords (BCrypt), and role-based permissions (`Admin`, `Employee`).
2. **DEPARTMENTS**: Defines organizational departments (e.g., Information Technology, HR, Finance) with unique name constraints.
3. **DESIGNATIONS**: Defines job titles linked to specific departments (e.g., Senior Software Engineer in IT).
4. **EMPLOYEES**: Primary operational entity containing employee biographical data, contact info, salary, status, department/designation foreign keys, and optionally linked user login credentials.
