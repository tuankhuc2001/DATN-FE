import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../../services/admin-service/services.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên dịch vụ', field: 'name' },
    { header: 'Gia tiền', field: 'price' },
    { header: 'Mô tả', field: 'description' },
    // { header: 'Hình ảnh', field: 'image' }
  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(private servicesService: ServicesService) {}

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
    this.servicesService.getService().subscribe({
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
