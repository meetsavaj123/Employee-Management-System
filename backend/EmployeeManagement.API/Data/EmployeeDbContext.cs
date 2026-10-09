using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Data
{
    public class EmployeeDbContext : DbContext
    {
        public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Designation> Designations { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Department constraints
            modelBuilder.Entity<Department>()
                .HasIndex(d => d.DepartmentName)
                .IsUnique();

            // Employee constraints
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeCode)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Mobile)
                .IsUnique();

            // Relationships
            modelBuilder.Entity<Designation>()
                .HasOne(d => d.Department)
                .WithMany(dept => dept.Designations)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(dept => dept.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Designation)
                .WithMany(desig => desig.Employees)
                .HasForeignKey(e => e.DesignationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Data
            var adminUser = new User
            {
                UserId = 1,
                Username = "admin",
                // BCrypt hash for "Password123!"
                PasswordHash = "$2a$11$N.K6c0UfD0lE5P0c1d2e3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9",
                Role = "Admin",
                CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            var empUser1 = new User
            {
                UserId = 2,
                Username = "john.doe",
                PasswordHash = "$2a$11$N.K6c0UfD0lE5P0c1d2e3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9",
                Role = "Employee",
                CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            var empUser2 = new User
            {
                UserId = 3,
                Username = "jane.smith",
                PasswordHash = "$2a$11$N.K6c0UfD0lE5P0c1d2e3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9",
                Role = "Employee",
                CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            modelBuilder.Entity<User>().HasData(adminUser, empUser1, empUser2);

            var dept1 = new Department { DepartmentId = 1, DepartmentName = "Information Technology", Description = "Software Engineering, DevOps, and Technical Support", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
            var dept2 = new Department { DepartmentId = 2, DepartmentName = "Human Resources", Description = "Talent Acquisition, Employee Relations, and Payroll", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
            var dept3 = new Department { DepartmentId = 3, DepartmentName = "Finance & Accounting", Description = "Financial Planning, Auditing, and Accounts Management", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

            modelBuilder.Entity<Department>().HasData(dept1, dept2, dept3);

            var desig1 = new Designation { DesignationId = 1, DesignationName = "Senior Software Engineer", DepartmentId = 1, Description = "Lead developer for enterprise applications", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
            var desig2 = new Designation { DesignationId = 2, DesignationName = "Frontend Developer", DepartmentId = 1, Description = "UI/UX specialist working with Angular", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
            var desig3 = new Designation { DesignationId = 3, DesignationName = "HR Manager", DepartmentId = 2, Description = "Oversees human resource operations", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

            modelBuilder.Entity<Designation>().HasData(desig1, desig2, desig3);

            var emp1 = new Employee
            {
                EmployeeId = 1,
                EmployeeCode = "EMP-1001",
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@company.com",
                Mobile = "+1555000111",
                Gender = "Male",
                DOB = new DateTime(1988, 4, 12, 0, 0, 0, DateTimeKind.Utc),
                Address = "100 Tech Blvd",
                City = "San Francisco",
                State = "CA",
                Country = "USA",
                DepartmentId = 1,
                DesignationId = 1,
                Salary = 120000.00m,
                JoiningDate = new DateTime(2020, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active",
                UserId = 1,
                CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            var emp2 = new Employee
            {
                EmployeeId = 2,
                EmployeeCode = "EMP-1002",
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@company.com",
                Mobile = "+1555000222",
                Gender = "Male",
                DOB = new DateTime(1992, 8, 24, 0, 0, 0, DateTimeKind.Utc),
                Address = "245 Innovation Way",
                City = "San Jose",
                State = "CA",
                Country = "USA",
                DepartmentId = 1,
                DesignationId = 2,
                Salary = 85000.00m,
                JoiningDate = new DateTime(2021, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active",
                UserId = 2,
                CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            var emp3 = new Employee
            {
                EmployeeId = 3,
                EmployeeCode = "EMP-1003",
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@company.com",
                Mobile = "+1555000333",
                Gender = "Female",
                DOB = new DateTime(1995, 3, 17, 0, 0, 0, DateTimeKind.Utc),
                Address = "789 Corporate Drive",
                City = "Austin",
                State = "TX",
                Country = "USA",
                DepartmentId = 2,
                DesignationId = 3,
                Salary = 92000.00m,
                JoiningDate = new DateTime(2022, 3, 10, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active",
                UserId = 3,
                CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            modelBuilder.Entity<Employee>().HasData(emp1, emp2, emp3);
        }
    }
}
