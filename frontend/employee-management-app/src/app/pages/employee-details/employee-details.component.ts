import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Employee } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { API_ORIGIN } from '../../config/api.config';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="employee-details-page animate-fade-in" *ngIf="employee">
      <div class="page-header">
        <div>
          <h1 class="page-title">Employee Profile Card</h1>
          <p class="page-subtitle">Detailed view of {{ employee.fullName }}</p>
        </div>
        <div class="header-actions">
          <a routerLink="/employees" class="btn btn-secondary">← Back to List</a>
          <a *ngIf="isAdmin" [routerLink]="['/employees/edit', employee.employeeId]" class="btn btn-primary">✏️ Edit Profile</a>
        </div>
      </div>

      <div class="profile-layout">
        <!-- Main Info Card -->
        <div class="profile-card glass-card">
          <div class="avatar-header">
            <img *ngIf="employee.photo" [src]="apiOrigin + employee.photo" class="profile-avatar" />
            <div *ngIf="!employee.photo" class="avatar-placeholder">{{ employee.firstName.charAt(0) }}</div>
            
            <h2 class="name">{{ employee.firstName }} {{ employee.lastName }}</h2>
            <span class="code-badge">{{ employee.employeeCode }}</span>
            <div class="role-title">{{ employee.designationName }}</div>
            <div class="dept-tag">{{ employee.departmentName }}</div>

            <span class="badge mt-3" [ngClass]="employee.status === 'Active' ? 'badge-active' : 'badge-inactive'">
              {{ employee.status }} Status
            </span>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Email Address</span>
              <span class="value">{{ employee.email }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Mobile Phone</span>
              <span class="value">{{ employee.mobile }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Gender</span>
              <span class="value">{{ employee.gender }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date of Birth</span>
              <span class="value">{{ employee.dob | date:'mediumDate' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Annual Salary</span>
              <span class="value font-weight-bold text-emerald">\${{ employee.salary | number:'1.2-2' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Joining Date</span>
              <span class="value">{{ employee.joiningDate | date:'mediumDate' }}</span>
            </div>
            <div class="detail-item full-width">
              <span class="label">Residential Address</span>
              <span class="value">{{ employee.address }}, {{ employee.city }}, {{ employee.state }}, {{ employee.country }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .employee-details-page { display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }
    .header-actions { display: flex; gap: 12px; }

    .profile-card { padding: 36px; max-width: 800px; margin: 0 auto; width: 100%; }
    .avatar-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
    .profile-avatar { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); box-shadow: var(--shadow-glow); }
    .avatar-placeholder { width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); color: white; font-size: 3rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 3px solid var(--primary); box-shadow: var(--shadow-glow); }
    
    .name { font-size: 1.6rem; font-weight: 800; margin-top: 14px; }
    .code-badge { background: rgba(255, 255, 255, 0.08); padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; margin-top: 4px; }
    .role-title { font-size: 1.05rem; font-weight: 600; color: var(--text-muted); margin-top: 6px; }
    .dept-tag { background: var(--primary-light); color: var(--primary); padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 0.8rem; margin-top: 8px; }
    .mt-3 { margin-top: 12px; }

    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .detail-item { display: flex; flex-direction: column; gap: 4px; }
    .full-width { grid-column: 1 / -1; }
    .label { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; }
    .value { font-size: 0.95rem; color: var(--text-main); }
    .text-emerald { color: var(--success); }
  `]
})
export class EmployeeDetailsComponent implements OnInit {
  readonly apiOrigin = API_ORIGIN;
  employee: Employee | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.apiService.getEmployeeById(+id).subscribe(emp => this.employee = emp);
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
}
