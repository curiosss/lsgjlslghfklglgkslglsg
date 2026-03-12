import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Select, Button, Space, message, Image, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as ordersApi from '../api/orders';
import { StatusTag } from '../components/StatusTag';
import { formatPrice, formatDateTime } from '../utils/format';
import { ORDER_STATUS_I18N, ORDER_TYPE_I18N } from '../utils/constants';
import { useTr } from '../i18n';
import type { OrderWithItems, OrderStatus } from '../types';

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const t = useTr();

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: resp } = await ordersApi.getOrder(Number(id));
      setOrder(resp.data ?? null);
    } catch {
      message.error(t('error_loading_order'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    setStatusLoading(true);
    try {
      await ordersApi.updateOrderStatus(order.id, status);
      message.success(t('status_updated'));
      fetchOrder();
    } catch {
      message.error(t('error_updating_status'));
    } finally {
      setStatusLoading(false);
    }
  };

  const itemColumns = [
    { title: t('col_id'), dataIndex: 'product_id', key: 'product_id', width: 60 },
    {
      title: t('col_photo'), dataIndex: 'product_image_url', key: 'product_image_url', width: 70,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'cover' }} /> : '—',
    },
    { title: t('col_product'), dataIndex: 'product_name', key: 'product_name' },
    { title: t('col_price'), dataIndex: 'price', key: 'price', width: 120, render: (v: number) => formatPrice(v) },
    { title: t('col_quantity'), dataIndex: 'quantity', key: 'quantity', width: 80 },
    { title: t('col_item_total'), dataIndex: 'total', key: 'total', width: 120, render: (v: number) => formatPrice(v) },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!order) return null;

  const orderTypeKey = ORDER_TYPE_I18N[order.type];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>{t('back')}</Button>
        <h2 style={{ margin: 0 }}>{t('order_prefix')} {order.order_number}</h2>
      </Space>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label={t('label_number')}>{order.order_number}</Descriptions.Item>
          <Descriptions.Item label={t('label_status')}>
            <Space>
              <StatusTag status={order.status} />
              <Select
                value={order.status}
                onChange={handleStatusChange}
                loading={statusLoading}
                size="small"
                style={{ width: 150 }}
              >
                {Object.entries(ORDER_STATUS_I18N).map(([k, i18nKey]) => (
                  <Select.Option key={k} value={k}>{t(i18nKey)}</Select.Option>
                ))}
              </Select>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={t('label_type')}>{orderTypeKey ? t(orderTypeKey) : order.type}</Descriptions.Item>
          <Descriptions.Item label={t('label_client')}>{order.full_name}</Descriptions.Item>
          <Descriptions.Item label={t('label_phone')}>{order.phone}</Descriptions.Item>
          <Descriptions.Item label={t('label_address')}>{order.address || '—'}</Descriptions.Item>
          {order.note && <Descriptions.Item label={t('label_note')} span={3}>{order.note}</Descriptions.Item>}
          {order.delivery_date && <Descriptions.Item label={t('label_delivery_date')}>{order.delivery_date}</Descriptions.Item>}
          {order.time_slot && <Descriptions.Item label={t('label_time')}>{order.time_slot}</Descriptions.Item>}
          <Descriptions.Item label={t('label_created')}>{formatDateTime(order.created_at)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('products_card_title')} style={{ marginBottom: 16 }}>
        <Table
          columns={itemColumns}
          dataSource={order.items}
          rowKey="id"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>{t('summary_subtotal')}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatPrice(order.subtotal)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>{t('summary_delivery')}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatPrice(order.delivery_fee)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>{t('summary_total')}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatPrice(order.total)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </>
  );
};
