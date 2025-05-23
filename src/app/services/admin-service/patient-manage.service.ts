import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientManageService {

constructor(private http: HttpClient) { }

  getPatient(): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/accounts/patient`)
  }

}
