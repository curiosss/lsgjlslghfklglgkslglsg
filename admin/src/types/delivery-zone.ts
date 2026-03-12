export interface DeliveryZone {
  id: number;
  name_ru: string;
  name_tm: string;
  name_en?: string;
  delivery_price: number;
  is_active: boolean;
}

export interface CreateDeliveryZoneRequest {
  name_ru: string;
  name_tm: string;
  name_en?: string;
  delivery_price: number;
  is_active?: boolean;
}

export interface UpdateDeliveryZoneRequest {
  name_ru?: string;
  name_tm?: string;
  name_en?: string;
  delivery_price?: number;
  is_active?: boolean;
}
