import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'REJECT': return 'Từ chối';
      case 'CONFIRM': return 'Chờ xác nhận';
      case 'DONE': return 'Hoàn thành';
      case 'IN_PROCESS': return 'Đang xử lý';
      case 'NORMAL': return 'Yếu';
      case 'GOOD': return 'Tốt';
      case 'ALARM': return 'Trung bình';
      default: return 'Không xác định';
    }
  }
}
