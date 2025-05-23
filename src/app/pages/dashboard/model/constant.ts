import { MenuItem } from "./interface";

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Quản lý tài khoản',
    icon: 'user',
    route: '/dashboard/patient',
    roles: ['PATIENT']
  },
  {
    label: 'Quản lý hồ sơ',
    icon: 'user',
    route: '/dashboard/health-record',
    roles: ['PATIENT']
  },
  {
    label: 'Lịch sử',
    icon: 'user',
    route: '/dashboard/history',
    roles: ['PATIENT']
  },
  {
    label: 'Quản lý tài khoản',
    icon: 'setting',
    route: '/dashboard/doctor',
    roles: ['DOCTOR']
  },
  {
    label: 'Lịch khám',
    icon: 'setting',
    route: '/dashboard/schedule',
    roles: ['DOCTOR']
  },

  {
    label: 'Bệnh nhân',
    icon: 'dashboard',
    route: '/dashboard/admin/patient-manage',
    roles: ['ADMIN']
  },

  {
    label: 'Hồ sơ bệnh nhân',
    icon: 'dashboard',
    route: '/dashboard/admin/patient-records',
    roles: ['ADMIN']
  },

  {
    label: 'Bác sĩ',
    route: '/dashboard/admin/doctor-manage',
    roles: ['ADMIN']
  },

  {
    label: 'Đặt lịch',
    icon: 'dashboard',
    route: '/dashboard/admin/order',
    roles: ['ADMIN']
  },

  {
    label: 'Cơ sở',
    icon: 'dashboard',
    route: '/dashboard/admin/facility',
    roles: ['ADMIN']
  },

  {
    label: 'Dịch vụ',
    icon: 'dashboard',
    route: '/dashboard/admin/service',
    roles: ['ADMIN']
  },

  {
    label: 'Thuốc',
    icon: 'dashboard',
    route: '/dashboard/admin/medicine',
    roles: ['ADMIN']
  },

  {
    label: 'Doanh thu',
    icon: 'dashboard',
    route: '/dashboard/admin',
    roles: ['ADMIN']
  },
];