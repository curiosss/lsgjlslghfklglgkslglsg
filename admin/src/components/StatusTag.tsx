import { Tag } from 'antd';
import { ORDER_STATUS_COLORS, ORDER_STATUS_I18N } from '../utils/constants';
import { useTr } from '../i18n';

interface StatusTagProps {
  status: string;
}

export const StatusTag = ({ status }: StatusTagProps) => {
  const t = useTr();
  const i18nKey = ORDER_STATUS_I18N[status];
  return (
    <Tag color={ORDER_STATUS_COLORS[status] || 'default'}>
      {i18nKey ? t(i18nKey) : status}
    </Tag>
  );
};
