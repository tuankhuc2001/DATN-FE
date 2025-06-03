import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  revenueColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên dịch vụ', field: 'name' },
    { header: 'Giá tiền (VNĐ)', field: 'price' },
    { header: 'Số lượt sử dụng', field: 'usage' },
    { header: 'Tổng doanh thu (VNĐ)', field: 'total' }
  ];

  // Mock dữ liệu có thêm tháng và năm
  rawRevenueData = [
    { name: 'Khám tổng quát', price: 500000, usage: 20, month: 6, year: 2025 },
    { name: 'Xét nghiệm máu', price: 300000, usage: 35, month: 6, year: 2025 },
    { name: 'Chụp X-quang', price: 400000, usage: 15, month: 5, year: 2025 },
    { name: 'Tư vấn chuyên khoa', price: 700000, usage: 10, month: 5, year: 2024 },
    { name: 'Khám theo yêu cầu', price: 1000000, usage: 5, month: 4, year: 2024 }
  ];

  revenueData: any[] = [];
  totalRevenue = 0;

  // Danh sách tháng và năm
  monthList = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`
  }));

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  yearList = [this.currentYear - 1, this.currentYear]; // có thể thêm nhiều hơn nếu muốn

  // FormControl cho bộ lọc
  monthControl = new FormControl(this.currentMonth);
  yearControl = new FormControl(this.currentYear);

  ngOnInit(): void {
    this.monthControl.valueChanges.subscribe(() => this.filterByMonthYear());
    this.yearControl.valueChanges.subscribe(() => this.filterByMonthYear());

    this.filterByMonthYear(); // gọi lần đầu
  }

  filterByMonthYear(): void {
    const month = this.monthControl.value;
    const year = this.yearControl.value;

    const filtered = this.rawRevenueData.filter(
      item => item.month === month && item.year === year
    );

    this.revenueData = filtered.map((item, index) => ({
      stt: index + 1,
      ...item,
      total: item.price * item.usage
    }));

    this.totalRevenue = this.revenueData.reduce((sum, item) => sum + item.total, 0);
  }

  isFutureMonth(month: number): boolean {
    const selectedYear = this.yearControl.value!;
    return (
      selectedYear > this.currentYear ||
      (selectedYear === this.currentYear && month > this.currentMonth)
    );
  }
}
