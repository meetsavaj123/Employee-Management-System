import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Department } from '../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="department-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Departments</h1>
          <p class="page-subtitle">Manage organizational units and department structures</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary">
          <span>+ Add Department</span>
        </button>
      </div>

      <div class="table-card glass-card">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Employees Assigned</th>
                <th>Created Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let dept of departments">
                <td>#{{ dept.departmentId }}</td>
                <td class="font-weight-bold text-primary">{{ dept.departmentName }}</td>
                <td>{{ dept.description || 'N/A' }}</td>
                <td><span class="badge badge-active">{{ dept.employeeCount || 0 }} Staff</span></td>
                <td>{{ dept.createdDate | date:'mediumDate' }}</td>
                <td>
                  <div class="action-buttons">
                    <button (click)="openEditModal(dept)" class="btn-icon" title="Edit">✏️</button>
                    <button (click)="confirmDelete(dept)" class="btn-icon delete-btn" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="departments.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">No departments configured yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Department Modal -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-card glass-card">
          <h3>{{ isEditMode ? 'Edit Department' : 'Add Department' }}</h3>
          
          <form [formGroup]="deptForm" (ngSubmit)="onSubmit()" class="mt-3">
            <div class="form-group">
              <label class="form-label">Department Name *</label>
              <input type="text" formControlName="departmentName" class="form-control" placeholder="e.g. Information Technology" />
              <div *ngIf="f['departmentName'].touched && f['departmentName'].errors" class="invalid-feedback">
                Department name cannot be empty.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-control" rows="3" placeholder="Brief details about functions..."></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="deptForm.invalid || isSubmitting" class="btn btn-primary">
                <span>{{ isEditMode ? 'Update' : 'Create' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div class="modal-backdrop" *ngIf="deptToDelete">
        <div class="modal-card glass-card">
          <h3>Confirm Department Deletion</h3>
          <p>Are you sure you want to delete department <b>{{ deptToDelete.departmentName }}</b>?</p>
          <div class="modal-actions">
            <button (click)="deptToDelete = null" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteDepartment()" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .department-page { display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }
    .table-card { padding: 0; overflow: hidden; }
    .font-weight-bold { font-weight: 700; }
    .text-primary { color: var(--primary); }

    .action-buttons { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
    .btn-icon { background: rgba(255, 255, 255, 0.06); border: none; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .btn-icon:hover { background: rgba(255, 255, 255, 0.15); }
    .delete-btn:hover { background: var(--danger-bg); }

    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); z-index: 9000; display: flex; align-items: center; justify-content: center; }
    .modal-card { width: 100%; max-width: 440px; padding: 28px; border-radius: 16px; }
    .modal-card h3 { font-size: 1.3rem; margin-bottom: 12px; }
    .modal-card p { color: var(--text-muted); margin-bottom: 24px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .mt-3 { margin-top: 16px; }
  `]
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  deptForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentDeptId: number | null = null;
  deptToDelete: Department | null = null;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.deptForm = this.fb.group({
      departmentName: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  get f() { return this.deptForm.controls; }

  loadDepartments() {
    this.apiService.getDepartments().subscribe(depts => this.departments = depts);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentDeptId = null;
    this.deptForm.reset();
    this.showModal = true;
  }

  openEditModal(dept: Department) {
    this.isEditMode = true;
    this.currentDeptId = dept.departmentId;
    this.deptForm.patchValue({
      departmentName: dept.departmentName,
      description: dept.description
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.deptForm.invalid) return;

    this.isSubmitting = true;
    if (this.isEditMode && this.currentDeptId) {
      this.apiService.updateDepartment(this.currentDeptId, this.deptForm.value).subscribe({
        next: () => {
          this.toastService.success('Updated', 'Department updated successfully.');
          this.closeModal();
          this.loadDepartments();
          this.isSubmitting = false;
        },
        error: () => this.isSubmitting = false
      });
    } else {
      this.apiService.createDepartment(this.deptForm.value).subscribe({
        next: () => {
          this.toastService.success('Created', 'Department created successfully.');
          this.closeModal();
          this.loadDepartments();
          this.isSubmitting = false;
        },
        error: () => this.isSubmitting = false
      });
    }
  }

  confirmDelete(dept: Department) {
    this.deptToDelete = dept;
  }

  deleteDepartment() {
    if (!this.deptToDelete) return;

    this.apiService.deleteDepartment(this.deptToDelete.departmentId).subscribe({
      next: () => {
        this.toastService.success('Deleted', 'Department removed successfully.');
        this.deptToDelete = null;
        this.loadDepartments();
      }
    });
  }
}
