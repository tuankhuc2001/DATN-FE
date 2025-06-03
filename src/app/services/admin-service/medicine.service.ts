import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

constructor(private http: HttpClient) { }

  getMedicine(): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/medicine`)
  }

    createMedicine(body: any): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/medicine`, body)

  }

  updateMedicine(id: number, body: any): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/medicine`, body)

  }

  deleteMedicine(id: number) {
  return this.http.delete<any>(`${APP_CONFIG.baseUrl}/medicine/${id}`);
}
}
