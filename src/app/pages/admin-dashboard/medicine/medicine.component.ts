import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../../services/admin-service/medicine.service';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit {
  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên Thuốc', field: 'name' },
    { header: 'Mô tả', field: 'describemedicine' },
    { header: 'Số lượng', field: 'barcode' },
    { header: 'Hành động', field: 'action', width: '150px' }

  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;
  pageIndex = 1;
  updateForm!: FormGroup;
  modalRef!: NzModalRef;

  constructor(
    private medicineService: MedicineService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
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
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách bệnh nhân:", err);
      }
    });
  }

  onTablePageChange(page: number) {
    this.pageIndex = page;
  }

  openUpdateModal(data: any, templateRef: any) {
    this.updateForm = this.fb.group({
      id: [data.id],
      address: [data.address],
      gender: [data.gender],
      dateOfBirth: [data.dateOfBirth]
    });

    this.modalRef = this.modal.create({
      nzTitle: 'Cập nhật thông tin bệnh nhân',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  submitUpdate() {
    if (this.updateForm.valid) {
      const updatedData = this.updateForm.value;
      this.medicineService.updateMedicine(updatedData.id, updatedData).subscribe({
        next: () => {
          console.log('Cập nhật thành công');
          this.fetchPatients();
          this.closeModal();
        },
        error: (err) => console.error('Lỗi khi cập nhật:', err)
      });
    } else {
      console.error('Form không hợp lệ');
      Object.values(this.updateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
