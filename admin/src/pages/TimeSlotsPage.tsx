import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as slotsApi from '../api/time-slots';
import { useTr } from '../i18n';
import type { TimeSlot } from '../types';

export const TimeSlotsPage = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimeSlot | null>(null);
  const [form] = Form.useForm();
  const t = useTr();

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const { data: resp } = await slotsApi.getTimeSlots();
      setSlots(resp.data ?? []);
    } catch {
      message.error(t('error_loading_slots'));
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
        message.success(t('slot_updated'));
      } else {
        await slotsApi.createTimeSlot(values);
        message.success(t('slot_created'));
      }
      setModalOpen(false);
      fetchSlots();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_slot_title'),
      okText: t('delete'), cancelText: t('cancel'), okType: 'danger',
      onOk: async () => {
        try { await slotsApi.deleteTimeSlot(id); message.success(t('slot_deleted')); fetchSlots(); }
        catch { message.error(t('error_deleting')); }
      },
    });
  };

  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    { title: t('col_start'), dataIndex: 'start_time', key: 'start_time' },
    { title: t('col_end'), dataIndex: 'end_time', key: 'end_time' },
    { title: t('col_label'), dataIndex: 'label', key: 'label' },
    { title: t('col_active'), dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? t('yes') : t('no') },
    {
      title: t('actions'), key: 'actions', width: 120,
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
        <h2>{t('time_slots_title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>{t('add')}</Button>
      </div>
      <Table columns={columns} dataSource={slots} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? t('modal_edit_slot') : t('modal_new_slot')} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText={t('save')} cancelText={t('cancel')}>
        <Form form={form} layout="vertical">
          <Form.Item name="start_time" label={t('label_start_time')} rules={[{ required: true, message: t('validation_enter_time') }]}>
            <Input placeholder="09:00" />
          </Form.Item>
          <Form.Item name="end_time" label={t('label_end_time')} rules={[{ required: true, message: t('validation_enter_time') }]}>
            <Input placeholder="12:00" />
          </Form.Item>
          <Form.Item name="label" label={t('label_label')} rules={[{ required: true, message: t('validation_enter_label') }]}>
            <Input placeholder="09:00 - 12:00" />
          </Form.Item>
          <Form.Item name="is_active" label={t('col_active')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
