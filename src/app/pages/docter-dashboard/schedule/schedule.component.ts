import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { IScheduleEvent } from '../models/interface';
import { DoctorService } from '../../../services/doctor-service/doctor.service';
import { UserInformationService } from '../../../services/userInformationService.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedule: IScheduleEvent[] = [];
  selectedDate: dayjs.Dayjs | null = null;
  isModalVisible = false;
  userInformation: any;

  constructor(
    // private modal: NzModalService,
    private userService: UserInformationService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.userInformation = this.userService.getAccount();
    this.fetchSchedule();
  }

  fetchSchedule(): void {
    this.doctorService.getMedicalAppointment(this.userInformation.id).subscribe({
      next: (res) => {
        console.log(res, 'this.res');

        if (res?.code === 200 && res?.data) {
          this.schedule = res.data
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải hồ sơ:", err);
      }
    });
  }

  getListData(date: any) {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    const eventsForDateRaw = this.schedule.filter((event: any) => {
      const testDateStr = String(event.testDate);
      return dayjs(testDateStr).format('YYYY-MM-DD') === formattedDate;
    });

    return eventsForDateRaw.map((event: any) => ({
      type: 'success',
      content: event.patient.fullName,
      patient: event.patient,
      testDate: event.testDate
    }));
  }
  
  

  dateCellRender(value: dayjs.Dayjs): any {
    if (value.isBefore(dayjs(), 'day')) {
      return null;
    }
    const listData = this.getListData(value);
    // return listData.length ? listData.map(item => `<nz-badge [nzStatus]="${item.type}" [nzText]="${item.content}"></nz-badge>`).join('') : null;
  }

  handleDateClick(value: any): void {
    this.selectedDate = value;
    const eventsForDate = this.getListData(value);
    // if (eventsForDate.length > 0) {
    //   this.isModalVisible = true;
    // }
  }

  handleModalClose(): void {
    this.isModalVisible = false;
    this.selectedDate = null;
  }

}
