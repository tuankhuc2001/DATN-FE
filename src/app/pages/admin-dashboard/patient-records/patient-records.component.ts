import { Component, OnInit } from '@angular/core';
import { PatientRecordService } from '../../../services/admin-service/patient-record.service';

@Component({
  selector: 'app-patient-records',
  templateUrl: './patient-records.component.html',
  styleUrls: ['./patient-records.component.css']
})
export class PatientRecordsComponent implements OnInit {

tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên người dùng', field: 'fullName' },
    { header: 'Email', field: 'email' },
    { header: 'Số điện thoại', field: 'phone' },
    { header: 'Địa chỉ', field: 'address' },
    { header: 'Giới tính', field: 'gender' },
    { header: 'Ngày sinh', field: 'dateOfBirth' },
  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(private patientRecordService: PatientRecordService) {}

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
    this.patientRecordService.getPatient().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          this.fullTableData = res.data.map((item: any, index: number) => ({
            ...item,
            stt: index + 1
          }));
          console.log(this.fullTableData, 'this.fullTableData');
          
          this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách bệnh nhân:", err);
      }
    });
  }

  onTablePageChange(page: number) {
    console.log('Trang hiện tại:', page);
  }

}
