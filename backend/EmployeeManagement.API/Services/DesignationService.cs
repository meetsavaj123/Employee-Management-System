using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Services
{
    public class DesignationService : IDesignationService
    {
        private readonly EmployeeDbContext _context;

        public DesignationService(EmployeeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DesignationResponseDto>> GetAllAsync(int? departmentId = null)
        {
            var query = _context.Designations.Include(d => d.Department).AsQueryable();

            if (departmentId.HasValue)
            {
                query = query.Where(d => d.DepartmentId == departmentId.Value);
            }

            return await query
                .Select(d => new DesignationResponseDto
                {
                    DesignationId = d.DesignationId,
                    DesignationName = d.DesignationName,
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.Department != null ? d.Department.DepartmentName : string.Empty,
                    Description = d.Description,
                    CreatedDate = d.CreatedDate
                })
                .ToListAsync();
        }

        public async Task<DesignationResponseDto?> GetByIdAsync(int id)
        {
            var d = await _context.Designations
                .Include(desig => desig.Department)
                .FirstOrDefaultAsync(desig => desig.DesignationId == id);

            if (d == null) return null;

            return new DesignationResponseDto
            {
                DesignationId = d.DesignationId,
                DesignationName = d.DesignationName,
                DepartmentId = d.DepartmentId,
                DepartmentName = d.Department != null ? d.Department.DepartmentName : string.Empty,
                Description = d.Description,
                CreatedDate = d.CreatedDate
            };
        }

        public async Task<DesignationResponseDto> CreateAsync(DesignationCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DesignationName))
            {
                throw new ArgumentException("Designation name cannot be empty.");
            }

            var dept = await _context.Departments.FindAsync(dto.DepartmentId);
            if (dept == null)
            {
                throw new ArgumentException("Specified department does not exist.");
            }

            var desig = new Designation
            {
                DesignationName = dto.DesignationName.Trim(),
                DepartmentId = dto.DepartmentId,
                Description = dto.Description,
                CreatedDate = DateTime.UtcNow
            };

            _context.Designations.Add(desig);
            await _context.SaveChangesAsync();

            return new DesignationResponseDto
            {
                DesignationId = desig.DesignationId,
                DesignationName = desig.DesignationName,
                DepartmentId = desig.DepartmentId,
                DepartmentName = dept.DepartmentName,
                Description = desig.Description,
                CreatedDate = desig.CreatedDate
            };
        }

        public async Task<DesignationResponseDto?> UpdateAsync(int id, DesignationUpdateDto dto)
        {
            var desig = await _context.Designations.FindAsync(id);
            if (desig == null) return null;

            if (string.IsNullOrWhiteSpace(dto.DesignationName))
            {
                throw new ArgumentException("Designation name cannot be empty.");
            }

            var dept = await _context.Departments.FindAsync(dto.DepartmentId);
            if (dept == null)
            {
                throw new ArgumentException("Specified department does not exist.");
            }

            desig.DesignationName = dto.DesignationName.Trim();
            desig.DepartmentId = dto.DepartmentId;
            desig.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new DesignationResponseDto
            {
                DesignationId = desig.DesignationId,
                DesignationName = desig.DesignationName,
                DepartmentId = desig.DepartmentId,
                DepartmentName = dept.DepartmentName,
                Description = desig.Description,
                CreatedDate = desig.CreatedDate
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var desig = await _context.Designations.FindAsync(id);
            if (desig == null) return false;

            var hasEmployees = await _context.Employees.AnyAsync(e => e.DesignationId == id);
            if (hasEmployees)
            {
                throw new InvalidOperationException("Cannot delete designation because active employees are assigned to it.");
            }

            _context.Designations.Remove(desig);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
