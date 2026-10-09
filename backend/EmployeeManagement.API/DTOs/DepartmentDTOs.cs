using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.DTOs
{
    public class DepartmentCreateDto
    {
        [Required(ErrorMessage = "Department name cannot be empty.")]
        [MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;

        public string? Description { get; set; }
    }

    public class DepartmentUpdateDto
    {
        [Required(ErrorMessage = "Department name cannot be empty.")]
        [MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;

        public string? Description { get; set; }
    }

    public class DepartmentResponseDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public int EmployeeCount { get; set; }
    }
}
