import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(id: number): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/account` + `/${id}`)
  }

  updateProfile(request: any): Observable<any> {
    return this.http.put<any>(`${APP_CONFIG.baseUrl}/profile`, {request})
  }

  updatePassword(id: number, newPassword: string): Observable<any> {
    return this.http.put<any>(`${APP_CONFIG.baseUrl}/password` + `/${id}`, {newPassword})
  }
}
