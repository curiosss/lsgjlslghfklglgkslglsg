import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Space, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as brandsApi from '../api/brands';
import { ImageUpload } from '../components/ImageUpload';
import { useTr } from '../i18n';
import type { Brand } from '../types';

export const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form] = Form.useForm();
  const t = useTr();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data: resp } = await brandsApi.getBrands();
      setBrands(resp.data ?? []);
    } catch {
      message.error(t('error_loading_brands'));
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
        message.success(t('brand_updated'));
      } else {
        await brandsApi.createBrand(values);
        message.success(t('brand_created'));
      }
      setModalOpen(false);
      fetchBrands();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_brand_title'),
      content: t('delete_brand_content'),
      okText: t('delete'),
      cancelText: t('cancel'),
      okType: 'danger',
      onOk: async () => {
        try {
          await brandsApi.deleteBrand(id);
          message.success(t('brand_deleted'));
          fetchBrands();
        } catch {
          message.error(t('error_deleting'));
        }
      },
    });
  };

  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    {
      title: t('col_logo'), dataIndex: 'logo_url', key: 'logo_url', width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : '—',
    },
    { title: t('col_name'), dataIndex: 'name', key: 'name' },
    { title: t('label_sort_order'), dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    {
      title: t('col_active'), dataIndex: 'is_active', key: 'is_active', width: 100,
      render: (v: boolean) => v ? t('yes') : t('no'),
    },
    {
      title: t('actions'), key: 'actions', width: 120,
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
        <h2>{t('brands_title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>{t('add')}</Button>
      </div>
      <Table columns={columns} dataSource={brands} rowKey="id" loading={loading} pagination={false} />
      <Modal
        title={editing ? t('modal_edit_brand') : t('modal_new_brand')}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={t('save')}
        cancelText={t('cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('label_name')} rules={[{ required: true, message: t('validation_enter_name') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logo_url" label={t('label_logo')}>
            <ImageUpload />
          </Form.Item>
          <Form.Item name="sort_order" label={t('label_sort_order_full')}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('col_active')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
