import dayjs from 'dayjs';

export const formatPrice = (price: number): string =>
  `${price.toFixed(2)} m.`;

export const formatDate = (date: string): string =>
  dayjs(date).format('DD.MM.YYYY');

export const formatDateTime = (date: string): string =>
  dayjs(date).format('DD.MM.YYYY HH:mm');
