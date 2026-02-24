import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as adminsApi from '../api/admins';
import { ADMIN_ROLE_LABELS } from '../utils/constants';
import { formatDateTime } from '../utils/format';
import type { Admin } from '../types';

export const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form] = Form.useForm();

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data: resp } = await adminsApi.getAdmins();
      setAdmins(resp.data ?? []);
    } catch {
      message.error('Ошибка загрузки администраторов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const openModal = (admin?: Admin) => {
    setEditing(admin ?? null);
    form.resetFields();
    if (admin) form.setFieldsValue({ username: admin.username, full_name: admin.full_name, role: admin.role, is_active: admin.is_active });
    else form.setFieldsValue({ role: 'admin', is_active: true });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        const updateData: Record<string, unknown> = { ...values };
        if (!updateData.password) delete updateData.password;
        await adminsApi.updateAdmin(editing.id, updateData);
        message.success('Администратор обновлён');
      } else {
        await adminsApi.createAdmin(values);
        message.success('Администратор создан');
      }
      setModalOpen(false);
      fetchAdmins();
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Удалить администратора?',
      okText: 'Удалить', cancelText: 'Отмена', okType: 'danger',
      onOk: async () => {
        try { await adminsApi.deleteAdmin(id); message.success('Администратор удалён'); fetchAdmins(); }
        catch { message.error('Ошибка удаления'); }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Логин', dataIndex: 'username', key: 'username' },
    { title: 'Имя', dataIndex: 'full_name', key: 'full_name', render: (v: string) => v || '—' },
    { title: 'Роль', dataIndex: 'role', key: 'role', render: (v: string) => ADMIN_ROLE_LABELS[v] || v },
    { title: 'Активен', dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? 'Да' : 'Нет' },
    { title: 'Создан', dataIndex: 'created_at', key: 'created_at', render: (v: string) => formatDateTime(v) },
    {
      title: 'Действия', key: 'actions', width: 120,
      render: (_: unknown, record: Admin) => (
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
        <h2>Администраторы</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Добавить</Button>
      </div>
      <Table columns={columns} dataSource={admins} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? 'Редактировать' : 'Новый администратор'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText="Сохранить" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Логин" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={editing ? [] : [{ required: true, message: 'Введите пароль' }]}>
            <Input.Password placeholder={editing ? 'Оставьте пустым, чтобы не менять' : ''} />
          </Form.Item>
          <Form.Item name="full_name" label="Полное имя">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Роль" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="superadmin">Суперадмин</Select.Option>
              <Select.Option value="admin">Админ</Select.Option>
              <Select.Option value="manager">Менеджер</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="is_active" label="Активен" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
