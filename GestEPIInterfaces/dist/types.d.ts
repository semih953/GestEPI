export interface Epi {
    id: number;
    internal_id: string;
    serial_number: string;
    model: string;
    brand: string;
    type_id: number;
    size: string;
    color: string;
    purchase_date: Date;
    service_start_date: Date;
    manufacture_date: Date;
    inspection_frequency: string;
}
export interface EpiTypes {
    id: number;
    label: string;
}
export interface EpiCheck {
    id: number;
    internal_id: string;
    check_date: Date;
    status_id: number;
    user_id: number;
}
export interface CheckStatus {
    id: number;
    label: string;
}
export interface Users {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'User';
}
export interface UserWithPassword extends Users {
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: Users;
    token: string;
}
