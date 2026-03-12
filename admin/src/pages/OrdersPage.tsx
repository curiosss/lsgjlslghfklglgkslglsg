import { useEffect, useState, useCallback } from 'react';
import { Table, Select, Input, DatePicker, Space, Button, message } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as ordersApi from '../api/orders';
import { StatusTag } from '../components/StatusTag';
import { formatPrice, formatDateTime } from '../utils/format';
import { ORDER_STATUS_I18N, ORDER_TYPE_I18N } from '../utils/constants';
import { useTr } from '../i18n';
import type { Order, OrderFilters, Pagination } from '../types';
import dayjs from 'dayjs';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({ page: 1, limit: 20 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 0 });
  const t = useTr();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resp } = await ordersApi.getOrders(filters);
      setOrders(resp.data ?? []);
      if (resp.pagination) setPagination(resp.pagination);
    } catch {
      message.error(t('error_loading_orders'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 20 });
  };

  const columns = [
    { title: t('col_order_no'), dataIndex: 'order_number', key: 'order_number', width: 120 },
    {
      title: t('col_status'), dataIndex: 'status', key: 'status', width: 130,
      render: (v: string) => <StatusTag status={v} />,
    },
    {
      title: t('col_type'), dataIndex: 'type', key: 'type', width: 110,
      render: (v: string) => {
        const i18nKey = ORDER_TYPE_I18N[v];
        return i18nKey ? t(i18nKey) : v;
      },
    },
    { title: t('col_client'), dataIndex: 'full_name', key: 'full_name' },
    { title: t('col_phone'), dataIndex: 'phone', key: 'phone', width: 140 },
    { title: t('col_total'), dataIndex: 'total', key: 'total', width: 120, render: (v: number) => formatPrice(v) },
    { title: t('col_created'), dataIndex: 'created_at', key: 'created_at', width: 150, render: (v: string) => formatDateTime(v) },
    {
      title: '', key: 'actions', width: 60,
      render: (_: unknown, record: Order) => (
        <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/orders/${record.id}`)} />
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>{t('orders_title')}</h2>

      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder={t('search_by_phone')}
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 200 }}
          onChange={e => handleFilterChange('phone', e.target.value)}
          value={filters.phone || ''}
        />
        <Select
          placeholder={t('status_placeholder')}
          allowClear
          style={{ width: 160 }}
          value={filters.status}
          onChange={v => handleFilterChange('status', v)}
        >
          {Object.entries(ORDER_STATUS_I18N).map(([k, i18nKey]) => (
            <Select.Option key={k} value={k}>{t(i18nKey)}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder={t('type_placeholder')}
          allowClear
          style={{ width: 140 }}
          value={filters.type}
          onChange={v => handleFilterChange('type', v)}
        >
          {Object.entries(ORDER_TYPE_I18N).map(([k, i18nKey]) => (
            <Select.Option key={k} value={k}>{t(i18nKey)}</Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder={t('date_from')}
          value={filters.date_from ? dayjs(filters.date_from) : null}
          onChange={(d) => handleFilterChange('date_from', d?.format('YYYY-MM-DD'))}
        />
        <DatePicker
          placeholder={t('date_to')}
          value={filters.date_to ? dayjs(filters.date_to) : null}
          onChange={(d) => handleFilterChange('date_to', d?.format('YYYY-MM-DD'))}
        />
        <Button onClick={handleResetFilters}>{t('reset')}</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `${t('total_count')} ${total}`,
          onChange: (page, pageSize) => {
            setFilters(prev => ({ ...prev, page, limit: pageSize }));
          },
        }}
      />
    </>
  );
};
