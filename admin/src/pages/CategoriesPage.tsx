import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Space, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as categoriesApi from '../api/categories';
import { ImageUpload } from '../components/ImageUpload';
import type { Category, SubCategory } from '../types';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

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
      message.error('Ошибка загрузки категорий');
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
        message.success('Категория обновлена');
      } else {
        await categoriesApi.createCategory(values);
        message.success('Категория создана');
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить категорию?',
      content: 'Все подкатегории также будут удалены.',
      okText: 'Удалить', cancelText: 'Отмена', okType: 'danger',
      onOk: async () => {
        try { await categoriesApi.deleteCategory(id); message.success('Категория удалена'); fetchCategories(); }
        catch { message.error('Ошибка удаления'); }
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
        message.success('Подкатегория обновлена');
      } else {
        await categoriesApi.createSubCategory({ ...values, parent_id: subParentId! });
        message.success('Подкатегория создана');
      }
      setSubModalOpen(false);
      fetchCategories();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleSubDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить подкатегорию?',
      okText: 'Удалить', cancelText: 'Отмена', okType: 'danger',
      onOk: async () => {
        try { await categoriesApi.deleteSubCategory(id); message.success('Подкатегория удалена'); fetchCategories(); }
        catch { message.error('Ошибка удаления'); }
      },
    });
  };

  // --- Subcategory columns ---
  const subColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Фото', dataIndex: 'image_url', key: 'image_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : '—',
    },
    { title: 'Название (RU)', dataIndex: 'name_ru', key: 'name_ru' },
    { title: 'Название (TM)', dataIndex: 'name_tm', key: 'name_tm' },
    { title: 'Порядок', dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    { title: 'Активна', dataIndex: 'is_active', key: 'is_active', width: 80, render: (v: boolean) => v ? 'Да' : 'Нет' },
    {
      title: 'Действия', key: 'actions', width: 120,
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
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Фото', dataIndex: 'image_url', key: 'image_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : '—',
    },
    { title: 'Название (RU)', dataIndex: 'name_ru', key: 'name_ru' },
    { title: 'Название (TM)', dataIndex: 'name_tm', key: 'name_tm' },
    { title: 'Подкатегории', dataIndex: 'has_subcategories', key: 'has_subcategories', width: 120, render: (v: boolean) => v ? 'Да' : 'Нет' },
    { title: 'Порядок', dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    { title: 'Активна', dataIndex: 'is_active', key: 'is_active', width: 80, render: (v: boolean) => v ? 'Да' : 'Нет' },
    {
      title: 'Действия', key: 'actions', width: 180,
      render: (_: unknown, record: Category) => (
        <Space>
          {record.has_subcategories && (
            <Button icon={<PlusOutlined />} size="small" onClick={() => openSubModal(record.id)}>Подкат.</Button>
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
        locale={{ emptyText: 'Нет подкатегорий' }}
      />
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Категории</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Добавить</Button>
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
        title={editing ? 'Редактировать категорию' : 'Новая категория'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name_ru" label="Название (RU)" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_tm" label="Название (TM)" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image_url" label="Изображение">
            <ImageUpload />
          </Form.Item>
          <Form.Item name="sort_order" label="Порядок сортировки">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label="Активна" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        title={editingSub ? 'Редактировать подкатегорию' : 'Новая подкатегория'}
        open={subModalOpen}
        onOk={handleSubSubmit}
        onCancel={() => setSubModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={subForm} layout="vertical">
          <Form.Item name="name_ru" label="Название (RU)" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_tm" label="Название (TM)" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image_url" label="Изображение">
            <ImageUpload />
          </Form.Item>
          <Form.Item name="sort_order" label="Порядок сортировки">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label="Активна" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
