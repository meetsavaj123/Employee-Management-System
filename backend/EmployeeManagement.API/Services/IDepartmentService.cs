using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentResponseDto>> GetAllAsync();
        Task<DepartmentResponseDto?> GetByIdAsync(int id);
        Task<DepartmentResponseDto> CreateAsync(DepartmentCreateDto dto);
        Task<DepartmentResponseDto?> UpdateAsync(int id, DepartmentUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
