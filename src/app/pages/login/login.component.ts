import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusResponse } from '../../shared/models/enums';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notification: NzNotificationService,
    private router: Router,
    private notificationService: NotificationService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    // chạy lần đầu khi khởi tạo component
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      return;
    }

    //call api 
    this.loginService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('account', JSON.stringify(res.data));
        localStorage.setItem('role', JSON.stringify(res.data.accountType));
        switch (res.data.accountType) {
          case 'PATIENT':
            this.router.navigate(['/dashboard/patient']);
            break;
          case 'DOCTOR':
            this.router.navigate(['/dashboard/doctor']);
            break;
          case 'ADMIN':
            this.router.navigate(['/dashboard/admin/patient-manage']);
            break;
        }
        this.notificationService.showNotification({
          severity: StatusResponse.SUCCESS,
          message: res.message
        });
      },
      error: (err) => {
        this.notification.error('Lỗi đăng nhập', 'Đăng nhập thất bại!');
      }
    });
  }
}
