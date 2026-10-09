import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Employee } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { API_ORIGIN } from '../../config/api.config';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Account Profile</h1>
          <p class="page-subtitle">View and update your personal contact details</p>
        </div>
      </div>

      <div class="profile-container glass-card" *ngIf="employee">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          
          <div class="profile-header">
            <div class="avatar-box">
              <img *ngIf="photoUrl" [src]="apiOrigin + photoUrl" alt="Avatar" />
              <div *ngIf="!photoUrl" class="avatar-text">{{ employee.firstName.charAt(0) }}</div>
            </div>
            
            <div class="header-info">
              <h2>{{ employee.firstName }} {{ employee.lastName }}</h2>
              <div class="meta-row">
                <span class="code-badge">{{ employee.employeeCode }}</span>
                <span class="dept-tag">{{ employee.departmentName }}</span>
                <span class="role-text">{{ employee.designationName }}</span>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" formControlName="firstName" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" formControlName="lastName" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" formControlName="email" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <input type="text" formControlName="mobile" class="form-control" />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Address</label>
              <input type="text" formControlName="address" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" formControlName="city" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">State</label>
              <input type="text" formControlName="state" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">Country</label>
              <input type="text" formControlName="country" class="form-control" />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="profileForm.invalid || isSubmitting" class="btn btn-primary">
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { display: flex; flex-direction: column; gap: 20px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

    .profile-container { padding: 36px; max-width: 800px; margin: 0 auto; width: 100%; }

    .profile-header { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
    .avatar-box { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 800; color: white; border: 2px solid var(--primary); }
    .avatar-box img { width: 100%; height: 100%; object-fit: cover; }

    .header-info h2 { font-size: 1.5rem; font-weight: 800; }
    .meta-row { display: flex; align-items: center; gap: 10px; margin-top: 6px; flex-wrap: wrap; }
    .code-badge { background: rgba(255, 255, 255, 0.08); padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 0.8rem; }
    .dept-tag { background: var(--primary-light); color: var(--primary); padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; }
    .role-text { color: var(--text-muted); font-size: 0.88rem; }

    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .full-width { grid-column: 1 / -1; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-color); }
  `]
})
export class ProfileComponent implements OnInit {
  readonly apiOrigin = API_ORIGIN;
  employee: Employee | null = null;
  profileForm: FormGroup;
  photoUrl: string | null = null;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.apiService.getMyProfile().subscribe(emp => {
      this.employee = emp;
      this.photoUrl = emp.photo || null;
      this.profileForm.patchValue({
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        mobile: emp.mobile,
        address: emp.address,
        city: emp.city,
        state: emp.state,
        country: emp.country
      });
    });
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.employee) return;

    this.isSubmitting = true;
    const payload = {
      ...this.employee,
      ...this.profileForm.value
    };

    this.apiService.updateEmployee(this.employee.employeeId, payload).subscribe({
      next: (updated) => {
        this.employee = updated;
        this.toastService.success('Profile Saved', 'Your account details have been updated.');
        this.isSubmitting = false;
      },
      error: () => this.isSubmitting = false
    });
  }
}
