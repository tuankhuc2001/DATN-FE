import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  login(role: string) {
    localStorage.setItem('userRole', role);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUserInfo(){
    return JSON.parse(localStorage.getItem('account') || '{}');
  }

  isAuthenticated(): boolean {
    return !!this.getRole();
  }
}
