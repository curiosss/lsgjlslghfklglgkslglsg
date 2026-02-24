export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/admin';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  new: 'gold',
  confirmed: 'green',
  shipped: 'blue',
  delivered: 'default',
  cancelled: 'red',
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  delivery: 'Доставка',
  pickup: 'Самовывоз',
};

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  superadmin: 'Суперадмин',
  admin: 'Админ',
  manager: 'Менеджер',
};
