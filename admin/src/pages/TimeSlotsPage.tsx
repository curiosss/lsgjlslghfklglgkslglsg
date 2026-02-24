import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as slotsApi from '../api/time-slots';
import type { TimeSlot } from '../types';

export const TimeSlotsPage = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimeSlot | null>(null);
  const [form] = Form.useForm();

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const { data: resp } = await slotsApi.getTimeSlots();
      setSlots(resp.data ?? []);
    } catch {
      message.error('Ошибка загрузки временных слотов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const openModal = (slot?: TimeSlot) => {
    setEditing(slot ?? null);
    form.resetFields();
    if (slot) form.setFieldsValue(slot);
    else form.setFieldsValue({ is_active: true });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await slotsApi.updateTimeSlot(editing.id, values);
        message.success('Слот обновлён');
      } else {
        await slotsApi.createTimeSlot(values);
        message.success('Слот создан');
      }
      setModalOpen(false);
      fetchSlots();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить временной слот?',
      okText: 'Удалить', cancelText: 'Отмена', okType: 'danger',
      onOk: async () => {
        try { await slotsApi.deleteTimeSlot(id); message.success('Слот удалён'); fetchSlots(); }
        catch { message.error('Ошибка удаления'); }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Начало', dataIndex: 'start_time', key: 'start_time' },
    { title: 'Конец', dataIndex: 'end_time', key: 'end_time' },
    { title: 'Метка', dataIndex: 'label', key: 'label' },
    { title: 'Активен', dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? 'Да' : 'Нет' },
    {
      title: 'Действия', key: 'actions', width: 120,
      render: (_: unknown, record: TimeSlot) => (
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
        <h2>Временные слоты</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Добавить</Button>
      </div>
      <Table columns={columns} dataSource={slots} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? 'Редактировать слот' : 'Новый слот'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText="Сохранить" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="start_time" label="Время начала" rules={[{ required: true, message: 'Введите время' }]}>
            <Input placeholder="09:00" />
          </Form.Item>
          <Form.Item name="end_time" label="Время окончания" rules={[{ required: true, message: 'Введите время' }]}>
            <Input placeholder="12:00" />
          </Form.Item>
          <Form.Item name="label" label="Метка" rules={[{ required: true, message: 'Введите метку' }]}>
            <Input placeholder="Утро (09:00 - 12:00)" />
          </Form.Item>
          <Form.Item name="is_active" label="Активен" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
