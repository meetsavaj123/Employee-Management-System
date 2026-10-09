using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.API.Models
{
    public class Department
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "Department name is required.")]
        [MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Designation> Designations { get; set; } = new List<Designation>();
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
