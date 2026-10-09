using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}
