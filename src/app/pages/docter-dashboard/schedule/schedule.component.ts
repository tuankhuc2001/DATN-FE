import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { IScheduleEvent } from '../models/interface';
import { DoctorService } from '../../../services/doctor-service/doctor.service';
import { UserInformationService } from '../../../services/userInformationService.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedule: IScheduleEvent[] = [];
  selectedDate: dayjs.Dayjs | null = null;
  selectedEvents: any[] = [];
  modalRef!: NzModalRef;
  userInformation: any;

  @ViewChild('viewSchedule', { static: true }) viewScheduleTemplate!: TemplateRef<any>;

  constructor(
    private userService: UserInformationService,
    private doctorService: DoctorService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.userInformation = this.userService.getAccount();
    this.fetchSchedule();
  }

  fetchSchedule(): void {
    this.doctorService.getMedicalAppointment(this.userInformation.id).subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.schedule = res.data;
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải lịch khám:", err);
      }
    });
  }

  getListData(date: any): any[] {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const eventsForDate = this.schedule.filter((event: any) => {
      return dayjs(event.testDate).format('YYYY-MM-DD') === formattedDate;
    });

    return eventsForDate.map((event: any) => ({
      type: 'success',
      content: event.patient.fullName,
      patient: event.patient,
      testDate: event.testDate
    }));
  }

handleDateClick(value: any): void {
  console.log('here');
  
  this.selectedDate = dayjs(value);
  const eventsForDate = this.getListData(value);

  // if (eventsForDate.length > 0) {
    this.selectedEvents = eventsForDate;
    this.openModal();
  // }
}


  opentViewSchedule(event?: any): void {
    if (event?.testDate) {
      this.selectedDate = dayjs(event.testDate);
      this.selectedEvents = [event];
    }

    this.openModal();
  }

  openModal(): void {
    this.modalRef = this.modal.info({
      nzTitle: 'Thông tin lịch khám',
      nzContent: this.viewScheduleTemplate,
      nzFooter: null,
      nzStyle: { 'min-width': '60%' }
    });
  }

  handleModalClose(): void {
    this.modalRef?.destroy();
    this.selectedDate = null;
    this.selectedEvents = [];
  }
}
