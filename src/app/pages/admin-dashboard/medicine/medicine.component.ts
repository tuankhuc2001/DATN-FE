import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { MedicineService } from '../../../services/admin-service/medicine.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusResponse } from '../../../shared/models/enums';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit {
  @ViewChild('deleteConfirmModal', { static: true }) deleteConfirmModalTemplate!: any;

  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên Thuốc', field: 'name' },
    { header: 'Mô tả', field: 'describemedicine' },
    { header: 'Số lượng', field: 'barcode' },
    { header: 'Hành động', field: 'action', width: '150px', type: ['update', 'delete'] }
  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;
  pageIndex = 1;

  medicineForm!: FormGroup;
  modalRef!: NzModalRef;
  modalMode: 'create' | 'update' = 'create';

  medicineToDelete: any = null;

  constructor(
    private medicineService: MedicineService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.fetchMedicines();
  }

  fetchMedicines(): void {
    this.medicineService.getMedicine().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.fullTableData = res.data.map((item: any, index: number) => ({
            ...item,
            stt: index + 1
          }));
          this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err) => {
        console.error("Lỗi khi tải danh sách thuốc:", err);
      }
    });
  }

  onTablePageChange(page: number): void {
    this.pageIndex = page;
  }

  openMedicineModal(mode: 'create' | 'update', templateRef: any, data: any = null): void {
    this.modalMode = mode;

    if (mode === 'create') {
      this.medicineForm = this.fb.group({
        name: ['', [Validators.required]],
        barcode: ['', [Validators.required]],
        describemedicine: ['']
      });
    } else if (mode === 'update' && data) {
      this.medicineForm = this.fb.group({
        id: [data.id],
        name: [data.name, [Validators.required]],
        barcode: [data.barcode, [Validators.required]],
        describemedicine: [data.describemedicine]
      });
    }

    this.modalRef = this.modal.create({
      nzTitle: mode === 'create' ? 'Thêm mới thuốc' : 'Cập nhật thông tin thuốc',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  onSubmitMedicine(): void {
    if (this.medicineForm.invalid) {
      Object.values(this.medicineForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formData = this.medicineForm.value;

    if (this.modalMode === 'create') {
      this.medicineService.createMedicine(formData).subscribe({
        next: () => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Thêm mới thuốc thành công'
          });
          this.fetchMedicines();
          this.closeModal();
        },
        error: (err) => {
          console.error('Lỗi khi thêm thuốc:', err);
          this.closeModal();
        }
      });
    } else {
      this.medicineService.updateMedicine(formData.id, formData).subscribe({
        next: () => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Cập nhật thuốc thành công'
          });
          this.fetchMedicines();
          this.closeModal();
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật thuốc:', err);
          this.closeModal();
        }
      });
    }
  }

  openDeleteModal(data: any, templateRef: any): void {
    this.medicineToDelete = data;
    this.modalRef = this.modal.create({
      nzTitle: 'Xác nhận xóa thuốc',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  confirmDeleteMedicine(): void {
    if (!this.medicineToDelete) return;

    this.medicineService.deleteMedicine(this.medicineToDelete).subscribe({
      next: () => {
        this.fetchMedicines();
        this.medicineToDelete = null;
        this.closeModal();
      },
      error: (err) => {
        console.error('Lỗi khi xóa thuốc:', err);
        this.closeModal();
      }
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
