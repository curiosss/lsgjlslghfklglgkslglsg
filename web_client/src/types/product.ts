export interface Product {
  id: number;
  name: string;
  brand_name: string;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  description?: string;
  price: number;
  old_price?: number;
  discount_percent?: number;
  image_url: string;
  images?: string[];
  barcode?: string;
  is_new: boolean;
  is_discount: boolean;
}

export interface ProductFilters {
  category_id?: number;
  subcategory_id?: number;
  brand_id?: number;
  search?: string;
  sort?: string;
  is_new?: boolean;
  is_discount?: boolean;
  page?: number;
  limit?: number;
}
