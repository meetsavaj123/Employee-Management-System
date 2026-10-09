import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="change-password-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Change Account Password</h1>
          <p class="page-subtitle">Update your security credentials for system access</p>
        </div>
      </div>

      <div class="form-card glass-card">
        <form [formGroup]="passForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label class="form-label">Current Password *</label>
            <input type="password" formControlName="currentPassword" class="form-control" placeholder="Enter current password" />
            <div *ngIf="f['currentPassword'].touched && f['currentPassword'].errors" class="invalid-feedback">
              Current password is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">New Password *</label>
            <input type="password" formControlName="newPassword" class="form-control" placeholder="At least 6 characters" />
            <div *ngIf="f['newPassword'].touched && f['newPassword'].errors" class="invalid-feedback">
              New password must be at least 6 characters.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm New Password *</label>
            <input type="password" formControlName="confirmPassword" class="form-control" placeholder="Re-enter new password" />
            <div *ngIf="passForm.hasError('mismatch') && f['confirmPassword'].touched" class="invalid-feedback">
              Passwords do not match.
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="passForm.invalid || isSubmitting" class="btn btn-primary">
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .change-password-page { display: flex; flex-direction: column; gap: 20px; }
    .page-title { font-size: 1.8rem; font-weight: 800; }
    .page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

    .form-card { padding: 36px; max-width: 500px; margin: 0 auto; width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class ChangePasswordComponent {
  passForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.passForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() { return this.passForm.controls; }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passForm.invalid) return;

    this.isSubmitting = true;
    this.authService.changePassword({
      currentPassword: this.passForm.value.currentPassword,
      newPassword: this.passForm.value.newPassword
    }).subscribe({
      next: () => {
        this.toastService.success('Success', 'Password changed successfully.');
        this.passForm.reset();
        this.isSubmitting = false;
      },
      error: () => this.isSubmitting = false
    });
  }
}
