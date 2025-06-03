import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ScheduleService } from '../../../services/patient-service/schedule.service';
import { StatusResponse } from '../../../shared/models/enums';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ServicesService } from '../../../services/admin-service/services.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { IUser } from '../../dashboard/model/interface';
import { AuthService } from '../../../services/auth.service';
import { DoctorManageService } from '../../../services/admin-service/doctor-manage.service';
import { OrderService } from '../../../services/admin-service/order.service';
import { FacilityService } from '../../../services/admin-service/facility.service';

dayjs.extend(utc);

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
  allDoctors: any[] = [];
  userInfo: IUser | null = null;
  order: any[] = [];
  selectedService: any;
  selectedFacilityName: string = '';
  isModalVisible = false;
  modalRef!: NzModalRef;
  unavailableTimes: Date[] = [];
  currentDisabledTimeFn: () => any = () => ({});

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private doctorManageService: DoctorManageService,
    private notificationService: NzNotificationService,
    private servicesService: ServicesService,
    private modal: NzModalService,
    private authService: AuthService,
    private orderService: OrderService,
    private facilityService: FacilityService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.fetchFacilities();
    this.fetchServices();
    this.fetchDoctor();
    this.fetchOrder();
  }

  fetchFacilities() {
    this.facilityService.getFacility().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.facility = res.data;
        }
      },
      error: (err: any) => console.error("Lỗi khi tải danh sách khoa:", err)
    });
  }

  fetchOrder() {
    this.orderService.getOrder().subscribe({
      next: (res) => {
        if (res?.code === 201 && res?.data) {
          this.order = res.data.map((item: any, index: number) => ({ ...item, stt: index + 1 }));
        }
      },
      error: (err: any) => console.error("Lỗi khi tải danh sách bệnh nhân:", err)
    });
  }

  fetchServices() {
    this.servicesService.getServiceInFacility().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.service = res.data.map((item: any, index: number) => ({ ...item, stt: index + 1 }));
        }
      },
      error: (err: any) => console.error("Lỗi khi tải danh sách dịch vụ:", err)
    });
  }

  fetchDoctor() {
    this.doctorManageService.getDoctor().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.allDoctors = res.data;
          this.doctor = res.data;
        }
      },
      error: (err) => console.error("Lỗi khi tải danh sách bác sĩ", err)
    });
  }

  handleFacilityChange(value: string): void {
    if (value === 'all') {
      this.fetchServices();
    } else {
      this.service = this.service.filter(s => s.facility?.id === +value);
    }
  }

  handleCardClick(service: any, templateRef: any): void {
    this.doctor = this.allDoctors.filter((item: any) => item.service.id === service?.id);
    this.selectedService = service;
    this.selectedFacilityName = service.facility?.facility_name || '';
    this.isModalVisible = true;

    this.scheduleForm = this.fb.group({
      doctorId: [null, Validators.required],
      testDate: [null, Validators.required],
      note: ['']
    });

    this.scheduleForm.get('doctorId')?.valueChanges.subscribe(() => this.updateDisabledTimeFn());
    this.scheduleForm.get('testDate')?.valueChanges.subscribe(() => this.updateDisabledTimeFn());

    this.modalRef = this.modal.create({
      nzTitle: 'Đặt lịch',
      nzContent: templateRef,
      nzFooter: null
    });
  }

  handleCancel(): void {
    if (this.modalRef) this.modalRef.destroy();
    this.scheduleForm.reset();
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const formValues = {
      testDate: dayjs(this.scheduleForm.value.testDate).toISOString(),
      doctorId: this.scheduleForm.value.doctorId,
      services: [this.selectedService?.id],
      facilityod_id: this.selectedService?.facility?.id || '',
      note: this.scheduleForm.value.note || '',
      patientId: this.userInfo!.id
    };

    this.scheduleService.scheduleService(formValues).subscribe({
      next: (res) => {
        this.notificationService.success(StatusResponse.SUCCESS, res?.data?.message || 'Đặt lịch thành công');
        this.fetchOrder();
        this.handleCancel();
      },
      error: (err) => {
        console.error('Lỗi khi gửi lịch:', err);
        this.notificationService.error('Lỗi', 'Đặt lịch thất bại. Vui lòng thử lại.');
      }
    });
  }

  disabledDate = (current: Date): boolean => current && current < dayjs().startOf('day').toDate();

  updateDisabledTimeFn(): void {
    const selectedDoctorId = this.scheduleForm?.get('doctorId')?.value;
    const selectedDate = this.scheduleForm?.get('testDate')?.value;

    if (!selectedDoctorId || !selectedDate) {
      this.currentDisabledTimeFn = () => ({});
      return;
    }

    const selectedDay = dayjs(selectedDate).startOf('day');
    const workingHours = Array.from({ length: 24 }, (_, i) => i).filter(h => h < 8 || h >= 17);
    const unavailable: Date[] = [];

    const doctorOrders = this.order.filter(order => order.doctor?.id === selectedDoctorId);

    doctorOrders.forEach(order => {
      const orderTime = dayjs.utc(order.testDate).local();
      const orderStart = orderTime.subtract(1, 'hour');

      for (let m = 0; m < 120; m += 5) {
        const blockedTime = orderStart.add(m, 'minute').toDate();
        if (dayjs(blockedTime).isSame(selectedDay, 'day')) {
          unavailable.push(blockedTime);
        }
      }
    });

    this.unavailableTimes = unavailable;

    const doctorUnavailableHours = [
      ...new Set(
        unavailable
          .filter(time => dayjs(time).isSame(selectedDay, 'day'))
          .map(time => time.getHours())
      )
    ];

    this.currentDisabledTimeFn = () => ({
      nzDisabledHours: () => Array.from(new Set([...workingHours, ...doctorUnavailableHours])),
      nzDisabledMinutes: (selectedHour: number) => {
        const minutesToDisable: number[] = [];
        this.unavailableTimes.forEach(time => {
          if (time.getHours() === selectedHour && dayjs(time).isSame(selectedDay, 'day')) {
            minutesToDisable.push(time.getMinutes());
          }
        });
        return minutesToDisable;
      }
    });
  }

  get disabledDateTime(): () => any {
    return this.currentDisabledTimeFn;
  }
}
