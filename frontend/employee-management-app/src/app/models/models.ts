export interface User {
  userId: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  role: string;
  employeeId?: number;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  description?: string;
  createdDate?: string;
  employeeCount?: number;
}

export interface Designation {
  designationId: number;
  designationName: string;
  departmentId: number;
  departmentName?: string;
  description?: string;
  createdDate?: string;
}

export interface Employee {
  employeeId: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  departmentId: number;
  departmentName?: string;
  designationId: number;
  designationName?: string;
  salary: number;
  joiningDate: string;
  photo?: string;
  status: string;
  userId?: number;
  createdDate?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  recentEmployees: Employee[];
}
