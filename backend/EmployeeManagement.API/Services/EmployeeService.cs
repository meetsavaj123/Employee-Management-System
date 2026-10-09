using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeDbContext _context;

        public EmployeeService(EmployeeDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<EmployeeResponseDto>> GetEmployeesAsync(EmployeeQueryDto query)
        {
            var q = _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .AsQueryable();

            // Search filter (Code, Name, Email, Mobile, City)
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.Trim().ToLower();
                q = q.Where(e =>
                    e.EmployeeCode.ToLower().Contains(s) ||
                    e.FirstName.ToLower().Contains(s) ||
                    e.LastName.ToLower().Contains(s) ||
                    (e.FirstName + " " + e.LastName).ToLower().Contains(s) ||
                    e.Email.ToLower().Contains(s) ||
                    e.Mobile.ToLower().Contains(s) ||
                    e.City.ToLower().Contains(s)
                );
            }

            // Department filter
            if (query.DepartmentId.HasValue && query.DepartmentId.Value > 0)
            {
                q = q.Where(e => e.DepartmentId == query.DepartmentId.Value);
            }

            // Status filter
            if (!string.IsNullOrWhiteSpace(query.Status))
            {
                var status = query.Status.Trim();
                q = q.Where(e => e.Status.ToLower() == status.ToLower());
            }

            // Total count
            int totalCount = await q.CountAsync();

            // Sorting
            q = (query.SortBy?.ToLower()) switch
            {
                "name" or "firstname" => query.IsAscending ? q.OrderBy(e => e.FirstName) : q.OrderByDescending(e => e.FirstName),
                "code" or "employeecode" => query.IsAscending ? q.OrderBy(e => e.EmployeeCode) : q.OrderByDescending(e => e.EmployeeCode),
                "email" => query.IsAscending ? q.OrderBy(e => e.Email) : q.OrderByDescending(e => e.Email),
                "salary" => query.IsAscending ? q.OrderBy(e => e.Salary) : q.OrderByDescending(e => e.Salary),
                "joiningdate" => query.IsAscending ? q.OrderBy(e => e.JoiningDate) : q.OrderByDescending(e => e.JoiningDate),
                "department" => query.IsAscending ? q.OrderBy(e => e.Department!.DepartmentName) : q.OrderByDescending(e => e.Department!.DepartmentName),
                _ => query.IsAscending ? q.OrderBy(e => e.EmployeeId) : q.OrderByDescending(e => e.EmployeeId),
            };

            // Pagination
            int pageNumber = query.PageNumber < 1 ? 1 : query.PageNumber;
            int pageSize = query.PageSize < 1 ? 10 : query.PageSize;

            var items = await q
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(e => MapToDto(e))
                .ToListAsync();

            return new PagedResult<EmployeeResponseDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
        {
            var emp = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .FirstOrDefaultAsync(e => e.EmployeeId == id);

            return emp == null ? null : MapToDto(emp);
        }

        public async Task<EmployeeResponseDto?> GetByUserIdAsync(int userId)
        {
            var emp = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .FirstOrDefaultAsync(e => e.UserId == userId);

            return emp == null ? null : MapToDto(emp);
        }

        public async Task<EmployeeResponseDto> CreateAsync(EmployeeCreateDto dto)
        {
            if (dto.Salary < 0)
            {
                throw new ArgumentException("Salary cannot be negative.");
            }

            if (await _context.Employees.AnyAsync(e => e.Email.ToLower() == dto.Email.Trim().ToLower()))
            {
                throw new InvalidOperationException("Email address already exists.");
            }

            if (await _context.Employees.AnyAsync(e => e.Mobile.Trim() == dto.Mobile.Trim()))
            {
                throw new InvalidOperationException("Mobile number already exists.");
            }

            if (await _context.Employees.AnyAsync(e => e.EmployeeCode.ToLower() == dto.EmployeeCode.Trim().ToLower()))
            {
                throw new InvalidOperationException("Employee code already exists.");
            }

            var dept = await _context.Departments.FindAsync(dto.DepartmentId);
            if (dept == null) throw new ArgumentException("Selected department does not exist.");

            var desig = await _context.Designations.FindAsync(dto.DesignationId);
            if (desig == null) throw new ArgumentException("Selected designation does not exist.");

            var emp = new Employee
            {
                EmployeeCode = dto.EmployeeCode.Trim(),
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = dto.Email.Trim(),
                Mobile = dto.Mobile.Trim(),
                Gender = dto.Gender,
                DOB = dto.DOB,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                Country = dto.Country,
                DepartmentId = dto.DepartmentId,
                DesignationId = dto.DesignationId,
                Salary = dto.Salary,
                JoiningDate = dto.JoiningDate,
                Photo = dto.Photo,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status,
                CreatedDate = DateTime.UtcNow
            };

            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();

            // Re-fetch with navigation properties
            return (await GetByIdAsync(emp.EmployeeId))!;
        }

        public async Task<EmployeeResponseDto?> UpdateAsync(int id, EmployeeUpdateDto dto)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return null;

            if (dto.Salary < 0)
            {
                throw new ArgumentException("Salary cannot be negative.");
            }

            if (await _context.Employees.AnyAsync(e => e.EmployeeId != id && e.Email.ToLower() == dto.Email.Trim().ToLower()))
            {
                throw new InvalidOperationException("Email address already in use by another employee.");
            }

            if (await _context.Employees.AnyAsync(e => e.EmployeeId != id && e.Mobile.Trim() == dto.Mobile.Trim()))
            {
                throw new InvalidOperationException("Mobile number already in use by another employee.");
            }

            emp.FirstName = dto.FirstName.Trim();
            emp.LastName = dto.LastName.Trim();
            emp.Email = dto.Email.Trim();
            emp.Mobile = dto.Mobile.Trim();
            emp.Gender = dto.Gender;
            emp.DOB = dto.DOB;
            emp.Address = dto.Address;
            emp.City = dto.City;
            emp.State = dto.State;
            emp.Country = dto.Country;
            emp.DepartmentId = dto.DepartmentId;
            emp.DesignationId = dto.DesignationId;
            emp.Salary = dto.Salary;
            emp.JoiningDate = dto.JoiningDate;
            if (!string.IsNullOrEmpty(dto.Photo)) emp.Photo = dto.Photo;
            emp.Status = dto.Status;

            await _context.SaveChangesAsync();

            return (await GetByIdAsync(emp.EmployeeId))!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return false;

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            int totalEmployees = await _context.Employees.CountAsync();
            int activeEmployees = await _context.Employees.CountAsync(e => e.Status == "Active");
            int inactiveEmployees = await _context.Employees.CountAsync(e => e.Status == "Inactive");
            int totalDepartments = await _context.Departments.CountAsync();

            var recentEmployees = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .OrderByDescending(e => e.EmployeeId)
                .Take(5)
                .Select(e => MapToDto(e))
                .ToListAsync();

            return new DashboardStatsDto
            {
                TotalEmployees = totalEmployees,
                ActiveEmployees = activeEmployees,
                InactiveEmployees = inactiveEmployees,
                TotalDepartments = totalDepartments,
                RecentEmployees = recentEmployees
            };
        }

        private static EmployeeResponseDto MapToDto(Employee e)
        {
            return new EmployeeResponseDto
            {
                EmployeeId = e.EmployeeId,
                EmployeeCode = e.EmployeeCode,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Mobile = e.Mobile,
                Gender = e.Gender,
                DOB = e.DOB,
                Address = e.Address,
                City = e.City,
                State = e.State,
                Country = e.Country,
                DepartmentId = e.DepartmentId,
                DepartmentName = e.Department?.DepartmentName ?? string.Empty,
                DesignationId = e.DesignationId,
                DesignationName = e.Designation?.DesignationName ?? string.Empty,
                Salary = e.Salary,
                JoiningDate = e.JoiningDate,
                Photo = e.Photo,
                Status = e.Status,
                UserId = e.UserId,
                CreatedDate = e.CreatedDate
            };
        }
    }
}
