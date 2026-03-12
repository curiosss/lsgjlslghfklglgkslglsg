import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as zonesApi from '../api/delivery-zones';
import { useTr } from '../i18n';
import type { DeliveryZone } from '../types';

export const DeliveryZonesPage = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [form] = Form.useForm();
  const t = useTr();

  const fetchZones = async () => {
    setLoading(true);
    try {
      const { data: resp } = await zonesApi.getDeliveryZones();
      setZones(resp.data ?? []);
    } catch {
      message.error(t('error_loading_zones'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchZones(); }, []);

  const openModal = (zone?: DeliveryZone) => {
    setEditing(zone ?? null);
    form.resetFields();
    if (zone) form.setFieldsValue(zone);
    else form.setFieldsValue({ delivery_price: 0, is_active: true });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await zonesApi.updateDeliveryZone(editing.id, values);
        message.success(t('zone_updated'));
      } else {
        await zonesApi.createDeliveryZone(values);
        message.success(t('zone_created'));
      }
      setModalOpen(false);
      fetchZones();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_zone_title'),
      okText: t('delete'), cancelText: t('cancel'), okType: 'danger',
      onOk: async () => {
        try { await zonesApi.deleteDeliveryZone(id); message.success(t('zone_deleted')); fetchZones(); }
        catch { message.error(t('error_deleting')); }
      },
    });
  };

  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    { title: t('col_name_ru'), dataIndex: 'name_ru', key: 'name_ru' },
    { title: t('col_name_tm'), dataIndex: 'name_tm', key: 'name_tm' },
    { title: t('col_delivery_price'), dataIndex: 'delivery_price', key: 'delivery_price', render: (v: number) => `${v.toFixed(2)} m.` },
    { title: t('col_active_f'), dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? t('yes') : t('no') },
    {
      title: t('actions'), key: 'actions', width: 120,
      render: (_: unknown, record: DeliveryZone) => (
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
        <h2>{t('delivery_zones_title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>{t('add')}</Button>
      </div>
      <Table columns={columns} dataSource={zones} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? t('modal_edit_zone') : t('modal_new_zone')} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText={t('save')} cancelText={t('cancel')}>
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
          <Form.Item name="delivery_price" label={t('label_delivery_price')} rules={[{ required: true, message: t('validation_enter_price') }]}>
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('col_active_f')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
