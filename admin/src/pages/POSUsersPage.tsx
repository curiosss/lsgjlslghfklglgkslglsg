import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message } from 'antd';
import type { POSUser, CreatePOSUserRequest, UpdatePOSUserRequest } from '../types/pos-user';
import { getPOSUsers, createPOSUser, updatePOSUser, deletePOSUser } from '../api/pos-users';

export default function POSUsersPage() {
  const [users, setUsers] = useState<POSUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<POSUser | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getPOSUsers();
      setUsers(response.data ?? []);
    } catch (error) {
      console.error(error);
      message.error('Ошибка загрузки POS пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user?: POSUser) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
      form.setFieldsValue({ is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (editingUser) {
        const req: UpdatePOSUserRequest = {
          username: values.username,
          is_active: values.is_active,
        };
        if (values.password) {
          req.password = values.password;
        }
        await updatePOSUser(editingUser.id, req);
        message.success('Пользователь обновлен');
      } else {
        const req: CreatePOSUserRequest = {
          username: values.username,
          password: values.password,
          is_active: values.is_active,
        };
        await createPOSUser(req);
        message.success('Пользователь создан');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Удалить пользователя?',
      onOk: async () => {
        try {
          await deletePOSUser(id);
          message.success('Удалено');
          fetchUsers();
        } catch (error) {
          message.error('Ошибка при удалении');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (val: boolean) => (val ? '✅ Акт.' : '❌ Неакт.'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: POSUser) => (
        <div>
          <Button type="link" onClick={() => openModal(record)}>
            Редактировать
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>POS Пользователи</h2>
        <Button type="primary" onClick={() => openModal()}>
          + Добавить пользователя
        </Button>
      </div>
      <Table dataSource={users} columns={columns} loading={loading} rowKey="id" />

      <Modal
        title={editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Введите username' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={editingUser ? 'Пароль (оставьте пустым, если не меняете)' : 'Пароль'}
            rules={[{ required: !editingUser, message: 'Введите пароль' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="is_active" valuePropName="checked" label="Активен">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
