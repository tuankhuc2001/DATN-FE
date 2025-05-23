import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor'
})
// định nghĩa lại đầu ra kiểu dữ liệu
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'REJECT': return '#ff4d4f';
      case 'CONFIRM': return 'red';
      case 'DONE': return 'green';
      case 'IN_PROCESS': return 'yellow';
      case 'NORMAL': return 'red';
      case 'GOOD': return 'green';
      case 'ALARM': return 'red';
      default: return 'gray';
    }
  }
}
