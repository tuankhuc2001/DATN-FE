import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';


import { ProfilePatientComponent } from '../patient-dashboard/profile/profile.component';
import { HistoryComponent } from '../patient-dashboard/history/history.component';
import { StatusLabelPipe } from '../../shared/pipe/status-label.pipe';
import { StatusColorPipe } from '../../shared/pipe/status-color.pipe';
import { ProfileDoctorComponent } from '../docter-dashboard/profile/profile.component';
import { ScheduleComponent } from '../docter-dashboard/schedule/schedule.component';
import { HealthRecordComponent } from '../patient-dashboard/health-record/health-record.component';
import { UiCommonModule } from '../../shared/ui-common/ui-common.module';
import { ScheduleServiceComponent } from '../patient-dashboard/schedule/schedule.component';

@NgModule({
  declarations: [
    DashboardComponent,
    // TableCommonComponent,

    //Patient
    ProfilePatientComponent,
    HistoryComponent,
    HealthRecordComponent,
    ScheduleServiceComponent,

    //Doctor
    ProfileDoctorComponent,
    ScheduleComponent,



    StatusLabelPipe,
    StatusColorPipe
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    UiCommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzTabsModule,
    NzRadioModule,
    NzDatePickerModule,
    RouterModule,
    NzAvatarModule,
    NzDropDownModule,
    NzTagModule,
    NzCollapseModule,
    NzCalendarModule,
    NzBadgeModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzCardModule,
    NzSelectModule
  ]
})
export class DashboardModule { }
