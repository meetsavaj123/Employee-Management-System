using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly EmployeeDbContext _context;

        public DepartmentService(EmployeeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartmentResponseDto>> GetAllAsync()
        {
            return await _context.Departments
                .Include(d => d.Employees)
                .Select(d => new DepartmentResponseDto
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    Description = d.Description,
                    CreatedDate = d.CreatedDate,
                    EmployeeCount = d.Employees.Count
                })
                .ToListAsync();
        }

        public async Task<DepartmentResponseDto?> GetByIdAsync(int id)
        {
            var d = await _context.Departments
                .Include(dept => dept.Employees)
                .FirstOrDefaultAsync(dept => dept.DepartmentId == id);

            if (d == null) return null;

            return new DepartmentResponseDto
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                Description = d.Description,
                CreatedDate = d.CreatedDate,
                EmployeeCount = d.Employees.Count
            };
        }

        public async Task<DepartmentResponseDto> CreateAsync(DepartmentCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DepartmentName))
            {
                throw new ArgumentException("Department name cannot be empty.");
            }

            if (await _context.Departments.AnyAsync(d => d.DepartmentName.ToLower() == dto.DepartmentName.Trim().ToLower()))
            {
                throw new InvalidOperationException("Duplicate department names are not allowed.");
            }

            var dept = new Department
            {
                DepartmentName = dto.DepartmentName.Trim(),
                Description = dto.Description,
                CreatedDate = DateTime.UtcNow
            };

            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();

            return new DepartmentResponseDto
            {
                DepartmentId = dept.DepartmentId,
                DepartmentName = dept.DepartmentName,
                Description = dept.Description,
                CreatedDate = dept.CreatedDate,
                EmployeeCount = 0
            };
        }

        public async Task<DepartmentResponseDto?> UpdateAsync(int id, DepartmentUpdateDto dto)
        {
            var dept = await _context.Departments
                .Include(d => d.Employees)
                .FirstOrDefaultAsync(d => d.DepartmentId == id);

            if (dept == null) return null;

            if (string.IsNullOrWhiteSpace(dto.DepartmentName))
            {
                throw new ArgumentException("Department name cannot be empty.");
            }

            if (await _context.Departments.AnyAsync(d => d.DepartmentId != id && d.DepartmentName.ToLower() == dto.DepartmentName.Trim().ToLower()))
            {
                throw new InvalidOperationException("Duplicate department names are not allowed.");
            }

            dept.DepartmentName = dto.DepartmentName.Trim();
            dept.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new DepartmentResponseDto
            {
                DepartmentId = dept.DepartmentId,
                DepartmentName = dept.DepartmentName,
                Description = dept.Description,
                CreatedDate = dept.CreatedDate,
                EmployeeCount = dept.Employees.Count
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;

            var hasEmployees = await _context.Employees.AnyAsync(e => e.DepartmentId == id);
            if (hasEmployees)
            {
                throw new InvalidOperationException("Cannot delete department because active employees are assigned to it.");
            }

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
