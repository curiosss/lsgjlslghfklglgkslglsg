import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Select, Space, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as bannersApi from '../api/banners';
import { ImageUpload } from '../components/ImageUpload';
import type { Banner } from '../types';

export const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form] = Form.useForm();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data: resp } = await bannersApi.getBanners();
      setBanners(resp.data ?? []);
    } catch {
      message.error('Ошибка загрузки баннеров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openModal = (banner?: Banner) => {
    setEditing(banner ?? null);
    form.resetFields();
    if (banner) {
      form.setFieldsValue(banner);
    } else {
      form.setFieldsValue({ sort_order: 0, is_active: true });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await bannersApi.updateBanner(editing.id, values);
        message.success('Баннер обновлён');
      } else {
        await bannersApi.createBanner(values);
        message.success('Баннер создан');
      }
      setModalOpen(false);
      fetchBanners();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить баннер?',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',
      onOk: async () => {
        try {
          await bannersApi.deleteBanner(id);
          message.success('Баннер удалён');
          fetchBanners();
        } catch {
          message.error('Ошибка удаления');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Изображение', dataIndex: 'image_url', key: 'image_url', width: 150,
      render: (url: string) => <Image src={url} width={120} height={60} style={{ objectFit: 'cover' }} />,
    },
    { title: 'Тип ссылки', dataIndex: 'link_type', key: 'link_type', render: (v: string) => v || '—' },
    { title: 'Значение ссылки', dataIndex: 'link_value', key: 'link_value', render: (v: string) => v || '—' },
    { title: 'Порядок', dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    { title: 'Активен', dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? 'Да' : 'Нет' },
    {
      title: 'Действия', key: 'actions', width: 120,
      render: (_: unknown, record: Banner) => (
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
        <h2>Баннеры</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Добавить</Button>
      </div>
      <Table columns={columns} dataSource={banners} rowKey="id" loading={loading} pagination={false} />
      <Modal
        title={editing ? 'Редактировать баннер' : 'Новый баннер'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="image_url" label="Изображение" rules={[{ required: !editing, message: 'Загрузите изображение' }]}>
            <ImageUpload />
          </Form.Item>
          <Form.Item name="link_type" label="Тип ссылки">
            <Select allowClear placeholder="Без ссылки">
              <Select.Option value="category">Категория</Select.Option>
              <Select.Option value="brand">Бренд</Select.Option>
              <Select.Option value="product">Товар</Select.Option>
              <Select.Option value="url">URL</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="link_value" label="Значение ссылки">
            <Input placeholder="ID или URL" />
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
