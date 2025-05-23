import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/admin-service/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Ngày khám', field: 'testDate' },
    { header: 'Email', field: 'email' },
    { header: 'Số điện thoại', field: 'phone' },
    { header: 'Địa chỉ', field: 'address' },
    { header: 'Giới tính', field: 'gender' },
    { header: 'Ngày sinh', field: 'dateOfBirth' }
  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
    this.orderService.getOrder().subscribe({
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
