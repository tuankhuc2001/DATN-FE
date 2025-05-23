import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

constructor(private http: HttpClient) { }

  getFacility(): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/facility`)
  }

}
