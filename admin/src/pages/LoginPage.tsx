import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth';
import { useLocaleStore, type Locale } from '../store/locale';
import { useTr } from '../i18n';

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const { locale, setLocale } = useLocaleStore();
  const t = useTr();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      navigate('/dashboard');
    } catch {
      message.error(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card style={{ width: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Select
            value={locale}
            onChange={(v: Locale) => setLocale(v)}
            size="small"
            style={{ width: 110 }}
            suffixIcon={<GlobalOutlined />}
            options={[
              { value: 'ru', label: 'Русский' },
              { value: 'tm', label: 'Türkmen' },
              { value: 'en', label: 'English' },
            ]}
          />
        </div>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          {t('login_title')}
        </Typography.Title>
        <Form onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: t('login_username_required') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('login_username_placeholder')} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('login_password_required') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('login_password_placeholder')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('login_button')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
