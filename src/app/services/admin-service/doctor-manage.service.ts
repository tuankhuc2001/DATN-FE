import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorManageService {

constructor(private http: HttpClient) { }

  getDoctor(): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/accounts/doctor`)
  }

  createAccountDoctor(body: any): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/register`, body)
  }

}
