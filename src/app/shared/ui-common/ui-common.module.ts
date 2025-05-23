import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCommonComponent } from './table-common/table-common.component';
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
@NgModule({
  declarations: [TableCommonComponent],
  imports: [
    CommonModule,
    NzTableModule,
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
        NzPaginationModule,
        NzInputModule
  ],
  exports: [TableCommonComponent]
})
export class UiCommonModule {}
