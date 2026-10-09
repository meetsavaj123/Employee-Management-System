import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Department, Designation } from '../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="designation-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Designations</h1>
          <p class="page-subtitle">Manage job titles, hierarchies, and department assignments</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary">
          <span>+ Add Designation</span>
        </button>
      </div>

      <div class="table-card glass-card">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Designation Title</th>
                <th>Department</th>
                <th>Description</th>
                <th>Created Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let desig of designations">
                <td>#{{ desig.designationId }}</td>
                <td class="font-weight-bold text-primary">{{ desig.designationName }}</td>
                <td><span class="dept-tag">{{ desig.departmentName }}</span></td>
                <td>{{ desig.description || 'N/A' }}</td>
                <td>{{ desig.createdDate | date:'mediumDate' }}</td>
                <td>
                  <div class="action-buttons">
                    <button (click)="openEditModal(desig)" class="btn-icon" title="Edit">✏️</button>
                    <button (click)="confirmDelete(desig)" class="btn-icon delete-btn" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="designations.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">No designations configured yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-card glass-card">
          <h3>{{ isEditMode ? 'Edit Designation' : 'Add Designation' }}</h3>
          
          <form [formGroup]="desigForm" (ngSubmit)="onSubmit()" class="mt-3">
            <div class="form-group">
              <label class="form-label">Designation Name *</label>
              <input type="text" formControlName="designationName" class="form-control" placeholder="e.g. Senior Developer" />
              <div *ngIf="f['designationName'].touched && f['designationName'].errors" class="invalid-feedback">
                Designation name cannot be empty.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Department *</label>
              <select formControlName="departmentId" class="form-select">
                <option value="">Select Department</option>
                <option *ngFor="let dept of departments" [value]="dept.departmentId">
                  {{ dept.departmentName }}
                </option>
              </select>
              <div *ngIf="f['departmentId'].touched && f['departmentId'].errors" class="invalid-feedback">
                Department is required.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-control" rows="3" placeholder="Key responsibilities..."></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="desigForm.invalid || isSubmitting" class="btn btn-primary">
                <span>{{ isEditMode ? 'Update' : 'Create' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div class="modal-backdrop" *ngIf="desigToDelete">
        <div class="modal-card glass-card">
          <h3>Confirm Designation Deletion</h3>
          <p>Are you sure you want to delete designation <b>{{ desigToDelete.designationName }}</b>?</p>
          <div class="modal-actions">
            <button (click)="desigToDelete = null" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteDesignation()" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .designation-page { display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }
    .table-card { padding: 0; overflow: hidden; }
    .font-weight-bold { font-weight: 700; }
    .text-primary { color: var(--primary); }
    .dept-tag { background: var(--primary-light); color: var(--primary); padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; }

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
export class DesignationListComponent implements OnInit {
  designations: Designation[] = [];
  departments: Department[] = [];
  desigForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentDesigId: number | null = null;
  desigToDelete: Designation | null = null;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.desigForm = this.fb.group({
      designationName: ['', Validators.required],
      departmentId: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  get f() { return this.desigForm.controls; }

  loadData() {
    this.apiService.getDepartments().subscribe(depts => this.departments = depts);
    this.apiService.getDesignations().subscribe(desigs => this.designations = desigs);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentDesigId = null;
    this.desigForm.reset();
    this.showModal = true;
  }

  openEditModal(desig: Designation) {
    this.isEditMode = true;
    this.currentDesigId = desig.designationId;
    this.desigForm.patchValue({
      designationName: desig.designationName,
      departmentId: desig.departmentId,
      description: desig.description
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.desigForm.invalid) return;

    this.isSubmitting = true;
    const payload = {
      ...this.desigForm.value,
      departmentId: +this.desigForm.value.departmentId
    };

    if (this.isEditMode && this.currentDesigId) {
      this.apiService.updateDesignation(this.currentDesigId, payload).subscribe({
        next: () => {
          this.toastService.success('Updated', 'Designation updated successfully.');
          this.closeModal();
          this.loadData();
          this.isSubmitting = false;
        },
        error: () => this.isSubmitting = false
      });
    } else {
      this.apiService.createDesignation(payload).subscribe({
        next: () => {
          this.toastService.success('Created', 'Designation created successfully.');
          this.closeModal();
          this.loadData();
          this.isSubmitting = false;
        },
        error: () => this.isSubmitting = false
      });
    }
  }

  confirmDelete(desig: Designation) {
    this.desigToDelete = desig;
  }

  deleteDesignation() {
    if (!this.desigToDelete) return;

    this.apiService.deleteDesignation(this.desigToDelete.designationId).subscribe({
      next: () => {
        this.toastService.success('Deleted', 'Designation removed successfully.');
        this.desigToDelete = null;
        this.loadData();
      }
    });
  }
}
