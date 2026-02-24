export type AdminRole = 'superadmin' | 'admin' | 'manager';

export interface Admin {
  id: number;
  username: string;
  full_name?: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  admin: Admin;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface CreateAdminRequest {
  username: string;
  password: string;
  full_name?: string;
  role: AdminRole;
}

export interface UpdateAdminRequest {
  username?: string;
  password?: string;
  full_name?: string;
  role?: AdminRole;
  is_active?: boolean;
}
