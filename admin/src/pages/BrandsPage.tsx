import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Space, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as brandsApi from '../api/brands';
import { ImageUpload } from '../components/ImageUpload';
import type { Brand } from '../types';

export const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data: resp } = await brandsApi.getBrands();
      setBrands(resp.data ?? []);
    } catch {
      message.error('Ошибка загрузки брендов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const openModal = (brand?: Brand) => {
    setEditing(brand ?? null);
    form.resetFields();
    if (brand) {
      form.setFieldsValue(brand);
    } else {
      form.setFieldsValue({ sort_order: 0, is_active: true });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await brandsApi.updateBrand(editing.id, values);
        message.success('Бренд обновлён');
      } else {
        await brandsApi.createBrand(values);
        message.success('Бренд создан');
      }
      setModalOpen(false);
      fetchBrands();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить бренд?',
      content: 'Это действие нельзя отменить.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',
      onOk: async () => {
        try {
          await brandsApi.deleteBrand(id);
          message.success('Бренд удалён');
          fetchBrands();
        } catch {
          message.error('Ошибка удаления');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Лого', dataIndex: 'logo_url', key: 'logo_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : '—',
    },
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Порядок', dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    {
      title: 'Активен', dataIndex: 'is_active', key: 'is_active', width: 100,
      render: (v: boolean) => v ? 'Да' : 'Нет',
    },
    {
      title: 'Действия', key: 'actions', width: 120,
      render: (_: unknown, record: Brand) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Бренды</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Добавить</Button>
      </div>
      <Table columns={columns} dataSource={brands} rowKey="id" loading={loading} pagination={false} />
      <Modal
        title={editing ? 'Редактировать бренд' : 'Новый бренд'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logo_url" label="Логотип">
            <ImageUpload />
          </Form.Item>
          <Form.Item name="sort_order" label="Порядок сортировки">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label="Активен" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
