import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import dayjs from "dayjs";
import { StatusResponse } from '../../../shared/models/enums';
import { UserInformationService } from '../../../services/userInformationService.service';
import { ProfileService } from '../../../services/patient-service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfilePatientComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  userInformation: any;
  profile: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserInformationService,
    private profileService: ProfileService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userInformation = this.userService.getAccount();

    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.loadProfile();
  }

  loadProfile() {
    if (this.userInformation) {
      this.profileService.getProfile(this.userInformation.id).subscribe({
        next: (res) => {
          if (res?.code === 201 && res?.data) {
            this.profile = res.data;
  
            this.profile.dateOfBirth = dayjs(this.profile.dateOfBirth).toDate();
  
            this.profileForm.patchValue({
              fullName: this.profile.fullName,
              email: this.profile.email,
              phone: this.profile.phone,
              gender: this.profile.gender.toLowerCase(), // Chuyển về chữ thường để match với radio button
              dateOfBirth: this.profile.dateOfBirth,
              address: this.profile.address
            });
          }
        },
        error: (err: any) => {
          console.error("Lỗi khi tải hồ sơ:", err);
        }
      });
    }
  }
  

  onSubmitProfile(){
    const values = { ...this.profileForm.value };
    values.dateOfBirth = dayjs(values.dateOfBirth).format('DD/MM/YYYY');
    values.id = this.userInformation.id;

    console.log(values, 'values');
    
    this.profileService.updateProfile(values).subscribe({
      next: (res) => {
        this.notificationService.success(StatusResponse.SUCCESS, res.data.message);

      },
      error: (err) => {}
    });
  }

  onChangePassword() {
    const values = this.passwordForm.value.confirmPassword;
    const idUser = this.userInformation.id

    this.profileService.updatePassword(idUser,values).subscribe({
      next: (res) => {
        this.passwordForm.reset();
        this.notificationService.success(StatusResponse.SUCCESS, res.data.message);

      },
      error: (err) => {}
    });

  }

  private passwordMatchValidator(group: FormGroup): void {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    }
  }
}
