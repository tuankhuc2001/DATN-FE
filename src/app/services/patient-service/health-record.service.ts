import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class HealthRecordService {

  constructor(private http: HttpClient) { } 

  getHealthRecord(id: number): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/health-record` + `/${id}`)
  }

}
