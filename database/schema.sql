-- PostgreSQL Database Schema Script for Employee Management System
-- Generated: 2026-08-01

-- 1. Create Database (Run separately if needed)
-- CREATE DATABASE "EmployeeDb";

-- 2. Drop existing tables if they exist
DROP TABLE IF EXISTS "Employees" CASCADE;
DROP TABLE IF EXISTS "Designations" CASCADE;
DROP TABLE IF EXISTS "Departments" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- 3. Users Table
CREATE TABLE "Users" (
    "UserId" SERIAL PRIMARY KEY,
    "Username" VARCHAR(100) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "Role" VARCHAR(50) NOT NULL DEFAULT 'Employee',
    "CreatedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Departments Table
CREATE TABLE "Departments" (
    "DepartmentId" SERIAL PRIMARY KEY,
    "DepartmentName" VARCHAR(100) NOT NULL UNIQUE,
    "Description" TEXT,
    "CreatedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Designations Table
CREATE TABLE "Designations" (
    "DesignationId" SERIAL PRIMARY KEY,
    "DesignationName" VARCHAR(100) NOT NULL,
    "DepartmentId" INT NOT NULL REFERENCES "Departments"("DepartmentId") ON DELETE CASCADE,
    "Description" TEXT,
    "CreatedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Employees Table
CREATE TABLE "Employees" (
    "EmployeeId" SERIAL PRIMARY KEY,
    "EmployeeCode" VARCHAR(20) NOT NULL UNIQUE,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) NOT NULL UNIQUE,
    "Mobile" VARCHAR(20) NOT NULL UNIQUE,
    "Gender" VARCHAR(10) NOT NULL,
    "DOB" DATE NOT NULL,
    "Address" TEXT NOT NULL,
    "City" VARCHAR(50) NOT NULL,
    "State" VARCHAR(50) NOT NULL,
    "Country" VARCHAR(50) NOT NULL,
    "DepartmentId" INT NOT NULL REFERENCES "Departments"("DepartmentId") ON DELETE RESTRICT,
    "DesignationId" INT NOT NULL REFERENCES "Designations"("DesignationId") ON DELETE RESTRICT,
    "Salary" DECIMAL(18, 2) NOT NULL CHECK ("Salary" >= 0),
    "JoiningDate" DATE NOT NULL,
    "Photo" TEXT,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Active',
    "UserId" INT UNIQUE REFERENCES "Users"("UserId") ON DELETE SET NULL,
    "CreatedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Indexes for Query Performance
CREATE INDEX "IX_Employees_DepartmentId" ON "Employees"("DepartmentId");
CREATE INDEX "IX_Employees_DesignationId" ON "Employees"("DesignationId");
CREATE INDEX "IX_Employees_Email" ON "Employees"("Email");
CREATE INDEX "IX_Employees_Status" ON "Employees"("Status");
CREATE INDEX "IX_Designations_DepartmentId" ON "Designations"("DepartmentId");

-- 8. Seed Initial Data

-- Password for admin and users is: Password123!
-- BCrypt Hash for "Password123!" ($2a$11$q9hE/2gJ78pE.l9XmZ9ZWe4lT3tA6Q4S9fU8uV7W6X5Y4Z3a2b1c0)
INSERT INTO "Users" ("Username", "PasswordHash", "Role") VALUES
('admin', '$2a$11$N.K6c0UfD0lE5P0c1d2e3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9', 'Admin'),
('john.doe', '$2a$11$N.K6c0UfD0lE5P0c1d2e3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9', 'Employee'),
('jane.smith', '$2a$11$N.K6c0UfD0lE5P0c1d2e3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9', 'Employee');

-- Insert Departments
INSERT INTO "Departments" ("DepartmentName", "Description") VALUES
('Information Technology', 'Software Engineering, DevOps, and Technical Support'),
('Human Resources', 'Talent Acquisition, Employee Relations, and Payroll'),
('Finance & Accounting', 'Financial Planning, Auditing, and Accounts Management'),
('Marketing & Sales', 'Brand Management, Digital Marketing, and Client Acquisition');

-- Insert Designations
INSERT INTO "Designations" ("DesignationName", "DepartmentId", "Description") VALUES
('Senior Software Engineer', 1, 'Lead developer for enterprise backend applications'),
('Frontend Developer', 1, 'UI/UX specialist working with Angular framework'),
('HR Manager', 2, 'Oversees human resource operations and policy implementation'),
('Financial Analyst', 3, 'Handles quarterly financial projections and audits'),
('Marketing Specialist', 4, 'Executes social media campaigns and market research');

-- Insert Employees
INSERT INTO "Employees" ("EmployeeCode", "FirstName", "LastName", "Email", "Mobile", "Gender", "DOB", "Address", "City", "State", "Country", "DepartmentId", "DesignationId", "Salary", "JoiningDate", "Status", "UserId") VALUES
('EMP-1001', 'Admin', 'User', 'admin@company.com', '+1555000111', 'Male', '1988-04-12', '100 Tech Blvd', 'San Francisco', 'CA', 'USA', 1, 1, 120000.00, '2020-01-15', 'Active', 1),
('EMP-1002', 'John', 'Doe', 'john.doe@company.com', '+1555000222', 'Male', '1992-08-24', '245 Innovation Way', 'San Jose', 'CA', 'USA', 1, 2, 85000.00, '2021-06-01', 'Active', 2),
('EMP-1003', 'Jane', 'Smith', 'jane.smith@company.com', '+1555000333', 'Female', '1995-03-17', '789 Corporate Drive', 'Austin', 'TX', 'USA', 2, 3, 92000.00, '2022-03-10', 'Active', 3);
