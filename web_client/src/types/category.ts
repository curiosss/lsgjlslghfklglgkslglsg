export interface Category {
  id: number;
  name: string;
  image_url?: string;
  has_subcategories: boolean;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  image_url?: string;
  parent_id: number;
}
