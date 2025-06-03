import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientManageComponent } from './patient-manage/patient-manage.component';
import { PatientRecordsComponent } from './patient-records/patient-records.component';
import { DoctorManageComponent } from './doctor-manage/doctor-manage.component';
import { OrderComponent } from './order/order.component';
import { FacilityComponent } from './facility/facility.component';
import { ServiceComponent } from './service/service.component';
import { MedicineComponent } from './medicine/medicine.component';
import { RevenueComponent } from './revenue/revenue.component';

const routes: Routes = [
    {
      path: 'patient-manage',
      component: PatientManageComponent,
    },
    {
      path: 'patient-records',
      component: PatientRecordsComponent,
    },
    {
      path: 'doctor-manage',
      component: DoctorManageComponent,
    },
    {
      path: 'order',
      component: OrderComponent,
    },
    {
      path: 'facility',
      component: FacilityComponent,
    },
    {
      path: 'service',
      component: ServiceComponent,
    },
    {
      path: 'medicine',
      component: MedicineComponent,
    },
        {
      path: 'revenue',
      component: RevenueComponent,
    },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class AdminRoutingModule { }
