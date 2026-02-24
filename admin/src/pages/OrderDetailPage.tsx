import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Select, Button, Space, message, Image, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as ordersApi from '../api/orders';
import { StatusTag } from '../components/StatusTag';
import { formatPrice, formatDateTime } from '../utils/format';
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from '../utils/constants';
import type { OrderWithItems, OrderStatus } from '../types';

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: resp } = await ordersApi.getOrder(Number(id));
      setOrder(resp.data ?? null);
    } catch {
      message.error('Ошибка загрузки заказа');
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
      message.success('Статус обновлён');
      fetchOrder();
    } catch {
      message.error('Ошибка обновления статуса');
    } finally {
      setStatusLoading(false);
    }
  };

  const itemColumns = [
    { title: 'ID', dataIndex: 'product_id', key: 'product_id', width: 60 },
    {
      title: 'Фото', dataIndex: 'product_image_url', key: 'product_image_url', width: 70,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'cover' }} /> : '—',
    },
    { title: 'Товар', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Цена', dataIndex: 'price', key: 'price', width: 120, render: (v: number) => formatPrice(v) },
    { title: 'Кол-во', dataIndex: 'quantity', key: 'quantity', width: 80 },
    { title: 'Итого', dataIndex: 'total', key: 'total', width: 120, render: (v: number) => formatPrice(v) },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!order) return null;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>Назад</Button>
        <h2 style={{ margin: 0 }}>Заказ {order.order_number}</h2>
      </Space>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="Номер">{order.order_number}</Descriptions.Item>
          <Descriptions.Item label="Статус">
            <Space>
              <StatusTag status={order.status} />
              <Select
                value={order.status}
                onChange={handleStatusChange}
                loading={statusLoading}
                size="small"
                style={{ width: 150 }}
              >
                {Object.entries(ORDER_STATUS_LABELS).map(([k, label]) => (
                  <Select.Option key={k} value={k}>{label}</Select.Option>
                ))}
              </Select>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Тип">{ORDER_TYPE_LABELS[order.type] || order.type}</Descriptions.Item>
          <Descriptions.Item label="Клиент">{order.full_name}</Descriptions.Item>
          <Descriptions.Item label="Телефон">{order.phone}</Descriptions.Item>
          <Descriptions.Item label="Адрес">{order.address || '—'}</Descriptions.Item>
          {order.note && <Descriptions.Item label="Примечание" span={3}>{order.note}</Descriptions.Item>}
          {order.delivery_date && <Descriptions.Item label="Дата доставки">{order.delivery_date}</Descriptions.Item>}
          {order.time_slot && <Descriptions.Item label="Время">{order.time_slot}</Descriptions.Item>}
          <Descriptions.Item label="Создан">{formatDateTime(order.created_at)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Товары" style={{ marginBottom: 16 }}>
        <Table
          columns={itemColumns}
          dataSource={order.items}
          rowKey="id"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>Подытог:</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatPrice(order.subtotal)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>Доставка:</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatPrice(order.delivery_fee)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>Итого:</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatPrice(order.total)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </>
  );
};
