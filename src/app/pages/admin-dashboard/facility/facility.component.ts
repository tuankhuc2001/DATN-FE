import { Component, OnInit } from '@angular/core';
import { FacilityService } from '../../../services/admin-service/facility.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { StatusResponse } from '../../../shared/models/enums';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {
  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên khoa', field: 'facility_name' },
    { header: 'Mã khoa', field: 'code' },
    { header: 'Mô tả', field: 'description' },
    { header: 'Liên hệ', field: 'phone' },
    { header: 'Hành động', field: 'action', type: ['update'] }
  ];

  facilityForm!: FormGroup;
  isEditMode = false;
  modalRef!: NzModalRef;
  currentId: number | null = null;

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(
    private facilityService: FacilityService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.fetchFacilities();
    this.facilityForm = this.fb.group({
      facility_name: [''],
      code: [''],
      description: [''],
      phone: [''],
    });
  }

  fetchFacilities() {
    this.facilityService.getFacility().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.fullTableData = res.data.map((item: any, index: number) => ({
            ...item,
            stt: index + 1
          }));
          this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách khoa:", err);
      }
    });
  }

  onTablePageChange(page: number) {
    console.log('Trang hiện tại:', page);
  }

  openCreateModal(templateRef: any) {
    this.isEditMode = false;
    this.currentId = null;
    this.facilityForm.reset();
    this.modalRef = this.modal.create({
      nzTitle: 'Thêm mới khoa',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  openEditModal(data: any, templateRef: any) {
    this.isEditMode = true;
    this.currentId = data.id;
    this.facilityForm.patchValue({
      facility_name: data.facility_name,
      code: data.code,
      description: data.description,
      phone: data.phone
    });

    this.modalRef = this.modal.create({
      nzTitle: 'Cập nhật khoa',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  submitForm() {
    if (this.facilityForm.invalid) {
      this.markFormDirty(this.facilityForm);
      return;
    }

    const body = this.facilityForm.value;

    if (this.isEditMode && this.currentId !== null) {
      this.facilityService.updateFacility(body, this.currentId).subscribe({
        next: () => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Cập nhật khoa thành công'
          });
          this.fetchFacilities();
          this.closeModal();
        },
        error: (err) => console.error('Lỗi cập nhật:', err)
      });
    } else {
      this.facilityService.createFacility(body).subscribe({
        next: () => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Thêm mới khoa thành công'
          });
          this.fetchFacilities();
          this.closeModal();
        },
        error: (err) => console.error('Lỗi tạo mới:', err)
      });
    }
  }

  markFormDirty(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
