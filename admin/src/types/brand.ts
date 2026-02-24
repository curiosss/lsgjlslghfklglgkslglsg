export interface Brand {
  id: number;
  name: string;
  logo_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateBrandRequest {
  name: string;
  logo_url?: string;
  sort_order: number;
  is_active?: boolean;
}

export interface UpdateBrandRequest {
  name?: string;
  logo_url?: string;
  sort_order?: number;
  is_active?: boolean;
}
