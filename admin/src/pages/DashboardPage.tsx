import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Statistic, Table, message } from 'antd';
import { ShoppingOutlined, AppstoreOutlined, TagOutlined, OrderedListOutlined } from '@ant-design/icons';
import * as productsApi from '../api/products';
import * as categoriesApi from '../api/categories';
import * as brandsApi from '../api/brands';
import * as ordersApi from '../api/orders';
import { StatusTag } from '../components/StatusTag';
import { formatDateTime, formatPrice } from '../utils/format';
import { useTr } from '../i18n';
import type { Order } from '../types';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, categories: 0, brands: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTr();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes, ordersRes] = await Promise.all([
          productsApi.getProducts({ page: 1, limit: 1 }),
          categoriesApi.getCategories(),
          brandsApi.getBrands(),
          ordersApi.getOrders({ page: 1, limit: 10 }),
        ]);
        setStats({
          products: productsRes.data.pagination?.total ?? 0,
          categories: productsRes.data.data ? (categoriesRes.data.data?.length ?? 0) : 0,
          brands: brandsRes.data.data?.length ?? 0,
          orders: ordersRes.data.pagination?.total ?? 0,
        });
        setRecentOrders(ordersRes.data.data ?? []);
      } catch {
        message.error(t('error_loading_data'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: t('col_order_number'), dataIndex: 'order_number', key: 'order_number' },
    { title: t('col_client'), dataIndex: 'full_name', key: 'full_name' },
    { title: t('col_phone'), dataIndex: 'phone', key: 'phone' },
    { title: t('col_total'), dataIndex: 'total', key: 'total', render: (v: number) => formatPrice(v) },
    { title: t('col_status'), dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    { title: t('col_date'), dataIndex: 'created_at', key: 'created_at', render: (v: string) => formatDateTime(v) },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card><Statistic title={t('stat_products')} value={stats.products} prefix={<ShoppingOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title={t('stat_categories')} value={stats.categories} prefix={<AppstoreOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title={t('stat_brands')} value={stats.brands} prefix={<TagOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title={t('stat_orders')} value={stats.orders} prefix={<OrderedListOutlined />} /></Card>
        </Col>
      </Row>
      <Card title={t('recent_orders')}>
        <Table
          columns={columns}
          dataSource={recentOrders}
          rowKey="id"
          loading={loading}
          pagination={false}
          onRow={(record) => ({ onClick: () => navigate(`/orders/${record.id}`), style: { cursor: 'pointer' } })}
        />
      </Card>
    </>
  );
};
