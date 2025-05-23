export interface MenuItem {
    label: string;
    icon?: string;
    route?: string;
    children?: MenuItem[];
    roles?: string[];
}

export interface IUser {
    accountStatus: string;
    accountType: string;
    address: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    gender: string;
    id: number;
    orderResponses?: string[];
    phone: string;
    service?: string;
}