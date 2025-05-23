import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

constructor(private http: HttpClient) { }

  getService(): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/service`)
  }

}
