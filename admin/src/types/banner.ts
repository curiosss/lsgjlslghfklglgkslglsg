export interface Banner {
  id: number;
  image_url: string;
  link_type?: string;
  link_value?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateBannerRequest {
  image_url: string;
  link_type?: string;
  link_value?: string;
  sort_order: number;
  is_active?: boolean;
}

export interface UpdateBannerRequest {
  image_url?: string;
  link_type?: string;
  link_value?: string;
  sort_order?: number;
  is_active?: boolean;
}
