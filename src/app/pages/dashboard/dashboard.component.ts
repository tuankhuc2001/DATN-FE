import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MENU_ITEMS } from './model/constant';
import { IUser, MenuItem } from './model/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isCollapsed = false;
  role: string = '';
  userInfo: IUser | null = null;
  menuItems: MenuItem[] = [];
  avatarBgColor: string = '';
  userInitial: string = '?';

  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getRole();
    this.menuItems = MENU_ITEMS.filter(item =>      
      item.roles?.some(role => this.role.includes(role))
    );
    console.log(this.menuItems, 'this.menuItems');
    
    this.avatarBgColor = this.getRandomColor();

    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.userInfo = this.authService.getUserInfo();
    this.userInitial = this.getUserInitial();
  }

  isActive(route?: string): boolean {
    return this.router.url === route;
  }

  getRandomColor(): string {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#ff4d4f', '#52c41a'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getUserInitial(): string {
    if (!this.userInfo?.fullName) return '?';

    const nameParts = this.userInfo.fullName.trim().split(' ');
    return nameParts.length > 0 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : '?';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
