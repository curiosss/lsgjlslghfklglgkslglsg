export interface Product {
  id: number;
  name_ru: string;
  name_tm: string;
  name_en?: string;
  pos_name?: string;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  description_ru?: string;
  description_tm?: string;
  description_en?: string;
  price: number;
  old_price?: number;
  discount_percent?: number;
  image_url: string;
  images?: string[];
  barcode?: string;
  is_active: boolean;
  status: string;
  is_new: boolean;
  is_discount: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  brand_name?: string;
}

export interface CreateProductRequest {
  name_ru: string;
  name_tm: string;
  name_en?: string;
  pos_name?: string;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  description_ru?: string;
  description_tm?: string;
  description_en?: string;
  price: number;
  old_price?: number;
  discount_percent?: number;
  image_url: string;
  images?: string[];
  barcode?: string;
  is_active?: boolean;
  status?: string;
  is_new?: boolean;
  is_discount?: boolean;
  sort_order: number;
}

export interface UpdateProductRequest {
  name_ru?: string;
  name_tm?: string;
  name_en?: string;
  pos_name?: string;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  description_ru?: string;
  description_tm?: string;
  description_en?: string;
  price?: number;
  old_price?: number;
  discount_percent?: number;
  image_url?: string;
  images?: string[];
  barcode?: string;
  is_active?: boolean;
  status?: string;
  is_new?: boolean;
  is_discount?: boolean;
  sort_order?: number;
}

export interface ProductFilters {
  category_id?: number;
  subcategory_id?: number;
  brand_id?: number;
  status?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
