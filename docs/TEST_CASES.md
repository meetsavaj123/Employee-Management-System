# Test Cases Specification

This document details the software test cases covering Authentication, Departments, Designations, Employees, Validation, and Authorization.

| Test Case ID | Module | Title | Steps | Expected Result | Status |
|---|---|---|---|---|---|
| **TC-AUTH-01** | Auth | Successful Admin Login | 1. Enter `admin` / `Password123!` <br> 2. Click Login | Returns 200 OK with valid JWT token. Redirects to `/dashboard`. | ✅ PASS |
| **TC-AUTH-02** | Auth | Invalid Credentials Login | 1. Enter `admin` / `WrongPass` <br> 2. Click Login | Returns 401 Unauthorized with "Invalid username or password" message. | ✅ PASS |
| **TC-AUTH-03** | Auth | Password Change Match | 1. Navigate to `/change-password` <br> 2. Enter current & new matching pass | Password updated in DB. Returns 200 OK message. | ✅ PASS |
| **TC-DEPT-01** | Dept | Create Valid Department | 1. Enter "Research & Dev" <br> 2. Submit form | Department created. Listed in table. | ✅ PASS |
| **TC-DEPT-02** | Dept | Duplicate Department Name Validation | 1. Enter existing department "Information Technology" | Returns 400 Bad Request: "Duplicate department names are not allowed." | ✅ PASS |
| **TC-EMP-01** | Employee | Negative Salary Validation | 1. Enter salary `-500` in Add Employee form | Client and API validation error: "Salary cannot be negative." | ✅ PASS |
| **TC-EMP-02** | Employee | Duplicate Email Validation | 1. Enter existing email `john.doe@company.com` | Returns 400 Bad Request: "Email address already exists." | ✅ PASS |
| **TC-EMP-03** | Employee | Search & Pagination | 1. Type "San Francisco" in search box | Filters table in real-time. Correct total count and paginator calculated. | ✅ PASS |
| **TC-EMP-04** | Employee | Role Guard Enforcement | 1. Log in as Employee role (`john.doe`) <br> 2. Navigate to `/departments` | Route guard blocks access and redirects to `/dashboard` with error toast. | ✅ PASS |
