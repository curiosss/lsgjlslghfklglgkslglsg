import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as zonesApi from '../api/delivery-zones';
import type { DeliveryZone } from '../types';

export const DeliveryZonesPage = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [form] = Form.useForm();

  const fetchZones = async () => {
    setLoading(true);
    try {
      const { data: resp } = await zonesApi.getDeliveryZones();
      setZones(resp.data ?? []);
    } catch {
      message.error('Ошибка загрузки зон доставки');
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
        message.success('Зона обновлена');
      } else {
        await zonesApi.createDeliveryZone(values);
        message.success('Зона создана');
      }
      setModalOpen(false);
      fetchZones();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить зону доставки?',
      okText: 'Удалить', cancelText: 'Отмена', okType: 'danger',
      onOk: async () => {
        try { await zonesApi.deleteDeliveryZone(id); message.success('Зона удалена'); fetchZones(); }
        catch { message.error('Ошибка удаления'); }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Название (RU)', dataIndex: 'name_ru', key: 'name_ru' },
    { title: 'Название (TM)', dataIndex: 'name_tm', key: 'name_tm' },
    { title: 'Цена доставки', dataIndex: 'delivery_price', key: 'delivery_price', render: (v: number) => `${v.toFixed(2)} m.` },
    { title: 'Активна', dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? 'Да' : 'Нет' },
    {
      title: 'Действия', key: 'actions', width: 120,
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
        <h2>Зоны доставки</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Добавить</Button>
      </div>
      <Table columns={columns} dataSource={zones} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? 'Редактировать зону' : 'Новая зона'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText="Сохранить" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="name_ru" label="Название (RU)" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_tm" label="Название (TM)" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="delivery_price" label="Цена доставки" rules={[{ required: true, message: 'Введите цену' }]}>
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label="Активна" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
