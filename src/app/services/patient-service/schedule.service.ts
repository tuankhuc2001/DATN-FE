import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  scheduleService(body: any): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/order`, body)
  }

}
