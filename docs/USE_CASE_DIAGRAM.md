# Use Case Diagram

This document illustrates the actor interactions and system use cases for the **Employee Management System**.

```mermaid
graph TD
    subgraph System Boundary: Employee Management System
        UC1[Login & Authenticate]
        UC2[View Dashboard Statistics]
        UC3[Manage Employees - CRUD]
        UC4[Search & Filter Employees]
        UC5[Upload Profile Photo]
        UC6[Manage Departments - CRUD]
        UC7[Manage Designations - CRUD]
        UC8[View My Profile]
        UC9[Update Profile Details]
        UC10[Change Account Password]
        UC11[Logout]
    end

    Admin((👑 Admin))
    Employee((👤 Employee))

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11

    Employee --> UC1
    Employee --> UC2
    Employee --> UC4
    Employee --> UC8
    Employee --> UC9
    Employee --> UC10
    Employee --> UC11
```

## Actor Summary

- **Admin**: Has full administrative privileges across all modules including department management, designation mapping, employee creation/editing/deletion, and overall system reporting.
- **Employee**: Authenticated user with restricted access to view executive dashboard metrics, search/filter directory records, manage personal profile details, and update security password.
