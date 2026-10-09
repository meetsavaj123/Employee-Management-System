import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card glass-card animate-fade-in">
        <div class="brand-header">
          <div class="logo">EMS</div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your Employee Dashboard</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input
              type="text"
              formControlName="username"
              autocomplete="username"
              class="form-control"
              placeholder="Enter username (e.g. admin or john.doe)"
            />
            <div *ngIf="f['username'].touched && f['username'].errors" class="invalid-feedback">
              Username is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              formControlName="password"
              autocomplete="current-password"
              class="form-control"
              placeholder="Enter password (e.g. Password123!)"
            />
            <div *ngIf="f['password'].touched && f['password'].errors" class="invalid-feedback">
              Password is required.
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary btn-block">
            <span *ngIf="!isLoading">Sign In ➔</span>
            <span *ngIf="isLoading">Authenticating...</span>
          </button>
        </form>

        <div class="demo-credentials">
          <div class="demo-title">Demo Logins:</div>
          <div class="credential-row">
            <span>👑 <b>Admin:</b> admin / Password123!</span>
          </div>
          <div class="credential-row">
            <span>👤 <b>Employee:</b> john.doe / Password123!</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #1e1b4b 0%, #090d16 60%);
      padding: 20px;
    }
    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }
    .brand-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 54px;
      height: 54px;
      margin: 0 auto 16px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      color: white;
      font-size: 1.2rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
    }
    .brand-header h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .brand-header p {
      color: var(--text-muted);
      font-size: 0.88rem;
    }
    .btn-block {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      font-size: 0.95rem;
    }
    .demo-credentials {
      margin-top: 24px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .demo-title {
      font-weight: 700;
      margin-bottom: 6px;
      color: var(--primary);
    }
    .credential-row {
      margin-top: 4px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success('Welcome Back!', `Logged in successfully as ${res.role}`);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
