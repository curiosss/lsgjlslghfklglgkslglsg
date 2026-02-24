import type { Banner } from './banner';
import type { Brand } from './brand';
import type { Category } from './category';
import type { Product } from './product';

export interface HomeData {
  banners: Banner[];
  brands: Brand[];
  categories: Category[];
  new_products: Product[];
  discount_products: Product[];
}
