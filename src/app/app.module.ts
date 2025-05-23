import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(en);

//UI
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CurrencyPipe } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

//ngx-currency
import { NgxCurrencyDirective, NgxCurrencyInputMode, provideEnvironmentNgxCurrency } from "ngx-currency";
import { LoginComponent } from './pages/login/login.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzPaginationModule,
    NzSelectModule,
    NzFormModule,
    NzLayoutModule,
    NzMenuModule,
    NzNotificationModule,
    NzImageModule,
    NzAlertModule,
    NzDrawerModule,
    NzAvatarModule,
    NzCardModule,
    NzCheckboxModule,
    NzSpinModule,
    NzUploadModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzTabsModule,
    NgxCurrencyDirective,
    NzToolTipModule,  // Thêm module này


  ],
  providers: [
    provideEnvironmentNgxCurrency({
      prefix: '',
      suffix:'',
      thousands: ',',
      decimal: '.',
      align: 'left',
      precision: 0,
      allowNegative: false,
      inputMode: NgxCurrencyInputMode.Natural,
      allowZero: true,
      nullable: true,
      min: null,
      max: null,
    }),
    { provide: NZ_I18N, useValue: en_US },
    CurrencyPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
