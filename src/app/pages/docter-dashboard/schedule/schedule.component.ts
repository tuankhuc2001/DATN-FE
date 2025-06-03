import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { IScheduleEvent } from '../models/interface';
import { DoctorService } from '../../../services/doctor-service/doctor.service';
import { UserInformationService } from '../../../services/userInformationService.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedule: any[] = [];
  selectedDate: Date = new Date();

  selectedEvents: any[] = [];
  modalRef!: NzModalRef;
  userInformation: any;

  @ViewChild('viewSchedule', { static: true }) viewScheduleTemplate!: TemplateRef<any>;
  @ViewChild('dateCellRender', { static: true }) dateCellRenderTemplate!: TemplateRef<any>;

  constructor(
    private userService: UserInformationService,
    private doctorService: DoctorService,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.userInformation = this.userService.getAccount();
    this.fetchSchedule();
  }

  fetchSchedule(): void {
    this.doctorService.getMedicalAppointment(this.userInformation.id).subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.schedule = res.data.filter((item: any) => {
            const testDate = dayjs(item.testDate);
            const todayStart = dayjs().startOf('day');
            return item.status === 'IN_PROCESS' && testDate.isAfter(todayStart);
          });
          this.cdr.detectChanges();
          console.log(this.schedule, 'this.schedule');

        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải lịch khám:", err);
      }
    });
  }


  getListData(date: Date): any[] {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return this.schedule
      .filter((event: any) =>
        dayjs(event.testDate).format('YYYY-MM-DD') === formattedDate
      )
      .map((event: any) => ({
        ...event,
        type: 'success',
        content: event.patient?.fullName || 'Chưa có tên'
      }));
  }


  handleDateClick(value: Date): void {
    this.selectedDate = value;
    const eventsForDate = this.getListData(value);
    if (eventsForDate.length > 0) {
      this.selectedEvents = eventsForDate;
      this.openModal();
    } else {
      this.selectedEvents = [];
    }
  }


showModalPhysical(event: any) {
  this.handleModalClose();
  this.router.navigate(['/dashboard/modal-physical-examination'], {
    state: { eventData: event }
  });
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
    // this.selectedDate = null;
    this.selectedEvents = [];
  }
}
