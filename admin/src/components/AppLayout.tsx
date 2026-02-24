import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Typography } from 'antd';
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
} from '@ant-design/icons';
import { useAuthStore } from '../store/auth';
import { useAppStore } from '../store/app';

const { Header, Sider, Content } = Layout;

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/products', icon: <ShoppingOutlined />, label: 'Товары' },
    { key: '/categories', icon: <AppstoreOutlined />, label: 'Категории' },
    { key: '/brands', icon: <TagOutlined />, label: 'Бренды' },
    { key: '/banners', icon: <PictureOutlined />, label: 'Баннеры' },
    { key: '/orders', icon: <OrderedListOutlined />, label: 'Заказы' },
    { key: '/delivery-zones', icon: <CarOutlined />, label: 'Зоны доставки' },
    { key: '/time-slots', icon: <ClockCircleOutlined />, label: 'Временные слоты' },
    ...(admin?.role === 'superadmin'
      ? [{ key: '/admins', icon: <TeamOutlined />, label: 'Администраторы' }]
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
      >
        <div style={{ height: 48, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography.Text strong style={{ color: '#fff', fontSize: sidebarCollapsed ? 14 : 18 }}>
            {sidebarCollapsed ? 'CA' : 'Commerce Admin'}
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
            <Typography.Text>{admin?.full_name || admin?.username}</Typography.Text>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              Выход
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
