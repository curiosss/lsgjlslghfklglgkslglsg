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
import type { Product, Category, SubCategory, Brand, ProductFilters, Pagination } from '../types';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 20 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 0 });

  const fetchProducts = useCallback(async (params?: ProductFilters) => {
    setLoading(true);
    try {
      const { data: resp } = await productsApi.getProducts(params ?? filters);
      setProducts(resp.data ?? []);
      if (resp.pagination) setPagination(resp.pagination);
    } catch {
      message.error('Ошибка загрузки товаров');
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
      ...(values.search && { search: values.search }),
      ...(values.category_id && { category_id: values.category_id }),
      ...(values.brand_id && { brand_id: values.brand_id }),
    };
    setFilters(newFilters);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    const newFilters: ProductFilters = { page: 1, limit: 20 };
    setFilters(newFilters);
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    const cat = categories.find(c => c.id === categoryId);
    if (cat && cat.has_subcategories) {
      // The category has subcategories — we need to load them
      // For now subcategories come embedded in category or we fetch separately
      // The API may return them with the category list; here we use a simple approach
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
      form.setFieldsValue({ price: 0, sort_order: 0, is_active: true, is_new: false, is_discount: false });
    }
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await productsApi.updateProduct(editing.id, values);
        message.success('Товар обновлён');
      } else {
        await productsApi.createProduct(values);
        message.success('Товар создан');
      }
      setDrawerOpen(false);
      fetchProducts();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить товар?',
      content: 'Это действие нельзя отменить.',
      okText: 'Удалить', cancelText: 'Отмена', okType: 'danger',
      onOk: async () => {
        try { await productsApi.deleteProduct(id); message.success('Товар удалён'); fetchProducts(); }
        catch { message.error('Ошибка удаления'); }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Фото', dataIndex: 'image_url', key: 'image_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={50} height={50} style={{ objectFit: 'cover' }} /> : '—',
    },
    { title: 'Название (RU)', dataIndex: 'name_ru', key: 'name_ru', ellipsis: true },
    { title: 'Бренд', dataIndex: 'brand_name', key: 'brand_name', render: (v: string) => v || '—' },
    { title: 'Цена', dataIndex: 'price', key: 'price', width: 120, render: (v: number) => formatPrice(v) },
    {
      title: 'Ст. цена', dataIndex: 'old_price', key: 'old_price', width: 120,
      render: (v: number) => v ? formatPrice(v) : '—',
    },
    { title: 'Активен', dataIndex: 'is_active', key: 'is_active', width: 80, render: (v: boolean) => v ? 'Да' : 'Нет' },
    { title: 'Новый', dataIndex: 'is_new', key: 'is_new', width: 70, render: (v: boolean) => v ? 'Да' : 'Нет' },
    { title: 'Создан', dataIndex: 'created_at', key: 'created_at', width: 140, render: (v: string) => formatDateTime(v) },
    {
      title: 'Действия', key: 'actions', width: 120,
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
        <h2>Товары</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>Добавить</Button>
      </div>

      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }} onFinish={handleSearch}>
        <Form.Item name="search">
          <Input placeholder="Поиск..." prefix={<SearchOutlined />} allowClear />
        </Form.Item>
        <Form.Item name="category_id">
          <Select placeholder="Категория" allowClear style={{ width: 180 }}>
            {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name_ru}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="brand_id">
          <Select placeholder="Бренд" allowClear style={{ width: 160 }}>
            {brands.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Фильтр</Button>
            <Button onClick={handleResetSearch}>Сбросить</Button>
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
          showTotal: (total) => `Всего: ${total}`,
          onChange: (page, pageSize) => {
            setFilters(prev => ({ ...prev, page, limit: pageSize }));
          },
        }}
      />

      <Drawer
        title={editing ? 'Редактировать товар' : 'Новый товар'}
        width={600}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Отмена</Button>
            <Button type="primary" onClick={handleSubmit}>Сохранить</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name_ru" label="Название (RU)" rules={[{ required: true, message: 'Введите название' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name_tm" label="Название (TM)" rules={[{ required: true, message: 'Введите название' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="description_ru" label="Описание (RU)">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description_tm" label="Описание (TM)">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category_id" label="Категория">
                <Select allowClear placeholder="Выберите" onChange={handleCategoryChange}>
                  {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name_ru}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="subcategory_id" label="Подкатегория">
                <Select allowClear placeholder="Выберите" disabled={subcategories.length === 0}>
                  {subcategories.map(s => <Select.Option key={s.id} value={s.id}>{s.name_ru}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand_id" label="Бренд">
                <Select allowClear placeholder="Выберите">
                  {brands.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="barcode" label="Штрихкод">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="price" label="Цена" rules={[{ required: true, message: 'Введите цену' }]}>
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="old_price" label="Старая цена">
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discount_percent" label="Скидка %">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="image_url" label="Основное изображение" rules={[{ required: !editing, message: 'Загрузите изображение' }]}>
            <ImageUpload />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sort_order" label="Порядок">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="is_active" label="Активен" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="is_new" label="Новинка" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="is_discount" label="Со скидкой" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
