import { Component, OnInit } from '@angular/core';
import { DoctorManageService } from '../../../services/admin-service/doctor-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ServicesService } from '../../../services/admin-service/services.service';
import dayjs from 'dayjs';
import { NotificationService } from '../../../services/notification.service';
import { StatusResponse } from '../../../shared/models/enums';

@Component({
  selector: 'app-doctor-manage',
  templateUrl: './doctor-manage.component.html',
  styleUrls: ['./doctor-manage.component.css']
})
export class DoctorManageComponent implements OnInit {

  createAccountDoctorForm!: FormGroup;
  modalRef!: NzModalRef;
  serviceOptions: { label: string, value: number }[] = [];



  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên người dùng', field: 'fullName' },
    { header: 'Email', field: 'email' },
    { header: 'Số điện thoại', field: 'phone' },
    { header: 'Địa chỉ', field: 'address' },
    { header: 'Giới tính', field: 'gender' },
    { header: 'Ngày sinh', field: 'dateOfBirth' }
  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(
    private doctorManageService: DoctorManageService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit() {
    this.fetchPatients();
    this.fetchService();

    this.createAccountDoctorForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\d{10,11}$')]], // SĐT có 10-11 số
      gender: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      service_id: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  fetchPatients() {
    this.doctorManageService.getDoctor().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.fullTableData = res.data.map((item: any, index: number) => ({
            ...item,
            stt: index + 1
          }));
          console.log(this.fullTableData, 'this.fullTableData');

          this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách bệnh nhân:", err);
      }
    });
  }

  openViewDetailModal(templateRef: any) {
    this.modalRef = this.modal.create({
      nzTitle: 'Thêm mới tài khoản bác sĩ',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  submitUpdate() {
    if (this.createAccountDoctorForm.valid) {
      const body = this.createAccountDoctorForm.value;
      if (body.dateOfBirth) {
        body.dateOfBirth = dayjs(body.dateOfBirth).format('DD/MM/YYYY');
      };
      body.accountType = "DOCTOR";
      this.doctorManageService.createAccountDoctor(body).subscribe({
        next: () => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Thêm mới tài khoản thành công'
          });
          this.fetchPatients();
          this.closeModal();
        },
        error: (err) => console.error('Lỗi khi cập nhật:', err)
      });
    } else {
      console.error('Form không hợp lệ');
      Object.values(this.createAccountDoctorForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  fetchService() {
    this.servicesService.getService().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.serviceOptions = res.data.map((service: any) => ({
            label: service.name,
            value: service.id
          }));
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách bệnh nhân:", err);
      }
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }

  onTablePageChange(page: number) {
    console.log('Trang hiện tại:', page);
  }
}
