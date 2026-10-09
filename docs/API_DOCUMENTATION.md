# API Documentation - Employee Management System

## Base URL
`http://localhost:5280/api`

---

## Authentication Endpoints

### 1. User Login
- **URL**: `POST /auth/login`
- **Auth**: None
- **Request Body**:
```json
{
  "username": "admin",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "userId": 1,
  "username": "admin",
  "role": "Admin",
  "employeeId": 1
}
```

### 2. User Registration
- **URL**: `POST /auth/register`
- **Auth**: None
- **Request Body**:
```json
{
  "username": "new.user",
  "password": "Password123!",
  "role": "Employee"
}
```

### 3. Change Password
- **URL**: `POST /auth/change-password`
- **Auth**: Bearer JWT
- **Request Body**:
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

---

## Department Endpoints

### 1. Get All Departments
- **URL**: `GET /departments`
- **Auth**: Bearer JWT

### 2. Create Department
- **URL**: `POST /departments`
- **Auth**: Bearer JWT (Admin)
- **Request Body**:
```json
{
  "departmentName": "Quality Assurance",
  "description": "Software testing and quality compliance"
}
```

### 3. Update Department
- **URL**: `PUT /departments/{id}`
- **Auth**: Bearer JWT (Admin)

### 4. Delete Department
- **URL**: `DELETE /departments/{id}`
- **Auth**: Bearer JWT (Admin)

---

## Designation Endpoints

### 1. Get Designations
- **URL**: `GET /designations?departmentId=1`
- **Auth**: Bearer JWT

### 2. Create Designation
- **URL**: `POST /designations`
- **Auth**: Bearer JWT (Admin)

---

## Employee Endpoints

### 1. Get Employees (Paged, Filtered, Sorted)
- **URL**: `GET /employees?search=john&departmentId=1&status=Active&sortBy=Salary&isAscending=false&pageNumber=1&pageSize=10`
- **Auth**: Bearer JWT

### 2. Get Executive Dashboard Stats
- **URL**: `GET /employees/dashboard`
- **Auth**: Bearer JWT

### 3. Create Employee
- **URL**: `POST /employees`
- **Auth**: Bearer JWT (Admin)

### 4. Upload Profile Image
- **URL**: `POST /employees/upload-photo`
- **Auth**: Bearer JWT
- **Content-Type**: `multipart/form-data`
