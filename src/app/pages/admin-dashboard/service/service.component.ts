import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { ServicesService } from '../../../services/admin-service/services.service';
import { FacilityService } from '../../../services/admin-service/facility.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  @ViewChild('serviceModal', { static: true }) serviceModalTemplate!: any;

  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Hình ảnh', field: 'image' },

    { header: 'Tên dịch vụ', field: 'name' },
    { header: 'Khoa', field: 'facility_name' },

    { header: 'Giá tiền', field: 'price' },
    { header: 'Mô tả', field: 'description' },
    { header: 'Hành động', field: 'action', type: ['update', 'delete'] }
  ];

  serviceForm!: FormGroup;
  fullTableData: any[] = [];
  listFacility: any[] = [];
  selectedImage: string | null = null;

  pageSize = 10;
  totalRecords = 0;
  modalRef!: NzModalRef;
  isEditMode = false;

  @ViewChild('confirmDeleteModal', { static: true }) confirmDeleteModalTemplate!: any;
  serviceToDelete: any = null;


  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private facilityService: FacilityService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchServices();
    this.fetchFacilities();
  }

  initForm() {
    this.serviceForm = this.fb.group({
      id: [null],
      name: [''],
      price: [''],
      description: [''],
      image: [null],
      facilityac_id: [null]
    });
  }

  fetchServices() {
    this.servicesService.getService().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.fullTableData = res.data.map((item: any, index: number) => {
            const imageBase64 = item.image?.startsWith('data:image')
              ? item.image
              : `data:image/jpeg;base64,${item.image}`;

            item.facility_name = item.facility.facility_name
            return {
              ...item,
              stt: index + 1,
              image: imageBase64
            };
          });
          this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách dịch vụ:', err);
      }
    });
  }

  fetchFacilities() {
    this.facilityService.getFacility().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.listFacility = res.data;
        }
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách khoa:', err);
      }
    });
  }
  openModal(data: any = null) {
    this.isEditMode = !!data;

    if (this.isEditMode) {
      const patchedData = {
        ...data,
        facilityac_id: data.facility?.id || data.facilityac_id || null,
      };
      this.serviceForm.patchValue(patchedData);
      this.selectedImage = data.image || null;
    } else {
      this.serviceForm.reset();
      this.selectedImage = null;
    }

    this.modalRef = this.modal.create({
      nzTitle: this.isEditMode ? 'Cập nhật dịch vụ' : 'Thêm mới dịch vụ',
      nzContent: this.serviceModalTemplate,
      nzFooter: null
    });
  }


  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.serviceForm.patchValue({ image: this.selectedImage });
      };
      reader.readAsDataURL(file);
    }
  }

  submitServiceForm() {
    if (this.serviceForm.valid) {
      const formData = this.serviceForm.value;
      if (this.isEditMode) {
        this.servicesService.updateService(formData, formData.id).subscribe({
          next: () => {
            this.fetchServices();
            this.closeModal();
          },
          error: (err) => console.error('Lỗi cập nhật dịch vụ:', err)
        });
      } else {
        this.servicesService.createService(formData).subscribe({
          next: () => {
            this.fetchServices();
            this.closeModal();
          },
          error: (err) => console.error('Lỗi thêm dịch vụ:', err)
        });
      }
    } else {
      Object.values(this.serviceForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }

  onTablePageChange(page: number) {
    console.log('Trang hiện tại:', page);
  }

openDeleteModal(service: any): void {
  this.serviceToDelete = service;

  this.modalRef = this.modal.create({
    nzTitle: 'Xác nhận xóa',
    nzContent: this.confirmDeleteModalTemplate,
    nzFooter: null
  });
}

deleteService(): void {
  const id = this.serviceToDelete?.id || this.serviceToDelete;
  if (id) {
    this.servicesService.deleteService(id).subscribe({
      next: () => {
        this.fetchServices();
        this.serviceToDelete = null;
        this.closeModal(); // Đóng modal
      },
      error: (err) => {
        console.error('Lỗi khi xóa dịch vụ:', err);
        this.closeModal();
      }
    });
  }
}


}
