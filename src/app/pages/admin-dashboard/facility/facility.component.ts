import { Component, OnInit } from '@angular/core';
import { FacilityService } from '../../../services/admin-service/facility.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {
  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên bện viện', field: 'facility_name' },
    { header: 'Số điện thoại', field: 'phone' },
    { header: 'Địa chỉ', field: 'address' },
    { header: 'Tên giám đốc', field: 'president' },
    
  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(private facilityService: FacilityService) {}

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
    this.facilityService.getFacility().subscribe({
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
