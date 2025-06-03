import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderService } from '../../../../services/admin-service/order.service';
import { MedicineService } from '../../../../services/admin-service/medicine.service';
import { DoctorService } from '../../../../services/doctor-service/doctor.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusResponse } from '../../../../shared/models/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-detail',
  templateUrl: './modal-physical-examination.component.html',
  styleUrls: ['./modal-physical-examination.component.scss']
})
export class ModalPhysicalExaminationComponent implements OnInit {
  orderDetail: any;
  orderId: any;
  resultId: any

  prescriptionForm!: FormGroup;
  medicineList: any[] = [];
  result: any
  prescription: any
  disableEdit: boolean = false;
  disablePrescription: boolean = false;


  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private orderService: OrderService,
    private medicineService: MedicineService,
    private doctorService: DoctorService,
    private notificationService: NotificationService,
    private router: Router,


  ) { }

  ngOnInit(): void {
    this.orderId = history.state.eventData?.id;
    this.initForm();
    this.fetchOrderDetail();
    this.fetchMedicines();
  }

  // Khởi tạo form toa thuốc
  initForm(): void {
    this.prescriptionForm = this.fb.group({
      prescriptionItems: this.fb.array([])
    });
  }

  get prescriptionItems(): FormArray {
    return this.prescriptionForm.get('prescriptionItems') as FormArray;
  }

  addPrescriptionItem(): void {
    const item = this.fb.group({
      medicineId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      times: ['']
    });
    this.prescriptionItems.push(item);
  }

  removePrescriptionItem(index: number): void {
    this.prescriptionItems.removeAt(index);
  }

  // Gọi API lấy chi tiết đơn khám và xử lý gán dữ liệu
  fetchOrderDetail(): void {
    this.orderService.getOrderDetail(this.orderId).subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.orderDetail = res.data;
          this.resultId = res.data?.results[0].id


          // Gán toa thuốc nếu có
          if (this.orderDetail.prescription?.length) {
            const prescriptionArray = this.orderDetail.prescription.map((item: any) =>
              this.fb.group({
                medicineId: [item.medicineId, Validators.required],
                quantity: [item.quantity, [Validators.required, Validators.min(1)]],
                times: [item.times || '']
              })
            );
            this.prescriptionForm.setControl('prescriptionItems', this.fb.array(prescriptionArray));
          }

          // Khóa form nếu đã hoàn thành
          this.disableEdit = this.orderDetail.status === 'COMPLETED';
        } else {
          this.message.error('Không tìm thấy chi tiết đơn khám.');
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải chi tiết đơn khám:", err);
        this.message.error('Đã xảy ra lỗi khi tải chi tiết đơn khám.');
      }
    });
  }

  fetchMedicines(): void {
    this.medicineService.getMedicine().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.medicineList = res.data; // Gán dữ liệu trả về
        }
      },
      error: (err) => {
        console.error("Lỗi khi tải danh sách thuốc:", err);
      }
    });
  }

  submitPrescription(callback?: () => void): void {
    if (this.prescriptionForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ thông tin toa thuốc.');
      return;
    }
    
    
const prescriptionPayload = {
  prescriptionItems: this.prescriptionForm.value.prescriptionItems.map((item: any) => ({
    medicineId: item.medicineId,
    quantity: item.quantity,
    times: item.times || ''
  }))
};
    console.log(prescriptionPayload, 'this.prescriptionPayload');

    this.doctorService.addPrescription(this.orderId, prescriptionPayload).subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Lưu toa thuốc thành công thành công'
          });
          this.disablePrescription = true;
        }
      },
      error: (err) => {
        console.error("Lỗi khi tải danh sách thuốc:", err);
      }
    });

    if (callback) callback();
  }

  // Lưu kết quả
  handleSubmitAll(callback?: () => void): void {
    const resultsPayload = this.orderDetail.results.map((item: any) => {
      return {
        id: this.resultId,
        level: item.level.toUpperCase(),
        value: item.value,
        comment: item.comment
      };
    });

    this.doctorService.addResult(this.orderId, resultsPayload).subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: 'Lưu kết quả thành công'
          });
          this.disableEdit = true;
        }
      },
      error: (err) => {
        console.error("Lỗi khi tải danh sách thuốc:", err);
      }
    });

    if (callback) callback();
  }

  // Hoàn thành toàn bộ
  handleComplete(): void {
    this.submitPrescription(() => {
      this.handleSubmitAll(() => {

        this.doctorService.submitResult(this.orderId).subscribe({
          next: (res) => {
            if (res?.code === 200 && res?.data) {
              this.router.navigate(['/dashboard/doctor-schedule']);
              this.notificationService.showNotification({
                severity: StatusResponse.SUCCESS,
                message: 'Hoàn thành khám'
              });
              this.disableEdit = true;
            }
          },
          error: (err) => {
            console.error("Lỗi khi tải danh sách thuốc:", err);
          }
        });
        this.disableEdit = true;
      });
    });
  }

  // Cập nhật dữ liệu kết quả khám
  handleOnChangeResult(value: any, index: number, field: 'level' | 'value' | 'comment'): void {
    this.orderDetail.results[index][field] = value;
  }

  back(): void {
    window.history.back();
  }
}
