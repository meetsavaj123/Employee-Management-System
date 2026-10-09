using System.Security.Claims;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IWebHostEnvironment _env;

        public EmployeesController(IEmployeeService employeeService, IWebHostEnvironment env)
        {
            _employeeService = employeeService;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployees([FromQuery] EmployeeQueryDto query)
        {
            var result = await _employeeService.GetEmployeesAsync(query);
            return Ok(result);
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _employeeService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("profile/me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var emp = await _employeeService.GetByUserIdAsync(userId);
            if (emp == null)
            {
                // Fallback to first employee or default for admin/demo user
                var paged = await _employeeService.GetEmployeesAsync(new EmployeeQueryDto { PageSize = 1 });
                emp = paged.Items.FirstOrDefault();
                if (emp == null) return NotFound(new { message = "Employee profile not found." });
            }

            return Ok(emp);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var emp = await _employeeService.GetByIdAsync(id);
            if (emp == null) return NotFound(new { message = $"Employee with ID {id} not found." });
            return Ok(emp);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _employeeService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.EmployeeId }, created);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Allow employee to update their own profile or Admin to update any
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (roleClaim != "Admin")
            {
                if (int.TryParse(userIdClaim, out int userId))
                {
                    var myEmp = await _employeeService.GetByUserIdAsync(userId);
                    if (myEmp != null && myEmp.EmployeeId != id)
                    {
                        return Forbid();
                    }
                }
            }

            try
            {
                var updated = await _employeeService.UpdateAsync(id, dto);
                if (updated == null) return NotFound(new { message = $"Employee with ID {id} not found." });
                return Ok(updated);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deleted = await _employeeService.DeleteAsync(id);
            if (!deleted) return NotFound(new { message = $"Employee with ID {id} not found." });
            return Ok(new { message = "Employee deleted successfully." });
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and WebP images are allowed." });
            }

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"photo_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photoUrl = $"/uploads/{fileName}";
            return Ok(new { photoUrl });
        }
    }
}
