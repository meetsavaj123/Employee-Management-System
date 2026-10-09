import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Employee, Department, PagedResult } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { API_ORIGIN } from '../../config/api.config';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="employee-list-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Employee Directory</h1>
          <p class="page-subtitle">Manage company workforce, roles, and profiles</p>
        </div>
        <div *ngIf="isAdmin">
          <a routerLink="/employees/add" class="btn btn-primary">
            <span>+ Add New Employee</span>
          </a>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="filters-card glass-card">
        <div class="filter-row">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="Search by code, name, email, city..."
              class="form-control"
            />
          </div>

          <div class="filter-group">
            <select [(ngModel)]="selectedDepartment" (change)="loadEmployees()" class="form-select">
              <option [ngValue]="null">All Departments</option>
              <option *ngFor="let dept of departments" [value]="dept.departmentId">
                {{ dept.departmentName }}
              </option>
            </select>

            <select [(ngModel)]="selectedStatus" (change)="loadEmployees()" class="form-select">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Employee Table Card -->
      <div class="table-card glass-card">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th (click)="sort('code')" class="sortable">
                  Code {{ getSortIcon('code') }}
                </th>
                <th (click)="sort('name')" class="sortable">
                  Employee {{ getSortIcon('name') }}
                </th>
                <th (click)="sort('email')" class="sortable">
                  Email {{ getSortIcon('email') }}
                </th>
                <th>Mobile</th>
                <th (click)="sort('department')" class="sortable">
                  Department {{ getSortIcon('department') }}
                </th>
                <th>Designation</th>
                <th (click)="sort('salary')" class="sortable">
                  Salary {{ getSortIcon('salary') }}
                </th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of pagedResult?.items">
                <td><span class="code-badge">{{ emp.employeeCode }}</span></td>
                <td>
                  <div class="emp-profile">
                    <img *ngIf="emp.photo" [src]="apiOrigin + emp.photo" class="avatar-img" alt="Photo" />
                    <div *ngIf="!emp.photo" class="avatar-circle">{{ emp.firstName.charAt(0) }}</div>
                    <div>
                      <div class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</div>
                      <div class="emp-sub">{{ emp.gender }}, {{ emp.city }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ emp.email }}</td>
                <td>{{ emp.mobile }}</td>
                <td><span class="dept-tag">{{ emp.departmentName }}</span></td>
                <td>{{ emp.designationName }}</td>
                <td class="font-weight-bold">\${{ emp.salary | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" [ngClass]="emp.status === 'Active' ? 'badge-active' : 'badge-inactive'">
                    {{ emp.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/employees/details', emp.employeeId]" class="btn-icon" title="View Details">👁️</a>
                    <a *ngIf="isAdmin" [routerLink]="['/employees/edit', emp.employeeId]" class="btn-icon" title="Edit Employee">✏️</a>
                    <button *ngIf="isAdmin" (click)="confirmDelete(emp)" class="btn-icon delete-btn" title="Delete Employee">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!pagedResult?.items || pagedResult?.items?.length === 0">
                <td colspan="9" class="empty-state">
                  <div>No employees matching the selected criteria.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-wrapper" *ngIf="pagedResult && pagedResult.totalCount > 0">
          <div class="page-info">
            Showing {{ (pageNumber - 1) * pageSize + 1 }} to {{ Math.min(pageNumber * pageSize, pagedResult.totalCount) }} of {{ pagedResult.totalCount }} records
          </div>

          <div class="pagination-controls">
            <button [disabled]="pageNumber === 1" (click)="changePage(pageNumber - 1)" class="btn btn-secondary btn-sm">
              ◄ Prev
            </button>
            <span class="page-number">Page {{ pageNumber }} of {{ pagedResult.totalPages }}</span>
            <button [disabled]="pageNumber >= pagedResult.totalPages" (click)="changePage(pageNumber + 1)" class="btn btn-secondary btn-sm">
              Next ►
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="employeeToDelete">
        <div class="modal-card glass-card">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete employee <b>{{ employeeToDelete.firstName }} {{ employeeToDelete.lastName }}</b> ({{ employeeToDelete.employeeCode }})?</p>
          <div class="modal-actions">
            <button (click)="employeeToDelete = null" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteEmployee()" class="btn btn-danger">Delete Employee</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .employee-list-page { display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

    .filters-card { padding: 18px 24px; }
    .filter-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .search-box { position: relative; flex: 1; min-width: 260px; }
    .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-dim); }
    .search-box input { padding-left: 40px; }
    .filter-group { display: flex; gap: 12px; }

    .table-card { padding: 0; overflow: hidden; }
    .sortable { cursor: pointer; user-select: none; }
    .sortable:hover { color: var(--primary); }

    .emp-profile { display: flex; align-items: center; gap: 12px; }
    .avatar-circle {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      color: white; font-weight: 700; display: flex; align-items: center; justify-content: center;
    }
    .avatar-img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }
    .emp-name { font-weight: 600; color: var(--text-main); }
    .emp-sub { font-size: 0.75rem; color: var(--text-muted); }

    .code-badge { background: rgba(255, 255, 255, 0.08); padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
    .dept-tag { background: var(--primary-light); color: var(--primary); padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; }

    .action-buttons { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
    .btn-icon { background: rgba(255, 255, 255, 0.06); border: none; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; text-decoration: none; cursor: pointer; transition: all 0.2s; }
    .btn-icon:hover { background: rgba(255, 255, 255, 0.15); }
    .delete-btn:hover { background: var(--danger-bg); }

    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
    .pagination-wrapper { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid var(--border-color); }
    .page-info { font-size: 0.85rem; color: var(--text-muted); }
    .pagination-controls { display: flex; align-items: center; gap: 12px; }
    .page-number { font-size: 0.85rem; font-weight: 600; }

    /* Modal Backdrop */
    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); z-index: 9000; display: flex; align-items: center; justify-content: center; }
    .modal-card { width: 100%; max-width: 440px; padding: 28px; border-radius: 16px; }
    .modal-card h3 { font-size: 1.3rem; margin-bottom: 12px; }
    .modal-card p { color: var(--text-muted); margin-bottom: 24px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
  `]
})
export class EmployeeListComponent implements OnInit {
  readonly apiOrigin = API_ORIGIN;
  pagedResult: PagedResult<Employee> | null = null;
  departments: Department[] = [];
  
  searchQuery: string = '';
  selectedDepartment: number | null = null;
  selectedStatus: string = '';
  sortBy: string = 'EmployeeId';
  isAscending: boolean = true;
  pageNumber: number = 1;
  pageSize: number = 10;
  
  employeeToDelete: Employee | null = null;
  Math = Math;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  loadDepartments() {
    this.apiService.getDepartments().subscribe({
      next: (depts) => this.departments = depts
    });
  }

  loadEmployees() {
    this.apiService.getEmployees({
      search: this.searchQuery,
      departmentId: this.selectedDepartment || undefined,
      status: this.selectedStatus,
      sortBy: this.sortBy,
      isAscending: this.isAscending,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: (res) => this.pagedResult = res
    });
  }

  onSearchChange() {
    this.pageNumber = 1;
    this.loadEmployees();
  }

  sort(column: string) {
    if (this.sortBy === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortBy = column;
      this.isAscending = true;
    }
    this.loadEmployees();
  }

  getSortIcon(column: string): string {
    if (this.sortBy.toLowerCase() !== column.toLowerCase()) return '↕';
    return this.isAscending ? '↑' : '↓';
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.loadEmployees();
  }

  confirmDelete(emp: Employee) {
    this.employeeToDelete = emp;
  }

  deleteEmployee() {
    if (!this.employeeToDelete) return;

    this.apiService.deleteEmployee(this.employeeToDelete.employeeId).subscribe({
      next: () => {
        this.toastService.success('Deleted', 'Employee record deleted successfully.');
        this.employeeToDelete = null;
        this.loadEmployees();
      }
    });
  }
}
