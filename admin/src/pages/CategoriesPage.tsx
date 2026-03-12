import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Space, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as categoriesApi from '../api/categories';
import { ImageUpload } from '../components/ImageUpload';
import { useTr } from '../i18n';
import type { Category, SubCategory } from '../types';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const t = useTr();

  // Subcategory state
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [subParentId, setSubParentId] = useState<number | null>(null);
  const [subForm] = Form.useForm();

  // Subcategories map: categoryId -> SubCategory[]
  const [subcategoriesMap] = useState<Record<number, SubCategory[]>>({});
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data: resp } = await categoriesApi.getCategories();
      setCategories(resp.data ?? []);
    } catch {
      message.error(t('error_loading_categories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // --- Category CRUD ---
  const openModal = (category?: Category) => {
    setEditing(category ?? null);
    form.resetFields();
    if (category) form.setFieldsValue(category);
    else form.setFieldsValue({ sort_order: 0, is_active: true });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await categoriesApi.updateCategory(editing.id, values);
        message.success(t('category_updated'));
      } else {
        await categoriesApi.createCategory(values);
        message.success(t('category_created'));
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_category_title'),
      content: t('delete_category_content'),
      okText: t('delete'), cancelText: t('cancel'), okType: 'danger',
      onOk: async () => {
        try { await categoriesApi.deleteCategory(id); message.success(t('category_deleted')); fetchCategories(); }
        catch { message.error(t('error_deleting')); }
      },
    });
  };

  // --- Subcategory CRUD ---
  const openSubModal = (parentId: number, sub?: SubCategory) => {
    setSubParentId(parentId);
    setEditingSub(sub ?? null);
    subForm.resetFields();
    if (sub) subForm.setFieldsValue(sub);
    else subForm.setFieldsValue({ sort_order: 0, is_active: true });
    setSubModalOpen(true);
  };

  const handleSubSubmit = async () => {
    const values = await subForm.validateFields();
    try {
      if (editingSub) {
        await categoriesApi.updateSubCategory(editingSub.id, values);
        message.success(t('subcategory_updated'));
      } else {
        await categoriesApi.createSubCategory({ ...values, parent_id: subParentId! });
        message.success(t('subcategory_created'));
      }
      setSubModalOpen(false);
      fetchCategories();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleSubDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_subcategory_title'),
      okText: t('delete'), cancelText: t('cancel'), okType: 'danger',
      onOk: async () => {
        try { await categoriesApi.deleteSubCategory(id); message.success(t('subcategory_deleted')); fetchCategories(); }
        catch { message.error(t('error_deleting')); }
      },
    });
  };

  // --- Subcategory columns ---
  const subColumns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    {
      title: t('col_photo'), dataIndex: 'image_url', key: 'image_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : '—',
    },
    { title: t('col_name_ru'), dataIndex: 'name_ru', key: 'name_ru' },
    { title: t('col_name_tm'), dataIndex: 'name_tm', key: 'name_tm' },
    { title: t('label_sort_order'), dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    { title: t('col_active_f'), dataIndex: 'is_active', key: 'is_active', width: 80, render: (v: boolean) => v ? t('yes') : t('no') },
    {
      title: t('actions'), key: 'actions', width: 120,
      render: (_: unknown, record: SubCategory) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openSubModal(record.parent_id, record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleSubDelete(record.id)} />
        </Space>
      ),
    },
  ];

  // --- Main columns ---
  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    {
      title: t('col_photo'), dataIndex: 'image_url', key: 'image_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : '—',
    },
    { title: t('col_name_ru'), dataIndex: 'name_ru', key: 'name_ru' },
    { title: t('col_name_tm'), dataIndex: 'name_tm', key: 'name_tm' },
    { title: t('col_subcategories'), dataIndex: 'has_subcategories', key: 'has_subcategories', width: 120, render: (v: boolean) => v ? t('yes') : t('no') },
    { title: t('label_sort_order'), dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    { title: t('col_active_f'), dataIndex: 'is_active', key: 'is_active', width: 80, render: (v: boolean) => v ? t('yes') : t('no') },
    {
      title: t('actions'), key: 'actions', width: 180,
      render: (_: unknown, record: Category) => (
        <Space>
          {record.has_subcategories && (
            <Button icon={<PlusOutlined />} size="small" onClick={() => openSubModal(record.id)}>{t('subcat_short')}</Button>
          )}
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  // Expandable row for subcategories
  const expandedRowRender = (record: Category) => {
    if (!record.has_subcategories) return null;
    const subs = subcategoriesMap[record.id] ?? [];
    return (
      <Table
        columns={subColumns}
        dataSource={subs}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{ emptyText: t('no_subcategories') }}
      />
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>{t('categories_title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>{t('add')}</Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.has_subcategories,
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedKeys(prev => [...prev, record.id]);
            } else {
              setExpandedKeys(prev => prev.filter(k => k !== record.id));
            }
          },
        }}
      />

      {/* Category Modal */}
      <Modal
        title={editing ? t('modal_edit_category') : t('modal_new_category')}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={t('save')}
        cancelText={t('cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name_ru" label={t('label_name_ru')} rules={[{ required: true, message: t('validation_enter_name') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_tm" label={t('label_name_tm')} rules={[{ required: true, message: t('validation_enter_name') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_en" label={t('label_name_en')}>
            <Input />
          </Form.Item>
          <Form.Item name="image_url" label={t('label_image')}>
            <ImageUpload />
          </Form.Item>
          <Form.Item name="sort_order" label={t('label_sort_order_full')}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('col_active_f')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        title={editingSub ? t('modal_edit_subcategory') : t('modal_new_subcategory')}
        open={subModalOpen}
        onOk={handleSubSubmit}
        onCancel={() => setSubModalOpen(false)}
        okText={t('save')}
        cancelText={t('cancel')}
      >
        <Form form={subForm} layout="vertical">
          <Form.Item name="name_ru" label={t('label_name_ru')} rules={[{ required: true, message: t('validation_enter_name') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_tm" label={t('label_name_tm')} rules={[{ required: true, message: t('validation_enter_name') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_en" label={t('label_name_en')}>
            <Input />
          </Form.Item>
          <Form.Item name="image_url" label={t('label_image')}>
            <ImageUpload />
          </Form.Item>
          <Form.Item name="sort_order" label={t('label_sort_order_full')}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('col_active_f')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
