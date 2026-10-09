using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IEmployeeService
    {
        Task<PagedResult<EmployeeResponseDto>> GetEmployeesAsync(EmployeeQueryDto query);
        Task<EmployeeResponseDto?> GetByIdAsync(int id);
        Task<EmployeeResponseDto?> GetByUserIdAsync(int userId);
        Task<EmployeeResponseDto> CreateAsync(EmployeeCreateDto dto);
        Task<EmployeeResponseDto?> UpdateAsync(int id, EmployeeUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}
