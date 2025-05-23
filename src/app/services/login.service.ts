import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../environments/environment.dev';
import { ILoginRequest } from '../https/login/interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginRequest: ILoginRequest): Observable<any> {
    return this.http.post<any>(`${APP_CONFIG.baseUrl}/login`, {phone: loginRequest.phone, password: loginRequest.password})
  }
}
