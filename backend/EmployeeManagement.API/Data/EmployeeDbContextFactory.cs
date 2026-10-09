using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace EmployeeManagement.API.Data
{
    public class EmployeeDbContextFactory : IDesignTimeDbContextFactory<EmployeeDbContext>
    {
        public EmployeeDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<EmployeeDbContext>();
            optionsBuilder.UseNpgsql("Host=localhost;Database=EmployeeDb;Username=postgres;Password=postgres");

            return new EmployeeDbContext(optionsBuilder.Options);
        }
    }
}
