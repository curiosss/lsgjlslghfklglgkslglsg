import { useEffect, useState, useCallback } from 'react';
import {
  Button, Table, Drawer, Form, Input, InputNumber, Switch, Select,
  Space, message, Image, Row, Col, Modal,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import * as productsApi from '../api/products';
import * as categoriesApi from '../api/categories';
import * as brandsApi from '../api/brands';
import { ImageUpload } from '../components/ImageUpload';
import { formatPrice, formatDateTime } from '../utils/format';
import { useTr } from '../i18n';
import type { Product, Category, SubCategory, Brand, ProductFilters, Pagination } from '../types';

export const NotReviewedProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const t = useTr();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 20, status: 'not_reviewed' });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 0 });

  const fetchProducts = useCallback(async (params?: ProductFilters) => {
    setLoading(true);
    try {
      const { data: resp } = await productsApi.getProducts(params ?? filters);
      setProducts(resp.data ?? []);
      if (resp.pagination) setPagination(resp.pagination);
    } catch {
      message.error(t('error_loading_products'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchMeta = async () => {
    try {
      const [catResp, brandResp] = await Promise.all([
        categoriesApi.getCategories(),
        brandsApi.getBrands(),
      ]);
      setCategories(catResp.data.data ?? []);
      setBrands(brandResp.data.data ?? []);
    } catch {
      // silent
    }
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchMeta(); }, []);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    const newFilters: ProductFilters = {
      page: 1,
      limit: filters.limit,
      status: 'not_reviewed',
      ...(values.search && { search: values.search }),
      ...(values.category_id && { category_id: values.category_id }),
      ...(values.brand_id && { brand_id: values.brand_id }),
    };
    setFilters(newFilters);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    const newFilters: ProductFilters = { page: 1, limit: 20, status: 'not_reviewed' };
    setFilters(newFilters);
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    const cat = categories.find(c => c.id === categoryId);
    if (cat && cat.has_subcategories) {
      setSubcategories([]);
    } else {
      setSubcategories([]);
    }
    form.setFieldValue('subcategory_id', undefined);
  };

  const openDrawer = (product?: Product) => {
    setEditing(product ?? null);
    form.resetFields();
    if (product) {
      form.setFieldsValue(product);
      if (product.category_id) handleCategoryChange(product.category_id);
    } else {
      form.setFieldsValue({ price: 0, sort_order: 0, is_active: true, status: 'not_reviewed', is_new: false, is_discount: false });
    }
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await productsApi.updateProduct(editing.id, values);
        message.success(t('product_updated'));
      } else {
        await productsApi.createProduct(values);
        message.success(t('product_created'));
      }
      setDrawerOpen(false);
      fetchProducts();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_product_title'),
      content: t('delete_product_content'),
      okText: t('delete'), cancelText: t('cancel'), okType: 'danger',
      onOk: async () => {
        try { await productsApi.deleteProduct(id); message.success(t('product_deleted')); fetchProducts(); }
        catch { message.error(t('error_deleting')); }
      },
    });
  };

  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    {
      title: t('col_photo'), dataIndex: 'image_url', key: 'image_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={50} height={50} style={{ objectFit: 'cover' }} /> : '—',
    },
    { title: t('col_name_ru'), dataIndex: 'name_ru', key: 'name_ru', ellipsis: true },
    { title: t('col_brand'), dataIndex: 'brand_name', key: 'brand_name', render: (v: string) => v || '—' },
    { title: t('col_price'), dataIndex: 'price', key: 'price', width: 120, render: (v: number) => formatPrice(v) },
    { title: t('col_old_price'), dataIndex: 'old_price', key: 'old_price', width: 120,
      render: (v: number) => v ? formatPrice(v) : '—',
    },
    { title: 'Статус (API)', dataIndex: 'status', key: 'status', width: 100, 
      render: (v: string) => {
        if (v === 'not_reviewed') return '❌ Не провер.';
        if (v === 'inactive') return '⚠️ Откл.';
        return '✅ Акт.';
      }
    },
    { title: t('col_active'), dataIndex: 'is_active', key: 'is_active', width: 80, render: (v: boolean) => v ? t('yes') : t('no') },
    { title: t('col_new'), dataIndex: 'is_new', key: 'is_new', width: 70, render: (v: boolean) => v ? t('yes') : t('no') },
    { title: t('col_created'), dataIndex: 'created_at', key: 'created_at', width: 140, render: (v: string) => formatDateTime(v) },
    {
      title: t('actions'), key: 'actions', width: 120,
      render: (_: unknown, record: Product) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openDrawer(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Непроверенные товары (POS)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>{t('add')}</Button>
      </div>

      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }} onFinish={handleSearch}>
        <Form.Item name="search">
          <Input placeholder={t('search')} prefix={<SearchOutlined />} allowClear />
        </Form.Item>
        <Form.Item name="category_id">
          <Select placeholder={t('search_category_placeholder')} allowClear style={{ width: 180 }}>
            {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name_ru}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="brand_id">
          <Select placeholder={t('search_brand_placeholder')} allowClear style={{ width: 160 }}>
            {brands.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">{t('filter')}</Button>
            <Button onClick={handleResetSearch}>{t('reset')}</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={products}
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

      <Drawer
        title={editing ? t('drawer_edit_product') : t('drawer_new_product')}
        width={600}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>{t('cancel')}</Button>
            <Button type="primary" onClick={handleSubmit}>{t('save')}</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          {editing?.pos_name && (
            <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
              <strong>POS Name:</strong> {editing.pos_name}
            </div>
          )}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name_ru" label={t('label_name_ru')} rules={[{ required: true, message: t('validation_enter_name') }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name_tm" label={t('label_name_tm')} rules={[{ required: true, message: t('validation_enter_name') }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name_en" label={t('label_name_en')}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="description_ru" label={t('label_description_ru')}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="description_tm" label={t('label_description_tm')}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="description_en" label={t('label_description_en')}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category_id" label={t('label_category')}>
                <Select allowClear placeholder={t('select')} onChange={handleCategoryChange}>
                  {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name_ru}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="subcategory_id" label={t('label_subcategory')}>
                <Select allowClear placeholder={t('select')} disabled={subcategories.length === 0}>
                  {subcategories.map(s => <Select.Option key={s.id} value={s.id}>{s.name_ru}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand_id" label={t('label_brand')}>
                <Select allowClear placeholder={t('select')}>
                  {brands.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="barcode" label={t('label_barcode')}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="price" label={t('label_price')} rules={[{ required: true, message: t('validation_enter_price') }]}>
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="old_price" label={t('label_old_price')}>
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discount_percent" label={t('label_discount_percent')}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="image_url" label={t('label_main_image')} rules={[{ required: !editing, message: t('validation_upload_image') }]}>
            <ImageUpload />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sort_order" label={t('label_sort_order')}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="Статус (API)">
                <Select>
                  <Select.Option value="active">Активный</Select.Option>
                  <Select.Option value="not_reviewed">Не проверен</Select.Option>
                  <Select.Option value="inactive">Не активный</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="is_active" label={t('label_active')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="is_new" label={t('label_new')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="is_discount" label={t('label_discount')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
