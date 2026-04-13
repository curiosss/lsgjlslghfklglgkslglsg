export interface POSUser {
  id: number;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface CreatePOSUserRequest {
  username: string;
  password?: string;
  is_active?: boolean;
}

export interface UpdatePOSUserRequest {
  username?: string;
  password?: string;
  is_active?: boolean;
}
