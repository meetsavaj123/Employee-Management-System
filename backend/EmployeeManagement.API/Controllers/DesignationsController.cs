using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DesignationsController : ControllerBase
    {
        private readonly IDesignationService _designationService;

        public DesignationsController(IDesignationService designationService)
        {
            _designationService = designationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? departmentId)
        {
            var list = await _designationService.GetAllAsync(departmentId);
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _designationService.GetByIdAsync(id);
            if (item == null) return NotFound(new { message = $"Designation with ID {id} not found." });
            return Ok(item);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DesignationCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _designationService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.DesignationId }, created);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DesignationUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var updated = await _designationService.UpdateAsync(id, dto);
                if (updated == null) return NotFound(new { message = $"Designation with ID {id} not found." });
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
            try
            {
                bool deleted = await _designationService.DeleteAsync(id);
                if (!deleted) return NotFound(new { message = $"Designation with ID {id} not found." });
                return Ok(new { message = "Designation deleted successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
