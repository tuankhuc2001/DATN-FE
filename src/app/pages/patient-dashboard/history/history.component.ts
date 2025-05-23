// history.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { format } from 'date-fns';
import { UserInformationService } from '../../../services/userInformationService.service';
import { HistoryService } from '../../../services/patient-service/history.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusResponse } from '../../../shared/models/enums';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  historyInfo: any[] = [];
  selectedOrderId: number | null = null;
  userInformation: any;
  panels: any[] = [];

  constructor(
    private http: HttpClient,
    private userService: UserInformationService,
    private historyService: HistoryService,
    private notificationService: NotificationService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.userInformation = this.userService.getAccount();
    if (this.userInformation) {
      this.historyService.getHistory(this.userInformation.id).subscribe({
        next: (res) => {
          this.historyInfo = res.data
          if (res.data && Array.isArray(res.data) && res.data.length) {
            this.panels = res.data
              .filter((item: any) => Array.isArray(item.results) && item.results.length)
              .map((item: any, index: number) => ({
                id: item.id,
                active: index === 0,
                disabled: false,
                name: this.formatDate(item.results[0].ordertoPrescription.createdAt),
                status: item.status
              }));
          }
        },
        error: (err: any) => {
          console.error('Lỗi khi lấy lịch sử:', err);
        }
      });
    }
  }


  openCancelModal(orderId: number, event: Event): void {
    event.stopPropagation();
    this.selectedOrderId = orderId;
    this.modal.confirm({
      nzTitle: 'Xác nhận hủy đặt lịch',
      nzContent: 'Bạn có chắc chắn muốn hủy đặt lịch này không?',
      nzOkText: 'Xác nhận',
      nzCancelText: 'Hủy',
      nzOnOk: () => this.deleteOrder()
    });
  }

  deleteOrder(): void {
    console.log('here');
    console.log(this.selectedOrderId, 'lú');
    

    if (this.selectedOrderId) {
      console.log('hi');
      
      this.historyService.deleteOrder(this.selectedOrderId).subscribe({
        next: (res) => {
          this.notificationService.showNotification({
            severity: StatusResponse.SUCCESS,
            message: res.message
          });
          this.fetchOrders()
        },
        error: (err) => {

        },
      })
    }
  }

  formatDate(date: string): string {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  }
}
