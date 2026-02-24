# 🛠️ Commerce — Admin Panel Technical Specification (React)

> Панель администрирования для e-commerce приложения.
> Управление товарами, категориями, брендами, баннерами, заказами, зонами доставки и администраторами.

---

## 1. Обзор проекта

| Параметр | Значение |
|---|---|
| Название | Commerce Admin |
| Фреймворк | React 19 + TypeScript |
| Сборка | Vite |
| UI библиотека | Ant Design (`antd`) |
| State Management | Zustand |
| HTTP | Axios |
| Роутинг | React Router v7 |
| Формы | Ant Design Form (встроенная) |
| Таблицы | Ant Design Table (встроенная) |
| Auth | JWT (access + refresh tokens) |
| Язык интерфейса | Русский (фиксированный) |
| Порт | `3001` |

---

## 2. Дизайн

### 2.1 Layout

```
┌──────────────────────────────────────────────────────────────┐
│  COMMERCE ADMIN                          👤 Admin ▾  [Выход] │  ← Header
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ 📊 Dashboard│           CONTENT AREA                         │
│ 📦 Товары   │                                                │
│ 📂 Категории│    (Tables, Forms, Stats)                      │
│ 🏷️ Бренды   │                                                │
│ 🖼️ Баннеры  │                                                │
│ 📋 Заказы   │                                                │
│ 🚗 Доставка │                                                │
│ ⏰ Слоты    │                                                │
│ 👥 Админы   │                                                │
│          │                                                   │
├──────────┴───────────────────────────────────────────────────┤
│  © 2026 Commerce Admin                                       │  ← Footer
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Стилизация

- Тема Ant Design с минимальными кастомизациями
- Primary color: `#000000`
- Compact layout, `Sider` с collapsed mode
- Таблицы: striped rows, pagination, column sorting
- Формы: modal / drawer для создания/редактирования

---

## 3. Архитектура

### 3.1 Структура папок

```
admin/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Router + Layout
│   │
│   ├── api/
│   │   ├── client.ts                     # Axios instance + interceptors
│   │   ├── products.ts                   # Product API calls
│   │   ├── categories.ts                 # Category API calls
│   │   ├── brands.ts                     # Brand API calls
│   │   ├── banners.ts                    # Banner API calls
│   │   ├── orders.ts                     # Order API calls
│   │   ├── delivery-zones.ts            # Delivery zones API calls
│   │   ├── time-slots.ts               # Time slots API calls
│   │   ├── admins.ts                    # Admin users API calls
│   │   ├── upload.ts                    # File upload API
│   │   └── auth.ts                      # Auth API (login, refresh, me)
│   │
│   ├── store/
│   │   ├── auth.ts                      # Auth store (token, admin, login/logout)
│   │   └── app.ts                       # App store (sidebar collapsed, etc.)
│   │
│   ├── types/
│   │   ├── product.ts                   # Product, ProductAdmin interfaces
│   │   ├── category.ts                  # Category, SubCategory interfaces
│   │   ├── brand.ts                     # Brand interfaces
│   │   ├── banner.ts                    # Banner interfaces
│   │   ├── order.ts                     # Order, OrderItem interfaces
│   │   ├── delivery-zone.ts            # DeliveryZone interfaces
│   │   ├── time-slot.ts               # TimeSlot interfaces
│   │   ├── admin.ts                    # Admin interfaces
│   │   └── api.ts                      # ApiResponse<T>, Pagination, ApiError
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx               # Страница авторизации
│   │   ├── DashboardPage.tsx           # Статистика (кол-во товаров, заказов и т.д.)
│   │   ├── ProductsPage.tsx            # Таблица товаров + CRUD
│   │   ├── CategoriesPage.tsx          # Таблица категорий + подкатегории + CRUD
│   │   ├── BrandsPage.tsx              # Таблица брендов + CRUD
│   │   ├── BannersPage.tsx             # Таблица баннеров + CRUD
│   │   ├── OrdersPage.tsx              # Таблица заказов + смена статуса
│   │   ├── OrderDetailPage.tsx         # Детальный вид заказа
│   │   ├── DeliveryZonesPage.tsx       # Таблица зон + CRUD
│   │   ├── TimeSlotsPage.tsx           # Таблица слотов + CRUD
│   │   └── AdminsPage.tsx             # Управление администраторами
│   │
│   ├── components/
│   │   ├── AppLayout.tsx               # Layout: Header + Sider + Content
│   │   ├── ProtectedRoute.tsx          # Auth guard
│   │   ├── ImageUpload.tsx             # Компонент загрузки изображений
│   │   ├── StatusTag.tsx               # Цветной тег статуса заказа
│   │   └── LocalizedInput.tsx          # Двуязычные инпуты (RU + TM)
│   │
│   └── utils/
│       ├── constants.ts                # API_BASE_URL, etc.
│       ├── format.ts                   # Форматирование цен, дат
│       └── token.ts                    # Get/set/remove tokens from localStorage
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

---

## 4. Авторизация

### 4.1 Login Page

```
┌─────────────────────────────────────────┐
│                                         │
│           COMMERCE ADMIN                │
│                                         │
│     ┌───────────────────────────┐       │
│     │  Логин                    │       │
│     └───────────────────────────┘       │
│     ┌───────────────────────────┐       │
│     │  Пароль                   │       │
│     └───────────────────────────┘       │
│                                         │
│     [████████ Войти ████████]           │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Auth Store (Zustand)

```typescript
interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### 4.3 Axios Interceptors

```typescript
// Request: добавляем Authorization header
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: при 401 → пробуем refresh → если не удалось → logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      // If fails → logout → redirect to /login
    }
    return Promise.reject(error);
  }
);
```

---

## 5. Страницы

### 5.1 Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Панель управления                                          │
├─────────────┬───────────────┬───────────────┬──────────────┤
│  📦 Товары  │ 📂 Категории  │ 🏷️ Бренды     │ 📋 Заказы    │
│     256     │      18       │      45       │     1,234    │
├─────────────┴───────────────┴───────────────┴──────────────┤
│                                                             │
│  Последние заказы                                          │
│  ┌───────┬──────────┬───────────┬────────┬───────────────┐ │
│  │ #     │ Клиент   │ Сумма     │ Статус │ Дата          │ │
│  ├───────┼──────────┼───────────┼────────┼───────────────┤ │
│  │ #1234 │ Иванов   │ 44,00 m.  │ Новый  │ 24.02.2026   │ │
│  │ #1233 │ Петров   │ 120,00 m. │ Подтв. │ 24.02.2026   │ │
│  └───────┴──────────┴───────────┴────────┴───────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Карточки:** `antd Statistic` + `Card`
**Таблица:** `antd Table` с последними 10 заказами

---

### 5.2 Products Page (Товары)

```
┌─────────────────────────────────────────────────────────────┐
│  Товары                              [+ Добавить товар]     │
├─────────────────────────────────────────────────────────────┤
│  Фильтры: [Категория ▾] [Бренд ▾] [Поиск...        ] 🔍  │
├─────────────────────────────────────────────────────────────┤
│  ┌───┬───────┬──────────┬───────┬────────┬────────┬──────┐ │
│  │ # │ Фото  │ Название │ Бренд │  Цена  │ Статус │  ⚙️  │ │
│  ├───┼───────┼──────────┼───────┼────────┼────────┼──────┤ │
│  │ 1 │ [img] │ Крем BB  │GARNIER│ 117.00 │ ✅ Акт │ ✏️🗑 │ │
│  │ 2 │ [img] │ Порошок  │ ARIEL │  85.00 │ ✅ Акт │ ✏️🗑 │ │
│  │ 3 │ [img] │ Шампунь  │ H&S   │  45.00 │ ❌ Скр │ ✏️🗑 │ │
│  └───┴───────┴──────────┴───────┴────────┴────────┴──────┘ │
│                         [< 1 2 3 ... 8 >]                  │
└─────────────────────────────────────────────────────────────┘
```

**Таблица товаров — колонки:**

| Колонка | Тип | Сортировка | Описание |
|---|---|---|---|
| ID | number | да | `#` |
| Image | image | нет | Превью `50x50` |
| Name (RU) | string | да | Название на русском |
| Name (TM) | string | нет | Название на туркменском |
| Brand | string | да | Название бренда |
| Category | string | да | Категория |
| Price | number | да | Цена |
| Old Price | number | нет | Старая цена |
| Is Active | boolean | да | Toggle switch |
| Is New | boolean | нет | Badge |
| Is Discount | boolean | нет | Badge |
| Actions | buttons | нет | Edit, Delete |

**Создание/редактирование → Drawer (справа)**

```
┌──────────────────────────────────────┐
│  Добавить товар                  [✕] │
├──────────────────────────────────────┤
│                                      │
│  Название (RU)*                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  └──────────────────────────────┘    │
│  Название (TM)*                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  └──────────────────────────────┘    │
│  Описание (RU)                       │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  └──────────────────────────────┘    │
│  Описание (TM)                       │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  Бренд*           [Select ▾       ]  │
│  Категория*       [Select ▾       ]  │
│  Подкатегория     [Select ▾       ]  │
│                                      │
│  Цена*            [          ]       │
│  Старая цена      [          ]       │
│  Штрих-код        [          ]       │
│                                      │
│  Изображение*                        │
│  ┌──────────┐                        │
│  │  + Upload │                       │
│  └──────────┘                        │
│                                      │
│  ☑ Активен   ☑ Новинка   ☐ Скидка   │
│  Порядок сортировки [0       ]       │
│                                      │
│  [Отмена]         [████ Сохранить]   │
│                                      │
└──────────────────────────────────────┘
```

---

### 5.3 Categories Page (Категории)

```
┌─────────────────────────────────────────────────────────────┐
│  Категории                          [+ Добавить категорию]  │
├─────────────────────────────────────────────────────────────┤
│  ┌───┬───────┬────────────┬────────────┬────────┬────────┐ │
│  │ # │ Фото  │ Название   │ Подкатег.  │ Статус │  ⚙️    │ │
│  ├───┼───────┼────────────┼────────────┼────────┼────────┤ │
│  │ 1 │ [img] │ Новинки    │     —      │ ✅     │ ✏️ 🗑  │ │
│  │ 2 │ [img] │ Косметика  │   ∨ (5)    │ ✅     │ ✏️ 🗑  │ │
│  │   │       │  ├ для лица│            │ ✅     │ ✏️ 🗑  │ │  ← expandable
│  │   │       │  ├ для глаз│            │ ✅     │ ✏️ 🗑  │ │
│  │   │       │  └ для губ │            │ ✅     │ ✏️ 🗑  │ │
│  │ 3 │ [img] │ Уход/лицо  │   ∨ (3)    │ ✅     │ ✏️ 🗑  │ │
│  └───┴───────┴────────────┴────────────┴────────┴────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- Expandable rows для подкатегорий (`Table` с `expandable` prop)
- Кнопка "Добавить подкатегорию" внутри expandable row
- Drag-and-drop для sort_order (опционально, `dnd-kit`)

---

### 5.4 Brands Page (Бренды)

Аналогично Categories, но без подкатегорий. Поля: name, logo_url, sort_order, is_active.

---

### 5.5 Banners Page (Баннеры)

```
┌─────────────────────────────────────────────────────────────┐
│  Баннеры                             [+ Добавить баннер]    │
├─────────────────────────────────────────────────────────────┤
│  ┌───┬────────────┬──────────┬────────────┬────────┬─────┐ │
│  │ # │ Превью     │ Тип ссылки│ Значение  │ Статус │ ⚙️  │ │
│  ├───┼────────────┼──────────┼────────────┼────────┼─────┤ │
│  │ 1 │ [wide img] │ category │     3      │   ✅   │✏️🗑│ │
│  │ 2 │ [wide img] │ brand    │     7      │   ✅   │✏️🗑│ │
│  │ 3 │ [wide img] │   —      │     —      │   ❌   │✏️🗑│ │
│  └───┴────────────┴──────────┴────────────┴────────┴─────┘ │
└─────────────────────────────────────────────────────────────┘
```

Форма: image_url (upload), link_type (select), link_value (dynamic input), sort_order, is_active.

---

### 5.6 Orders Page (Заказы)

```
┌─────────────────────────────────────────────────────────────┐
│  Заказы                                                     │
├─────────────────────────────────────────────────────────────┤
│  Фильтры: [Тип ▾] [Статус ▾] [Дата от] [Дата до] [Поиск] │
├─────────────────────────────────────────────────────────────┤
│  ┌──────┬──────────┬────────┬────────┬────────┬──────┬───┐ │
│  │  #   │ Клиент   │ Телефон│  Сумма │ Статус │ Дата │ ⚙ │ │
│  ├──────┼──────────┼────────┼────────┼────────┼──────┼───┤ │
│  │#1234 │ Иванов   │ +993.. │ 44.00  │ 🟡 Нов │ 24.02│ 👁 │ │
│  │#1233 │ Петров   │ +993.. │ 120.00 │ 🟢 Под │ 24.02│ 👁 │ │
│  │#1232 │ Сидоров  │ +993.. │ 35.00  │ 🔵 Отп │ 23.02│ 👁 │ │
│  └──────┴──────────┴────────┴────────┴────────┴──────┴───┘ │
│                       [< 1 2 3 ... 12 >]                   │
└─────────────────────────────────────────────────────────────┘
```

**Status Tags (цветные метки):**

| Статус | Цвет | Ant Design Tag |
|---|---|---|
| Новый | `gold` | `<Tag color="gold">` |
| Подтверждён | `green` | `<Tag color="green">` |
| Отправлен | `blue` | `<Tag color="blue">` |
| Доставлен | `default` | `<Tag>` |
| Отменен | `red` | `<Tag color="red">` |

---

### 5.7 Order Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  ← Заказ #1234                                              │
├───────────────────────────────┬─────────────────────────────┤
│  Информация о заказе          │  Статус: [Подтверждён ▾]    │
│                               │                             │
│  Тип: Доставка                │  [Изменить статус]          │
│  Дата: 24.02.2026             │                             │
│  Время: 14:00-16:00           │                             │
│  Клиент: Иван Иванов          │                             │
│  Телефон: +99365123456        │                             │
│  Адрес: ул. Пушкина, 10      │                             │
│  Заметка: Позвонить за 10 мин│                             │
├───────────────────────────────┴─────────────────────────────┤
│  Товары                                                     │
│  ┌───┬───────┬────────────────┬────────┬───────┬──────────┐│
│  │ # │ Фото  │ Название       │ Кол-во │ Цена  │  Итого   ││
│  ├───┼───────┼────────────────┼────────┼───────┼──────────┤│
│  │ 1 │ [img] │ Крем Garnier   │   2    │ 12.00 │  24.00   ││
│  └───┴───────┴────────────────┴────────┴───────┴──────────┘│
│                                                             │
│  Сумма товаров:        24.00 m.                             │
│  Доставка:             20.00 m.                             │
│  Итого:                44.00 m.                             │
└─────────────────────────────────────────────────────────────┘
```

**Смена статуса:** `Select` + кнопка → `PUT /api/v1/admin/orders/:id/status`

---

### 5.8 Delivery Zones Page

Простая таблица: name_ru, name_tm, delivery_price, is_active. CRUD через Modal.

### 5.9 Time Slots Page

Простая таблица: start_time, end_time, label, is_active. CRUD через Modal.

### 5.10 Admins Page (только superadmin)

Таблица: username, full_name, role, is_active, created_at. CRUD через Modal.

---

## 6. Компоненты

### 6.1 ImageUpload

```typescript
interface ImageUploadProps {
  value?: string;                    // текущий URL
  onChange?: (url: string) => void;  // callback после загрузки
  folder?: string;                   // products, brands, etc.
}
```

- Использует `antd Upload` с custom request
- POST → `/api/v1/admin/upload`
- Превью загруженного изображения
- Кнопка удаления

### 6.2 LocalizedInput

```typescript
interface LocalizedInputProps {
  label: string;
  nameRu: string;       // form field name for RU
  nameTm: string;       // form field name for TM
  required?: boolean;
  textarea?: boolean;
}
```

Рендерит два поля с метками `🇷🇺 RU` и `🇹🇲 TM` в `Tabs` или рядом.

### 6.3 StatusTag

```typescript
interface StatusTagProps {
  status: OrderStatus;
}
```

Цветной `<Tag>` на основе статуса (см. таблицу выше).

---

## 7. API Client

```typescript
// api/client.ts
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from '../utils/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/admin';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor — add auth header
// Response interceptor — handle 401, try refresh

// Example API function
export const getProducts = async (params: ProductFilters): Promise<ApiResponse<ProductAdmin[]>> => {
  const { data } = await api.get('/products', { params });
  return data;
};
```

---

## 8. State Management (Zustand)

### 8.1 Auth Store

```typescript
import { create } from 'zustand';

interface AuthStore {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username, password) => {
    const response = await authApi.login(username, password);
    setTokens(response.data.access_token, response.data.refresh_token);
    set({
      admin: response.data.admin,
      accessToken: response.data.access_token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    removeTokens();
    set({ admin: null, accessToken: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token');
      const response = await authApi.me();
      set({ admin: response.data, isAuthenticated: true, isLoading: false });
    } catch {
      removeTokens();
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
```

---

## 9. Routing

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/banners" element={<BannersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/delivery-zones" element={<DeliveryZonesPage />} />
            <Route path="/time-slots" element={<TimeSlotsPage />} />
            <Route path="/admins" element={<AdminsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 10. Типичный CRUD Page Pattern

Каждая страница CRUD следует единому паттерну:

```typescript
function ProductsPage() {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductAdmin | null>(null);
  const [form] = Form.useForm();

  // 1. Fetch data
  const fetchProducts = async (page = 1) => { ... };

  // 2. Create / Update
  const handleSubmit = async (values: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, values);
    } else {
      await createProduct(values);
    }
    setIsDrawerOpen(false);
    fetchProducts();
  };

  // 3. Delete
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Удалить товар?',
      onOk: async () => {
        await deleteProduct(id);
        fetchProducts();
      },
    });
  };

  // 4. Table columns definition
  const columns = [ ... ];

  return (
    <>
      <PageHeader title="Товары" extra={<Button onClick={() => openDrawer()}>+ Добавить</Button>} />
      <Table dataSource={products} columns={columns} loading={loading} pagination={...} />
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Form form={form} onFinish={handleSubmit}>
          { /* form fields */ }
        </Form>
      </Drawer>
    </>
  );
}
```

---

## 11. Packages (package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "antd": "^5.22.0",
    "@ant-design/icons": "^5.5.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

---

## 12. Environment

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api/v1/admin
```

---

## 13. Sidebar Menu Items

| Иконка | Название | Путь | Роли |
|---|---|---|---|
| `DashboardOutlined` | Dashboard | `/dashboard` | all |
| `ShoppingOutlined` | Товары | `/products` | admin, superadmin |
| `AppstoreOutlined` | Категории | `/categories` | admin, superadmin |
| `TagOutlined` | Бренды | `/brands` | admin, superadmin |
| `PictureOutlined` | Баннеры | `/banners` | admin, superadmin |
| `OrderedListOutlined` | Заказы | `/orders` | all |
| `CarOutlined` | Зоны доставки | `/delivery-zones` | admin, superadmin |
| `ClockCircleOutlined` | Временные слоты | `/time-slots` | admin, superadmin |
| `TeamOutlined` | Администраторы | `/admins` | superadmin |

---

## 14. Чеклист разработки

- [ ] Инициализация проекта: Vite + React + TypeScript + Ant Design
- [ ] Настройка роутинга (React Router v7)
- [ ] Auth: Login page, JWT interceptors, auth store (Zustand)
- [ ] Layout: AppLayout (Header + Sider + Content), ProtectedRoute
- [ ] Types: все TypeScript interfaces
- [ ] API client: Axios instance + все API функции
- [ ] Components: ImageUpload, LocalizedInput, StatusTag
- [ ] Page: Dashboard (статистика + последние заказы)
- [ ] Page: Products CRUD (таблица + drawer форма + upload)
- [ ] Page: Categories CRUD (expandable rows + подкатегории)
- [ ] Page: Brands CRUD
- [ ] Page: Banners CRUD
- [ ] Page: Orders (таблица + фильтры + смена статуса)
- [ ] Page: Order Detail
- [ ] Page: Delivery Zones CRUD
- [ ] Page: Time Slots CRUD
- [ ] Page: Admins CRUD (role-based)
- [ ] Role-based menu visibility
- [ ] Responsive design (sidebar collapse)
- [ ] Error handling + notifications (antd message/notification)
