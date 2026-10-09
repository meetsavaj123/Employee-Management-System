using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.DTOs
{
    public class DesignationCreateDto
    {
        [Required(ErrorMessage = "Designation name cannot be empty.")]
        [MaxLength(100)]
        public string DesignationName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department is required.")]
        public int DepartmentId { get; set; }

        public string? Description { get; set; }
    }

    public class DesignationUpdateDto
    {
        [Required(ErrorMessage = "Designation name cannot be empty.")]
        [MaxLength(100)]
        public string DesignationName { get; set; } = string.Empty;

        [Required]
        public int DepartmentId { get; set; }

        public string? Description { get; set; }
    }

    public class DesignationResponseDto
    {
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
