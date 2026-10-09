import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Dashboard</h1>
          <p class="page-subtitle">Real-time workforce summary & activity insights</p>
        </div>
        <div class="quick-actions" *ngIf="isAdmin">
          <a routerLink="/employees/add" class="btn btn-primary">
            <span>+ Add Employee</span>
          </a>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card glass-card">
          <div class="stat-icon bg-indigo">👥</div>
          <div class="stat-info">
            <span class="stat-label">Total Employees</span>
            <h3 class="stat-value">{{ stats?.totalEmployees || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon bg-emerald">✅</div>
          <div class="stat-info">
            <span class="stat-label">Active Staff</span>
            <h3 class="stat-value text-emerald">{{ stats?.activeEmployees || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon bg-rose">⚠️</div>
          <div class="stat-info">
            <span class="stat-label">Inactive Staff</span>
            <h3 class="stat-value text-rose">{{ stats?.inactiveEmployees || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon bg-amber">🏢</div>
          <div class="stat-info">
            <span class="stat-label">Departments</span>
            <h3 class="stat-value text-amber">{{ stats?.totalDepartments || 0 }}</h3>
          </div>
        </div>
      </div>

      <!-- Recent Employees Section -->
      <div class="content-section glass-card">
        <div class="section-header">
          <h3>Recently Added Employees</h3>
          <a routerLink="/employees" class="view-all-link">View All Employees ➔</a>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of stats?.recentEmployees">
                <td><span class="code-badge">{{ emp.employeeCode }}</span></td>
                <td>
                  <div class="emp-cell">
                    <div class="avatar-sm">{{ emp.firstName.charAt(0) }}</div>
                    <span class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</span>
                  </div>
                </td>
                <td>{{ emp.email }}</td>
                <td>{{ emp.departmentName }}</td>
                <td>{{ emp.designationName }}</td>
                <td>
                  <span class="badge" [ngClass]="emp.status === 'Active' ? 'badge-active' : 'badge-inactive'">
                    {{ emp.status }}
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/employees/details', emp.employeeId]" class="btn btn-outline-primary btn-sm">
                    Details
                  </a>
                </td>
              </tr>
              <tr *ngIf="!stats?.recentEmployees || stats?.recentEmployees?.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">No recent employee records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

    /* Stat Cards */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 22px;
    }
    .stat-icon {
      width: 52px; height: 52px;
      border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem;
    }
    .bg-indigo { background: rgba(99, 102, 241, 0.2); }
    .bg-emerald { background: rgba(16, 185, 129, 0.2); }
    .bg-rose { background: rgba(239, 68, 68, 0.2); }
    .bg-amber { background: rgba(245, 158, 11, 0.2); }

    .stat-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 1.7rem; font-weight: 800; margin-top: 2px; }
    .text-emerald { color: var(--success); }
    .text-rose { color: var(--danger); }
    .text-amber { color: var(--warning); }

    /* Section */
    .content-section { padding: 24px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .section-header h3 { font-size: 1.2rem; font-weight: 700; }
    .view-all-link { color: var(--primary); text-decoration: none; font-size: 0.9rem; font-weight: 600; }

    .emp-cell { display: flex; align-items: center; gap: 10px; }
    .avatar-sm {
      width: 32px; height: 32px; border-radius: 50%;
      background: #334155; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700;
    }
    .code-badge { background: rgba(255, 255, 255, 0.08); padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
    .btn-sm { padding: 4px 10px; font-size: 0.8rem; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => this.stats = data
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
}
