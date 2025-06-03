import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/admin-service/order.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../../services/notification.service';
import { StatusResponse } from '../../../shared/models/enums';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  modalRef!: NzModalRef;
  selectedRow: any = null;
  actionType: 'approve' | 'reject' | null = null;

  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Ngày khám', field: 'testDate' },
    { header: 'Ngày tạo', field: 'createdAt' },
    { header: 'Tên bênh nhân', field: 'nameP' },
    { header: 'Số điện thoại bệnh nhân', field: 'phoneP' },
    { header: 'Khoa', field: 'facilityName' },
    { header: 'Tên bác sĩ', field: 'nameD' },
    { header: 'Dịch vụ khám', field: 'service' },
    { header: 'Giá cả', field: 'price' },
    { header: 'Ghi chí', field: 'note' },


    { header: 'Trạng thái', field: 'status' },

    { header: 'Hành động', field: 'action', type: ['approve', 'reject'] },

  ];

  fullTableData: any[] = [];
  pageSize = 10;
  totalRecords = 0;

  constructor(
    private orderService: OrderService,
    private modal: NzModalService,
    private notificationService: NotificationService,


  ) { }

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
    this.orderService.getOrder().subscribe({
      next: (res) => {
        if (res?.code === 201 && res?.data) {
          this.fullTableData = res.data.map((item: any, index: number) => {
            const formatDateTime = (value: string) => {
              const date = new Date(value);
              if (isNaN(date.getTime())) return value;

              const padZero = (num: number) => num.toString().padStart(2, '0');
              const hours = padZero(date.getHours());
              const minutes = padZero(date.getMinutes());
              const day = padZero(date.getDate());
              const month = padZero(date.getMonth() + 1);
              const year = date.getFullYear();

              return `${hours}:${minutes} - ${day}/${month}/${year}`;
            };
            this.totalRecords = res.data.length;
console.log(this.totalRecords,'this.totalRecords');


            return {
              ...item,
              stt: index + 1,
              testDate: formatDateTime(item.testDate),
              createdAt: formatDateTime(item.createdAt),
              nameP: item?.patient?.fullName,
              phoneP: item?.patient?.phone,
              nameD: item?.doctor?.fullName,
              service: item?.doctor?.service?.name,
              facilityName: item?.doctor?.service?.facility?.facility_name,
              price: item?.doctor?.service?.price,
              note: item?.results[0]?.ordertoPrescription?.note

            };
          });
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
  approveAction(templateRef: any, data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow, 'this.selectedRow');

    this.actionType = 'approve';

    this.modalRef = this.modal.create({
      nzTitle: 'Xác nhận đặt lịch',
      nzContent: templateRef,
      nzFooter: null,
      nzStyle: { 'min-width': '60%' }
    });
  }

  rejectAction(templateRef: any, data: any) {
    this.selectedRow = data;
    this.actionType = 'reject';

    this.modalRef = this.modal.create({
      nzTitle: 'Xác nhận hủy lịch',
      nzContent: templateRef,
      nzFooter: null,
      nzStyle: { 'min-width': '60%' }
    });
  }

  confirmModal() {
    if (this.actionType === 'approve') {

      this.orderService.confirmOrder(this.selectedRow.id, 'approve').subscribe({
        next: (res) => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: res.message
          });
          this.fetchPatients();

        },
        error: (err: any) => {
          console.error("Lỗi :", err);
        }
      });

    } else if (this.actionType === 'reject') {

      this.orderService.confirmOrder(this.selectedRow.id, 'reject').subscribe({
        next: (res) => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: res.message
          });
          this.fetchPatients();

        },
        error: (err: any) => {
          console.error("Lỗi :", err);
        }
      });

    }

    this.closeModal();
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.destroy();
      this.selectedRow = null;
      this.actionType = null;
    }
  }

}
