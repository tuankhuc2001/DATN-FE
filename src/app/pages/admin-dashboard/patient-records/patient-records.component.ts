import { Component, OnInit } from '@angular/core';
import { PatientRecordService } from '../../../services/admin-service/patient-record.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-patient-records',
  templateUrl: './patient-records.component.html',
  styleUrls: ['./patient-records.component.css']
})
export class PatientRecordsComponent implements OnInit {

  modalRef!: NzModalRef;

  // Cột cho bảng danh sách bệnh nhân
  tableColumns = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Tên người dùng', field: 'fullName' },
    { header: 'Email', field: 'email' },
    { header: 'Số điện thoại', field: 'phone' },
    { header: 'Địa chỉ', field: 'address' },
    { header: 'Giới tính', field: 'gender' },
    { header: 'Ngày sinh', field: 'dateOfBirth' },
    { header: 'Hành động', field: 'action', type: ['view'] },
  ];

  // Cột cho bảng chi tiết hồ sơ bệnh nhân trong modal
  tableColumnResult = [
    { header: 'STT', field: 'stt', width: '60px' },
    { header: 'Bệnh viện', field: 'facility_name' },
    { header: 'Dịch vụ', field: 'service_name' },
    { header: 'Bác sĩ', field: 'doctor_name' },
    { header: 'Ngày khám', field: 'testDate' },
    { header: 'Kết luận', field: 'comment' },
    { header: 'Phân tích', field: 'value' },
    { header: 'Mức độ', field: 'level', type: ['view'] },
  ];

  fullTableData: any[] = [];            // Dữ liệu bảng bệnh nhân
  resultKh: any[] = [];                 // Dữ liệu bảng chi tiết (theo từng bệnh nhân)

  pageSize = 10;
  totalRecords = 0;                     // Tổng số bệnh nhân
  totalRecordsResultKh = 0;             // Tổng số bản ghi chi tiết trong modal

  constructor(
    private patientRecordService: PatientRecordService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.fetchPatients();
  }

  // Lấy danh sách bệnh nhân
  fetchPatients() {
    this.patientRecordService.getPatient().subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.data) {
          const sortedData = res.data.sort((a: any, b: any) => a.id - b.id);
          this.fullTableData = sortedData.map((item: any, index: number) => ({
            ...item,
            stt: index + 1,
            orderResponses: item.orderResponses || []   // Lưu orderResponses của từng bệnh nhân
          }));
          this.totalRecords = this.fullTableData.length;
        }
      },
      error: (err: any) => {
        console.error("Lỗi khi tải danh sách bệnh nhân:", err);
      }
    });
  }

  // Mở modal chi tiết bệnh nhân
  openViewDetailModal(data: any, templateRef: any) {
    // Lấy orderResponses của bệnh nhân được chọn
    const orderResponses = data.orderResponses || [];

    // Tạo dữ liệu bảng chi tiết chỉ cho bệnh nhân này
    const resultList = orderResponses.map((response: any, index: number) => ({
      stt: index + 1,
      facility_name: response.doctor?.service?.facility?.facility_name || 'N/A',
      service_name: response.doctor?.service?.name || 'N/A',
      doctor_name: response.doctor?.fullName || 'N/A',
      testDate: response.testDate ? new Date(response.testDate).toLocaleDateString() : 'N/A',
      comment: response.results?.[0]?.comment || 'N/A',
      value: response.results?.[0]?.value || 'N/A',
      level: response.results?.[0]?.level || 'N/A',
      rawData: response
    }));

    this.resultKh = resultList;
    this.totalRecordsResultKh = this.resultKh.length;

    this.modalRef = this.modal.info({
      nzTitle: 'Chi tiết hồ sơ bệnh nhân: ' + data.fullName,
      nzContent: templateRef,
      nzFooter: null,
      nzStyle: { 'min-width': '60%' }
    });
  }

  onTablePageChange(page: number) {
    console.log('Trang hiện tại:', page);
  }

}
