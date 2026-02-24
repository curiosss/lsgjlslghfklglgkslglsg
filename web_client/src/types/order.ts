export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';

export interface Order {
  id: number;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  full_name: string;
  phone: string;
  address?: string;
  note?: string;
  delivery_zone_id?: number;
  delivery_date?: string;
  time_slot?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image_url: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderRequest {
  type: OrderType;
  full_name: string;
  phone: string;
  address?: string;
  note?: string;
  delivery_zone_id?: number;
  delivery_date: string;
  time_slot: string;
  items: { product_id: number; quantity: number }[];
}
