using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IDesignationService
    {
        Task<IEnumerable<DesignationResponseDto>> GetAllAsync(int? departmentId = null);
        Task<DesignationResponseDto?> GetByIdAsync(int id);
        Task<DesignationResponseDto> CreateAsync(DesignationCreateDto dto);
        Task<DesignationResponseDto?> UpdateAsync(int id, DesignationUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
