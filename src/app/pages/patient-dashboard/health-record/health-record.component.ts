import { Component, OnInit } from '@angular/core';
import { HealthRecordService } from '../../../services/patient-service/health-record.service';
import { UserInformationService } from '../../../services/userInformationService.service';

@Component({
  selector: 'app-health-record',
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.css']
})
export class HealthRecordComponent implements OnInit {

  tableColumns = [
    { header: 'ID', field: 'id', width: '100px' },
    { header: 'Tên', field: 'name', width: '200px' },
    { header: 'Email', field: 'email' }
  ];

  tableData = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com' },
    { id: 2, name: 'Trần Thị B', email: 'b@example.com' },
    { id: 3, name: 'Lê Văn C', email: 'c@example.com' }
  ];

  totalRecords = this.tableData.length; // Tổng số bản ghi

  userInformation: any;

  constructor(
    private healthRecordService: HealthRecordService,
    private userService: UserInformationService,
  ) { }

  ngOnInit() {
    this.userInformation = this.userService.getAccount();

  }

  loadProfile() {
      if (this.userInformation) {
        this.healthRecordService.getHealthRecord(this.userInformation.id).subscribe({
          next: (res) => {
            if (res?.code === 201 && res?.data) {
              // map dữ liệu
            }
          },
          error: (err: any) => {
            console.error("Lỗi khi tải hồ sơ:", err);
          }
        });
      }
    }
}
