import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, Designation, Employee, PagedResult, DashboardStats } from '../models/models';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  // --- Departments ---
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/departments/${id}`);
  }

  createDepartment(dept: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/departments`, dept);
  }

  updateDepartment(id: number, dept: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/departments/${id}`, dept);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/departments/${id}`);
  }

  // --- Designations ---
  getDesignations(departmentId?: number): Observable<Designation[]> {
    let params = new HttpParams();
    if (departmentId) {
      params = params.set('departmentId', departmentId.toString());
    }
    return this.http.get<Designation[]>(`${this.baseUrl}/designations`, { params });
  }

  getDesignationById(id: number): Observable<Designation> {
    return this.http.get<Designation>(`${this.baseUrl}/designations/${id}`);
  }

  createDesignation(desig: Partial<Designation>): Observable<Designation> {
    return this.http.post<Designation>(`${this.baseUrl}/designations`, desig);
  }

  updateDesignation(id: number, desig: Partial<Designation>): Observable<Designation> {
    return this.http.put<Designation>(`${this.baseUrl}/designations/${id}`, desig);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/designations/${id}`);
  }

  // --- Employees ---
  getEmployees(query: {
    search?: string;
    departmentId?: number;
    status?: string;
    sortBy?: string;
    isAscending?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }): Observable<PagedResult<Employee>> {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.departmentId) params = params.set('departmentId', query.departmentId.toString());
    if (query.status) params = params.set('status', query.status);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.isAscending !== undefined) params = params.set('isAscending', query.isAscending.toString());
    if (query.pageNumber) params = params.set('pageNumber', query.pageNumber.toString());
    if (query.pageSize) params = params.set('pageSize', query.pageSize.toString());

    return this.http.get<PagedResult<Employee>>(`${this.baseUrl}/employees`, { params });
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }

  getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/profile/me`);
  }

  createEmployee(emp: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, emp);
  }

  updateEmployee(id: number, emp: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/employees/dashboard`);
  }

  uploadPhoto(file: File): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ photoUrl: string }>(`${this.baseUrl}/employees/upload-photo`, formData);
  }
}
