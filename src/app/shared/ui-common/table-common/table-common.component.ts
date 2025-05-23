import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-common',
  templateUrl: './table-common.component.html',
  styleUrls: ['./table-common.component.scss']
})
export class TableCommonComponent implements OnInit, OnChanges {
  @Input() columns: { header: string; field: string; width?: string }[] = []; 
  @Input() listOfData: any[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>(); 
  @Output() updateAction = new EventEmitter<any>(); 
  @Output() deleteAction = new EventEmitter<number>();

  pageIndex: number = 1;
  displayData: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.updateDisplayData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Kiểm tra nếu listOfData thay đổi
    if (changes['listOfData']) {
      console.log('List of data đã thay đổi', changes['listOfData'].currentValue);
      this.updateDisplayData(); // Cập nhật lại dữ liệu khi listOfData thay đổi
    }
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.pageChange.emit(page);
    this.updateDisplayData();
  }

  updateDisplayData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.displayData = this.listOfData.slice(startIndex, endIndex);
  }

  onUpdate(data: any) {
    this.updateAction.emit(data);
  }

  onDelete(id: number) {
    this.deleteAction.emit(id);
  }
}
