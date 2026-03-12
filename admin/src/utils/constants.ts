export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/admin';

export const ORDER_STATUS_KEYS = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

export const ORDER_STATUS_I18N: Record<string, string> = {
  new: 'status_new',
  confirmed: 'status_confirmed',
  shipped: 'status_shipped',
  delivered: 'status_delivered',
  cancelled: 'status_cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  new: 'gold',
  confirmed: 'green',
  shipped: 'blue',
  delivered: 'default',
  cancelled: 'red',
};

export const ORDER_TYPE_I18N: Record<string, string> = {
  delivery: 'type_delivery',
  pickup: 'type_pickup',
};

export const ADMIN_ROLE_I18N: Record<string, string> = {
  superadmin: 'role_superadmin',
  admin: 'role_admin',
  manager: 'role_manager',
};
