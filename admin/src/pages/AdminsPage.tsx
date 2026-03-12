import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as adminsApi from '../api/admins';
import { ADMIN_ROLE_I18N } from '../utils/constants';
import { formatDateTime } from '../utils/format';
import { useTr } from '../i18n';
import type { Admin } from '../types';

export const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form] = Form.useForm();
  const t = useTr();

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data: resp } = await adminsApi.getAdmins();
      setAdmins(resp.data ?? []);
    } catch {
      message.error(t('error_loading_admins'));
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
        message.success(t('admin_updated'));
      } else {
        await adminsApi.createAdmin(values);
        message.success(t('admin_created'));
      }
      setModalOpen(false);
      fetchAdmins();
    } catch {
      message.error(t('error_saving'));
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('delete_admin_title'),
      okText: t('delete'), cancelText: t('cancel'), okType: 'danger',
      onOk: async () => {
        try { await adminsApi.deleteAdmin(id); message.success(t('admin_deleted')); fetchAdmins(); }
        catch { message.error(t('error_deleting')); }
      },
    });
  };

  const columns = [
    { title: t('col_id'), dataIndex: 'id', key: 'id', width: 60 },
    { title: t('col_login'), dataIndex: 'username', key: 'username' },
    { title: t('col_fullname'), dataIndex: 'full_name', key: 'full_name', render: (v: string) => v || '—' },
    {
      title: t('col_role'), dataIndex: 'role', key: 'role',
      render: (v: string) => {
        const i18nKey = ADMIN_ROLE_I18N[v];
        return i18nKey ? t(i18nKey) : v;
      },
    },
    { title: t('col_active'), dataIndex: 'is_active', key: 'is_active', width: 100, render: (v: boolean) => v ? t('yes') : t('no') },
    { title: t('col_created'), dataIndex: 'created_at', key: 'created_at', render: (v: string) => formatDateTime(v) },
    {
      title: t('actions'), key: 'actions', width: 120,
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
        <h2>{t('admins_title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>{t('add')}</Button>
      </div>
      <Table columns={columns} dataSource={admins} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? t('modal_edit_admin') : t('modal_new_admin')} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText={t('save')} cancelText={t('cancel')}>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label={t('label_login')} rules={[{ required: true, message: t('validation_enter_login') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label={t('label_password')} rules={editing ? [] : [{ required: true, message: t('validation_enter_password') }]}>
            <Input.Password placeholder={editing ? t('password_keep_empty') : ''} />
          </Form.Item>
          <Form.Item name="full_name" label={t('label_fullname')}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label={t('label_role')} rules={[{ required: true }]}>
            <Select>
              <Select.Option value="superadmin">{t('role_superadmin')}</Select.Option>
              <Select.Option value="admin">{t('role_admin')}</Select.Option>
              <Select.Option value="manager">{t('role_manager')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="is_active" label={t('col_active')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
