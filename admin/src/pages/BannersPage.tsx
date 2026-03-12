import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Select, Space, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as bannersApi from '../api/banners';
import { ImageUpload } from '../components/ImageUpload';
import { useTr } from '../i18n';
import type { Banner } from '../types';

export const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form] = Form.useForm();
  const t = useTr();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data: resp } = await bannersApi.getBanners();
      setBanners(resp.data ?? []);
    } catch {
      message.error(t('error_loading_banners'));
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
        message.success(t('banner_updated'));
      } else {
        await bannersApi.createBanner(values);
        message.success(t('banner_created'));
      }
      setModalOpen(false);
      fetchBanners();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_banner_title'),
      okText: t('delete'),
      cancelText: t('cancel'),
      okType: 'danger',
      onOk: async () => {
        try {
          await bannersApi.deleteBanner(id);
          message.success(t('banner_deleted'));
          fetchBanners();
        } catch {
          message.error(t('error_deleting'));
        }
      },
    });
  };

  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    {
      title: t('col_image'), dataIndex: 'image_url', key: 'image_url', width: 150,
      render: (url: string) => <Image src={url} width={120} height={60} style={{ objectFit: 'cover' }} />,
    },
    { title: t('col_link_type'), dataIndex: 'link_type', key: 'link_type', render: (v: string) => v || '—' },
    { title: t('col_link_value'), dataIndex: 'link_value', key: 'link_value', render: (v: string) => v || '—' },
    { title: t('label_sort_order'), dataIndex: 'sort_order', key: 'sort_order', width: 100 },
    { title: t('col_active'), dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? t('yes') : t('no') },
    {
      title: t('actions'), key: 'actions', width: 120,
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
        <h2>{t('banners_title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>{t('add')}</Button>
      </div>
      <Table columns={columns} dataSource={banners} rowKey="id" loading={loading} pagination={false} />
      <Modal
        title={editing ? t('modal_edit_banner') : t('modal_new_banner')}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={t('save')}
        cancelText={t('cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="image_url" label={t('label_image')} rules={[{ required: !editing, message: t('validation_upload_image') }]}>
            <ImageUpload />
          </Form.Item>
          <Form.Item name="link_type" label={t('label_link_type')}>
            <Select allowClear placeholder={t('link_type_none')}>
              <Select.Option value="category">{t('link_type_category')}</Select.Option>
              <Select.Option value="brand">{t('link_type_brand')}</Select.Option>
              <Select.Option value="product">{t('link_type_product')}</Select.Option>
              <Select.Option value="url">{t('link_type_url')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="link_value" label={t('label_link_value')}>
            <Input placeholder={t('link_value_placeholder')} />
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
