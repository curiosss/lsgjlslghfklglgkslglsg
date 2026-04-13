import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Typography, Select } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagOutlined,
  PictureOutlined,
  OrderedListOutlined,
  CarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/auth';
import { useAppStore } from '../store/app';
import { useLocaleStore, type Locale } from '../store/locale';
import { useTr } from '../i18n';

const { Header, Sider, Content } = Layout;

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { locale, setLocale } = useLocaleStore();
  const { token } = theme.useToken();
  const t = useTr();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: t('nav_dashboard') },
    { key: '/products', icon: <ShoppingOutlined />, label: t('nav_products') },
    { key: '/categories', icon: <AppstoreOutlined />, label: t('nav_categories') },
    { key: '/brands', icon: <TagOutlined />, label: t('nav_brands') },
    { key: '/banners', icon: <PictureOutlined />, label: t('nav_banners') },
    { key: '/orders', icon: <OrderedListOutlined />, label: t('nav_orders') },
    { key: '/delivery-zones', icon: <CarOutlined />, label: t('nav_delivery_zones') },
    { key: '/time-slots', icon: <ClockCircleOutlined />, label: t('nav_time_slots') },
    { key: '/not-reviewed-products', icon: <ShoppingOutlined />, label: 'Непроверенные товары' },
    { key: '/pos-users', icon: <TeamOutlined />, label: 'POS Интеграция' },
    ...(admin?.role === 'superadmin'
      ? [{ key: '/admins', icon: <TeamOutlined />, label: t('nav_admins') }]
      : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={toggleSidebar}
        breakpoint="lg"
        theme="dark"
        trigger={null}
      >
        <div style={{ height: 48, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography.Text strong style={{ color: '#fff', fontSize: sidebarCollapsed ? 14 : 18 }}>
            {sidebarCollapsed ? t('sidebar_title_short') : t('sidebar_title')}
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Select
              value={locale}
              onChange={(v: Locale) => setLocale(v)}
              size="small"
              style={{ width: 100 }}
              suffixIcon={<GlobalOutlined />}
              options={[
                { value: 'ru', label: 'Русский' },
                { value: 'tm', label: 'Türkmen' },
                { value: 'en', label: 'English' },
              ]}
            />
            <Typography.Text>{admin?.full_name || admin?.username}</Typography.Text>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              {t('logout')}
            </Button>
          </div>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
