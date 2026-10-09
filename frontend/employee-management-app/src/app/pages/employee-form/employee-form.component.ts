import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Department, Designation } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { API_ORIGIN } from '../../config/api.config';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="employee-form-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ isEditMode ? 'Edit Employee Record' : 'Add New Employee' }}</h1>
          <p class="page-subtitle">Fill in the employee details, credentials, and organizational mapping</p>
        </div>
        <a routerLink="/employees" class="btn btn-secondary">
          <span>← Back to Directory</span>
        </a>
      </div>

      <div class="form-card glass-card">
        <form [formGroup]="empForm" (ngSubmit)="onSubmit()">
          
          <!-- Photo Upload Section -->
          <div class="photo-section">
            <div class="photo-preview">
              <img *ngIf="photoUrl" [src]="apiOrigin + photoUrl" alt="Photo" />
              <div *ngIf="!photoUrl" class="photo-placeholder">📷</div>
            </div>
            <div class="photo-upload-controls">
              <label class="btn btn-secondary btn-sm">
                <span>Upload Photo</span>
                <input type="file" (change)="onFileSelected($event)" accept="image/*" style="display: none;" />
              </label>
              <span class="photo-hint">Accepted formats: JPG, PNG, WebP</span>
            </div>
          </div>

          <div class="form-grid">
            <!-- Basic Information -->
            <div class="section-title">Personal Information</div>

            <div class="form-group">
              <label class="form-label">Employee Code *</label>
              <input type="text" formControlName="employeeCode" class="form-control" placeholder="EMP-1004" />
              <div *ngIf="f['employeeCode'].touched && f['employeeCode'].errors" class="invalid-feedback">Employee code is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input type="text" formControlName="firstName" class="form-control" placeholder="John" />
              <div *ngIf="f['firstName'].touched && f['firstName'].errors" class="invalid-feedback">First name is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input type="text" formControlName="lastName" class="form-control" placeholder="Doe" />
              <div *ngIf="f['lastName'].touched && f['lastName'].errors" class="invalid-feedback">Last name is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" formControlName="email" class="form-control" placeholder="john.doe@company.com" />
              <div *ngIf="f['email'].touched && f['email'].errors" class="invalid-feedback">Valid email address is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input type="text" formControlName="mobile" class="form-control" placeholder="+1555123456" />
              <div *ngIf="f['mobile'].touched && f['mobile'].errors" class="invalid-feedback">Mobile number is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Gender *</label>
              <select formControlName="gender" class="form-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Date of Birth *</label>
              <input type="date" formControlName="dob" class="form-control" />
              <div *ngIf="f['dob'].touched && f['dob'].errors" class="invalid-feedback">Date of birth is required.</div>
            </div>

            <!-- Address & Location -->
            <div class="section-title">Address & Location</div>

            <div class="form-group full-width">
              <label class="form-label">Street Address *</label>
              <input type="text" formControlName="address" class="form-control" placeholder="123 Corporate Ave" />
              <div *ngIf="f['address'].touched && f['address'].errors" class="invalid-feedback">Address is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">City *</label>
              <input type="text" formControlName="city" class="form-control" placeholder="San Francisco" />
              <div *ngIf="f['city'].touched && f['city'].errors" class="invalid-feedback">City is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">State *</label>
              <input type="text" formControlName="state" class="form-control" placeholder="CA" />
              <div *ngIf="f['state'].touched && f['state'].errors" class="invalid-feedback">State is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Country *</label>
              <input type="text" formControlName="country" class="form-control" placeholder="USA" />
              <div *ngIf="f['country'].touched && f['country'].errors" class="invalid-feedback">Country is required.</div>
            </div>

            <!-- Organization & Role -->
            <div class="section-title">Organization & Employment</div>

            <div class="form-group">
              <label class="form-label">Department *</label>
              <select formControlName="departmentId" (change)="onDepartmentChange()" class="form-select">
                <option value="">Select Department</option>
                <option *ngFor="let dept of departments" [value]="dept.departmentId">
                  {{ dept.departmentName }}
                </option>
              </select>
              <div *ngIf="f['departmentId'].touched && f['departmentId'].errors" class="invalid-feedback">Department is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Designation *</label>
              <select formControlName="designationId" class="form-select">
                <option value="">Select Designation</option>
                <option *ngFor="let desig of filteredDesignations" [value]="desig.designationId">
                  {{ desig.designationName }}
                </option>
              </select>
              <div *ngIf="f['designationId'].touched && f['designationId'].errors" class="invalid-feedback">Designation is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Salary (USD) *</label>
              <input type="number" formControlName="salary" class="form-control" placeholder="85000" />
              <div *ngIf="f['salary'].touched && f['salary'].errors" class="invalid-feedback">
                Salary must be non-negative.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Joining Date *</label>
              <input type="date" formControlName="joiningDate" class="form-control" />
              <div *ngIf="f['joiningDate'].touched && f['joiningDate'].errors" class="invalid-feedback">Joining date is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Status *</label>
              <select formControlName="status" class="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/employees" class="btn btn-secondary">Cancel</a>
            <button type="submit" [disabled]="empForm.invalid || isSubmitting" class="btn btn-primary">
              <span>{{ isEditMode ? 'Update Employee' : 'Save Employee' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .employee-form-page { display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

    .form-card { padding: 32px; }

    .photo-section { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); }
    .photo-preview { width: 80px; height: 80px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
    .photo-placeholder { font-size: 2rem; color: var(--text-dim); }
    .photo-hint { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }

    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .section-title { grid-column: 1 / -1; font-weight: 700; font-size: 1.05rem; color: var(--primary); margin-top: 10px; padding-bottom: 6px; border-bottom: 1px solid rgba(99, 102, 241, 0.2); }
    .full-width { grid-column: 1 / -1; }

    .form-actions { display: flex; justify-content: flex-end; gap: 14px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-color); }
  `]
})
export class EmployeeFormComponent implements OnInit {
  readonly apiOrigin = API_ORIGIN;
  empForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  departments: Department[] = [];
  designations: Designation[] = [];
  filteredDesignations: Designation[] = [];
  photoUrl: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.empForm = this.fb.group({
      employeeCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      gender: ['Male', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['USA', Validators.required],
      departmentId: ['', Validators.required],
      designationId: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      joiningDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartmentsAndDesignations();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployeeData(this.employeeId);
    }
  }

  get f() { return this.empForm.controls; }

  loadDepartmentsAndDesignations() {
    this.apiService.getDepartments().subscribe(depts => this.departments = depts);
    this.apiService.getDesignations().subscribe(desigs => {
      this.designations = desigs;
      this.filterDesignations();
    });
  }

  onDepartmentChange() {
    this.empForm.patchValue({ designationId: '' });
    this.filterDesignations();
  }

  filterDesignations() {
    const deptId = +this.empForm.value.departmentId;
    if (deptId) {
      this.filteredDesignations = this.designations.filter(d => d.departmentId === deptId);
    } else {
      this.filteredDesignations = this.designations;
    }
  }

  loadEmployeeData(id: number) {
    this.apiService.getEmployeeById(id).subscribe(emp => {
      this.photoUrl = emp.photo || null;
      this.empForm.patchValue({
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        mobile: emp.mobile,
        gender: emp.gender,
        dob: emp.dob ? emp.dob.split('T')[0] : '',
        address: emp.address,
        city: emp.city,
        state: emp.state,
        country: emp.country,
        departmentId: emp.departmentId,
        designationId: emp.designationId,
        salary: emp.salary,
        joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
        status: emp.status
      });
      this.filterDesignations();
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.apiService.uploadPhoto(file).subscribe({
        next: (res) => {
          this.photoUrl = res.photoUrl;
          this.toastService.success('Photo Uploaded', 'Profile image uploaded successfully.');
        }
      });
    }
  }

  onSubmit() {
    if (this.empForm.invalid) return;

    this.isSubmitting = true;
    const payload = {
      ...this.empForm.value,
      departmentId: +this.empForm.value.departmentId,
      designationId: +this.empForm.value.designationId,
      salary: +this.empForm.value.salary,
      photo: this.photoUrl || ''
    };

    if (this.isEditMode && this.employeeId) {
      this.apiService.updateEmployee(this.employeeId, payload).subscribe({
        next: () => {
          this.toastService.success('Updated', 'Employee profile updated successfully.');
          this.router.navigate(['/employees']);
        },
        error: () => this.isSubmitting = false
      });
    } else {
      this.apiService.createEmployee(payload).subscribe({
        next: () => {
          this.toastService.success('Created', 'New employee created successfully.');
          this.router.navigate(['/employees']);
        },
        error: () => this.isSubmitting = false
      });
    }
  }
}
