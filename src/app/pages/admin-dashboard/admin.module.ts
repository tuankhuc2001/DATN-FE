import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminRoutingModule } from './admin-routing.module'
import { PatientManageComponent } from './patient-manage/patient-manage.component'
import { TableCommonComponent } from '../../shared/ui-common/table-common/table-common.component'
import { UiCommonModule } from '../../shared/ui-common/ui-common.module'
import { PatientRecordsComponent } from './patient-records/patient-records.component'
import { DoctorManageComponent } from './doctor-manage/doctor-manage.component'
import { OrderComponent } from './order/order.component'
import { FacilityComponent } from './facility/facility.component'
import { ServiceComponent } from './service/service.component'
import { MedicineComponent } from './medicine/medicine.component'
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { RevenueComponent } from './revenue/revenue.component'


@NgModule({
    declarations: [
        PatientManageComponent,
        PatientRecordsComponent,
        DoctorManageComponent,
        OrderComponent,
        FacilityComponent,
        ServiceComponent,
        MedicineComponent,
        RevenueComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        UiCommonModule,
        ReactiveFormsModule,
        NzSelectModule,
        NzDatePickerModule
    ],
    providers: [],
})
export class AdminModule {}
