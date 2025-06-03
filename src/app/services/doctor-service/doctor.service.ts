import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  getMedicalAppointment(id: number): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/schedule` + `/${id}`)
  }

    addPrescription(id: number, body: any): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/prescription` + `/${id}` , body)
  }

  addResult(id: number, body: any): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/result` + `/${id}` , body)
  }

  submitResult(id: number): Observable<any> {
    return this.http.patch<any>(`${APP_CONFIG.baseUrl}/order` + `/${id}` + `/DONE`, null)
  }
  

}
