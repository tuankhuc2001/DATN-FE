import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ScheduleService } from '../../../services/patient-service/schedule.service';
import { StatusResponse } from '../../../shared/models/enums';
import dayjs from 'dayjs';
import { ServicesService } from '../../../services/admin-service/services.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleServiceComponent implements OnInit {
  scheduleForm!: FormGroup;

  facility: any[] = [];
  service: any[] = []; 
  doctor: any[] = []; 

  selectedService: any;
  selectedFacilityName: string = '';
  isModalVisible = false;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private notificationService: NzNotificationService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    // Form chính dùng khi mở modal đặt lịch
    this.scheduleForm = this.fb.group({
      doctorId: [null, [Validators.required]],
      testDate: [null, [Validators.required]],
      note: ['']
    });

    this.fetchFacilities();
    this.fetchServices();
  }

  fetchFacilities() {
    // Giả lập hoặc gọi API thực tế
    this.facility = [
      { id: 1, facility_name: 'Bệnh viện A' },
      { id: 2, facility_name: 'Bệnh viện B' }
    ];
  }

  fetchServices() {
    this.servicesService.getServiceInFacility().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.service = res.data.map((item: any, index: number) => ({
            ...item,
            stt: index + 1
          }));
          console.log(this.service, 'this.fullTableData');
          
          // this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách bệnh nhân:", err);
      }
    });
  }

  handleFacilityChange(value: string): void {
    if (value === 'all') {
      this.fetchServices();
    } else {
      this.service = this.service.filter(s => s.facility?.id === +value);
    }
  }

  handleCardClick(service: any): void {
    this.selectedService = service;
    this.selectedFacilityName = service.facility?.facility_name || '';
    this.isModalVisible = true;

    // TODO: Gọi API lấy bác sĩ theo dịch vụ
    this.doctor = [
      { id: 1, fullName: 'Bác sĩ A' },
      { id: 2, fullName: 'Bác sĩ B' }
    ];
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.scheduleForm.reset();
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const formValues = {
      ...this.scheduleForm.value,
      serviceId: this.selectedService.id,
      testDate: dayjs(this.scheduleForm.value.testDate).format('DD/MM/YYYY'),
      facilityName: this.selectedFacilityName
    };

    this.scheduleService.scheduleService(formValues).subscribe({
      next: (res) => {
        this.notificationService.success(StatusResponse.SUCCESS, res?.data?.message || 'Đặt lịch thành công');
        this.handleCancel();
      },
      error: (err) => {
        console.error('Lỗi khi gửi lịch:', err);
        this.notificationService.error('Lỗi', 'Đặt lịch thất bại. Vui lòng thử lại.');
      }
    });
  }

  disabledDate = (current: Date): boolean => {
    return current && current < new Date();
  };

  disabledDateTime = (): any => {
    const now = new Date();
    return {
      nzDisabledHours: () => [...Array(24).keys()].filter(h => h < now.getHours()),
      nzDisabledMinutes: () => [...Array(60).keys()].filter(m => m < now.getMinutes())
    };
  };
}
