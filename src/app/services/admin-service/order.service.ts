import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

constructor(private http: HttpClient) { }

  getOrder(): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/order`)
  }

    getOrderDetail(orderId: any): Observable<any> {
    return this.http.get<any>(`${APP_CONFIG.baseUrl}/order-detail` + `/${orderId}`)
  }

  confirmOrder(id: number, type: string): Observable<any> {
    return this.http.patch<any>(`${APP_CONFIG.baseUrl}/order/${id}/${type === "approve" ? "IN_PROCESS" : "REJECT"}`, null)
  }

}
