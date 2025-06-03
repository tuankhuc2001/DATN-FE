import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../https/interceptor/auth.guard';
import { ProfilePatientComponent } from '../patient-dashboard/profile/profile.component';
import { HistoryComponent } from '../patient-dashboard/history/history.component';
import { ProfileDoctorComponent } from '../docter-dashboard/profile/profile.component';
import { ScheduleComponent } from '../docter-dashboard/schedule/schedule.component';
import { HealthRecordComponent } from '../patient-dashboard/health-record/health-record.component';
import { ScheduleServiceComponent } from '../patient-dashboard/schedule/schedule.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      //patient
      { path: 'patient', component: ProfilePatientComponent, },
      { path: 'history', component: HistoryComponent, },
      { path: 'health-record', component: HealthRecordComponent, },
      { path: 'schedule', component: ScheduleServiceComponent, },


      //doctor
      { path: 'doctor', component: ProfileDoctorComponent, },
      { path: 'doctor-schedule', component: ScheduleComponent, },

      {
        path: 'admin',
        loadChildren: () =>
          import('../admin-dashboard/admin.module').then(
            (m) => m.AdminModule,
          ),
        data: {},
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
