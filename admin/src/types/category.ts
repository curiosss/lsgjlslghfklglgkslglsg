export interface Category {
  id: number;
  name_ru: string;
  name_tm: string;
  name_en?: string;
  image_url?: string;
  has_subcategories: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SubCategory {
  id: number;
  parent_id: number;
  name_ru: string;
  name_tm: string;
  name_en?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface CreateCategoryRequest {
  name_ru: string;
  name_tm: string;
  name_en?: string;
  image_url?: string;
  sort_order: number;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  name_ru?: string;
  name_tm?: string;
  name_en?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateSubCategoryRequest {
  parent_id: number;
  name_ru: string;
  name_tm: string;
  name_en?: string;
  image_url?: string;
  sort_order: number;
  is_active?: boolean;
}

export interface UpdateSubCategoryRequest {
  name_ru?: string;
  name_tm?: string;
  name_en?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: boolean;
}
