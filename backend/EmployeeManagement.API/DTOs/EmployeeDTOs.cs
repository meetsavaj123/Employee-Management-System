using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.DTOs
{
    public class EmployeeCreateDto
    {
        [Required(ErrorMessage = "Employee code is required.")]
        public string EmployeeCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mobile number is required.")]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = "Male";

        [Required]
        public DateTime DOB { get; set; }

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string State { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department is required.")]
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "Designation is required.")]
        public int DesignationId { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Salary cannot be negative.")]
        public decimal Salary { get; set; }

        [Required]
        public DateTime JoiningDate { get; set; }

        public string? Photo { get; set; }

        public string Status { get; set; } = "Active";
    }

    public class EmployeeUpdateDto : EmployeeCreateDto
    {
    }

    public class EmployeeResponseDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string Email { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime JoiningDate { get; set; }
        public string? Photo { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class EmployeeQueryDto
    {
        public string? Search { get; set; }
        public int? DepartmentId { get; set; }
        public string? Status { get; set; }
        public string? SortBy { get; set; } = "EmployeeId";
        public bool IsAscending { get; set; } = true;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class DashboardStatsDto
    {
        public int TotalEmployees { get; set; }
        public int ActiveEmployees { get; set; }
        public int InactiveEmployees { get; set; }
        public int TotalDepartments { get; set; }
        public List<EmployeeResponseDto> RecentEmployees { get; set; } = new List<EmployeeResponseDto>();
    }
}
