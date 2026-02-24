import { Tag } from 'antd';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';

interface StatusTagProps {
  status: string;
}

export const StatusTag = ({ status }: StatusTagProps) => (
  <Tag color={ORDER_STATUS_COLORS[status] || 'default'}>
    {ORDER_STATUS_LABELS[status] || status}
  </Tag>
);
