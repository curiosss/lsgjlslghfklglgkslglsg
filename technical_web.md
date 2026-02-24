# 🌐 Commerce — Web Client Technical Specification (React)

> Веб-клиент интернет-магазина бытовой химии, косметики и товаров для дома.
> Минималистичный чёрно-белый дизайн, мультиязычность (RU / TM), светлая и тёмная темы.
> Зеркало мобильного приложения с адаптацией под десктоп и планшеты.

---

## 1. Обзор проекта

| Параметр | Значение |
|---|---|
| Название | Commerce Web |
| Фреймворк | React 19 + TypeScript |
| Сборка | Vite |
| UI | Custom CSS Modules / Tailwind CSS |
| State Management | Zustand |
| HTTP | Axios |
| Роутинг | React Router v7 |
| Локализация | RU, TM (custom i18n) |
| Темы | Light / Dark / System |
| Адаптивность | Desktop (1200+), Tablet (768-1199), Mobile (320-767) |
| Порт | `3000` |

---

## 2. Дизайн-система

### 2.1 Цветовая палитра

Полностью идентична мобильному приложению (см. `technical_mobile.md` секция 2.1).

#### Light Mode

| Токен | Цвет | CSS Variable |
|---|---|---|
| `primary` | `#000000` | `--color-primary` |
| `on-primary` | `#FFFFFF` | `--color-on-primary` |
| `background` | `#FFFFFF` | `--color-background` |
| `surface` | `#F5F5F5` | `--color-surface` |
| `surface-variant` | `#EEEEEE` | `--color-surface-variant` |
| `on-background` | `#000000` | `--color-on-background` |
| `on-surface` | `#1A1A1A` | `--color-on-surface` |
| `secondary` | `#666666` | `--color-secondary` |
| `outline` | `#E0E0E0` | `--color-outline` |
| `error` | `#D32F2F` | `--color-error` |

#### Dark Mode

| Токен | Цвет | CSS Variable |
|---|---|---|
| `primary` | `#FFFFFF` | `--color-primary` |
| `on-primary` | `#000000` | `--color-on-primary` |
| `background` | `#0A0A0A` | `--color-background` |
| `surface` | `#1A1A1A` | `--color-surface` |
| `surface-variant` | `#2A2A2A` | `--color-surface-variant` |
| `on-background` | `#FFFFFF` | `--color-on-background` |
| `on-surface` | `#E0E0E0` | `--color-on-surface` |
| `secondary` | `#999999` | `--color-secondary` |
| `outline` | `#333333` | `--color-outline` |
| `error` | `#EF5350` | `--color-error` |

### 2.2 Типографика

Шрифт: **Inter** (Google Fonts)

| Стиль | Размер | Вес | CSS Class |
|---|---|---|---|
| `heading-xl` | 32px | 700 | `.heading-xl` |
| `heading-lg` | 24px | 700 | `.heading-lg` |
| `heading-md` | 20px | 600 | `.heading-md` |
| `title` | 18px | 600 | `.title` |
| `body-lg` | 16px | 400 | `.body-lg` |
| `body` | 14px | 400 | `.body` |
| `body-sm` | 12px | 400 | `.body-sm` |
| `label` | 14px | 600 | `.label` |
| `label-sm` | 12px | 500 | `.label-sm` |
| `caption` | 10px | 500 | `.caption` |

### 2.3 Иконки

**Lucide React** (`lucide-react`) — тонкие линейные иконки, stroke-width: 1.5.

### 2.4 Скругления

| Элемент | Радиус |
|---|---|
| Карточка товара | `16px` |
| Кнопка | `12px` |
| Поле ввода | `12px` |
| Чипс | `24px` |
| Модальное окно | `24px` |
| Изображение | `12px` |

### 2.5 Breakpoints

| Название | Ширина | Сетка товаров |
|---|---|---|
| Desktop XL | 1400px+ | 5 колонок |
| Desktop | 1200-1399px | 4 колонки |
| Tablet | 768-1199px | 3 колонки |
| Mobile L | 480-767px | 2 колонки |
| Mobile | 320-479px | 2 колонки |

---

## 3. Архитектура

### 3.1 Структура папок

```
web/
├── public/
│   ├── favicon.ico
│   └── fonts/
│       └── Inter/
│
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Router + ThemeProvider
│   │
│   ├── api/
│   │   ├── client.ts                     # Axios instance
│   │   ├── products.ts                   # Product API
│   │   ├── categories.ts                 # Category API
│   │   ├── brands.ts                     # Brand API
│   │   ├── banners.ts                    # Banner API
│   │   ├── orders.ts                     # Order API
│   │   ├── delivery-zones.ts            # Delivery zones API
│   │   ├── time-slots.ts               # Time slots API
│   │   └── home.ts                      # Home API
│   │
│   ├── store/
│   │   ├── cart.ts                       # Cart store (localStorage)
│   │   ├── favorites.ts                  # Favorites store (localStorage)
│   │   ├── theme.ts                      # Theme store (light/dark/system)
│   │   └── locale.ts                     # Locale store (ru/tm)
│   │
│   ├── types/
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── brand.ts
│   │   ├── banner.ts
│   │   ├── order.ts
│   │   ├── delivery-zone.ts
│   │   ├── time-slot.ts
│   │   ├── cart.ts
│   │   └── api.ts
│   │
│   ├── pages/
│   │   ├── HomePage.tsx                  # Главная: баннеры, бренды, секции товаров
│   │   ├── CatalogPage.tsx              # Каталог: категории + бренды
│   │   ├── ProductListPage.tsx          # Список товаров (категория/бренд)
│   │   ├── ProductDetailPage.tsx        # Детальная страница товара
│   │   ├── CartPage.tsx                 # Корзина
│   │   ├── FavoritesPage.tsx            # Избранное
│   │   ├── CheckoutPage.tsx             # Оформление заказа
│   │   ├── OrderHistoryPage.tsx         # История заказов
│   │   ├── SearchPage.tsx               # Поиск
│   │   └── NotFoundPage.tsx             # 404
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx               # Шапка: лого, поиск, навигация, тема, язык
│   │   │   ├── Footer.tsx               # Подвал: контакты, ссылки
│   │   │   ├── MobileNav.tsx            # Bottom nav для мобильной версии
│   │   │   └── Layout.tsx               # Общий Layout wrapper
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx          # Карточка товара (переиспользуемая)
│   │   │   ├── ProductGrid.tsx          # Сетка товаров (responsive)
│   │   │   ├── ProductImageViewer.tsx   # Галерея изображений
│   │   │   └── QuantitySelector.tsx     # Кнопки +/- количество
│   │   │
│   │   ├── home/
│   │   │   ├── BannerCarousel.tsx       # Карусель баннеров
│   │   │   ├── BrandStrip.tsx           # Горизонтальный список брендов
│   │   │   ├── CategoryChips.tsx        # Чипсы категорий
│   │   │   └── ProductSection.tsx       # Секция товаров (Новинки, Скидки)
│   │   │
│   │   ├── catalog/
│   │   │   ├── CategoryList.tsx         # Список категорий с подкатегориями
│   │   │   └── BrandGrid.tsx            # Сетка брендов
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItemRow.tsx          # Строка товара в корзине
│   │   │   └── CartSummary.tsx          # Итого + кнопка оформления
│   │   │
│   │   ├── order/
│   │   │   ├── DeliveryToggle.tsx       # Доставка / Самовывоз
│   │   │   ├── DateSelector.tsx         # Выбор даты
│   │   │   ├── TimeSlotGrid.tsx         # Выбор временного слота
│   │   │   ├── OrderForm.tsx            # Форма заказа (имя, телефон, адрес)
│   │   │   └── OrderCard.tsx            # Карточка заказа в истории
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx               # Кастомная кнопка
│   │       ├── Chip.tsx                 # Чипс (фильтры, категории)
│   │       ├── EmptyState.tsx           # Пустое состояние
│   │       ├── LoadingSkeleton.tsx      # Shimmer/skeleton loading
│   │       ├── SearchInput.tsx          # Строка поиска
│   │       ├── Modal.tsx                # Модальное окно
│   │       └── Toast.tsx                # Уведомления
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts              # Debounce для поиска
│   │   ├── useInfiniteScroll.ts        # Бесконечная прокрутка
│   │   ├── useMediaQuery.ts            # Responsive breakpoints
│   │   └── useLocalStorage.ts          # Типизированный localStorage
│   │
│   ├── i18n/
│   │   ├── index.ts                     # Функция tr()
│   │   ├── ru.ts                        # Русские строки
│   │   └── tm.ts                        # Туркменские строки
│   │
│   ├── styles/
│   │   ├── globals.css                  # CSS variables, reset, base
│   │   ├── theme.css                    # Light/Dark theme variables
│   │   └── animations.css              # Keyframes, transitions
│   │
│   └── utils/
│       ├── constants.ts                # API_BASE_URL, etc.
│       └── format.ts                   # Форматирование цен, дат
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

---

## 4. Layout & Navigation

### 4.1 Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  COMMERCE    [🔍 Поиск...              ]  [☀][RU]  ♡  🛒(3)   │  ← Header
├─────────────────────────────────────────────────────────────────┤
│  Главная   Каталог                                              │  ← Nav links
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       CONTENT AREA                              │
│                                                                 │
│            (max-width: 1400px, centered)                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Commerce © 2026 | Контакты: +993... | Режим работы: 9-22      │  ← Footer
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Mobile Layout

```
┌───────────────────────────────────┐
│  COMMERCE     [🔍]  [☀] [RU]     │  ← Compact header
├───────────────────────────────────┤
│                                   │
│          CONTENT AREA             │
│                                   │
├───────────────────────────────────┤
│  🏠    📂     🛒     ♡     👤    │  ← Bottom navigation (sticky)
│ Главная Каталог Корзина Избр. Профиль │
└───────────────────────────────────┘
```

### 4.3 Header Component

**Desktop:**
- Лого: `COMMERCE` — текст, `headlineLarge`, `primary`, bold
- Поиск: `SearchInput` — ширина `400px`, по центру
- Справа: тема (солнце/луна), язык (RU/TM toggle), сердечко (избранное), корзина (с бейджем)

**Mobile:**
- Лого: компактный
- Иконка поиска → при нажатии расширяется на всю ширину
- Тема + язык → в меню профиля

---

## 5. Routing

```typescript
// App.tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogPage />} />
    <Route path="/products" element={<ProductListPage />} />
    <Route path="/product/:id" element={<ProductDetailPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/orders" element={<OrderHistoryPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

### Карта навигации

```
/                    → HomePage (баннеры, бренды, секции)
/catalog             → CatalogPage (категории + бренды табы)
/products?category_id=3&brand_id=7&search=крем  → ProductListPage
/product/42          → ProductDetailPage
/cart                → CartPage
/favorites           → FavoritesPage
/checkout            → CheckoutPage
/orders              → OrderHistoryPage
/search?q=шампунь    → SearchPage
```

---

## 6. Страницы

### 6.1 Home Page (Главная)

```
┌────────────────────────────────────────────────────────────────┐
│  [Новинки] [Мыло] [Влажные салф.] [Стир. пор.] [Косметика] → │  ← Chips
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    BANNER CAROUSEL                       │  │  ← Full width
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        ● ○ ○ ○ ○                               │
├────────────────────────────────────────────────────────────────┤
│  [ARIEL] [elin.him] [L'Oréal] [911+] [GARNIER] [H&S]    →   │  ← Brands
├────────────────────────────────────────────────────────────────┤
│  Новинки                                          Все →       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │[img] │ │[img] │ │[img] │ │[img] │ │[img] │               │  ← 5 cols desktop
│  │Brand │ │Brand │ │Brand │ │Brand │ │Brand │               │
│  │85.00 │ │23.00 │ │45.00 │ │12.00 │ │99.00 │               │
│  │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│               │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘               │
├────────────────────────────────────────────────────────────────┤
│  Скидки                                           Все →       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │-17%  │ │[img] │ │-10%  │ │[img] │ │-25%  │               │
│  │[img] │ │Brand │ │[img] │ │Brand │ │[img] │               │
│  │85 103│ │12.00 │ │45 50 │ │23.00 │ │75 100│               │
│  │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│               │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘               │
└────────────────────────────────────────────────────────────────┘
```

**Данные:** один запрос `GET /api/v1/home?lang=ru` — возвращает всё сразу.

---

### 6.2 Catalog Page

```
┌────────────────────────────────────────────────────────────────┐
│       [Категории]      |      [Бренды]                        │  ← Tabs
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  CATEGORIES TAB:                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [img] Новинки                                    →       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ [img] Косметические средства                    → ∨      │  │
│  │       ├ для лица                                         │  │
│  │       ├ для глаз                                         │  │
│  │       └ для губ                                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ [img] Уход за лицом                             → ∨      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  BRANDS TAB:                                                   │
│  [🔍 Поиск бренда...                                      ]   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ARIEL │ │elin  │ │L'Or. │ │ 911+ │ │GARNI │ │ H&S  │       │  ← 6 cols desktop
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ ABC  │ │ACORD │ │Fairy │ │Tide  │ │Pampe │ │ ... │       │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
└────────────────────────────────────────────────────────────────┘
```

---

### 6.3 Product List Page

```
┌────────────────────────────────────────────────────────────────┐
│  ← Ariel                              Всего: 22 товар(ов)     │
│  [Низкие цены] [Высокие цены]                                 │
├────────────────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │[img] │ │[img] │ │[img] │ │[img] │ │[img] │                │  ← responsive grid
│  │Brand │ │Brand │ │Brand │ │Brand │ │Brand │                │
│  │85.00 │ │23.00 │ │45.00 │ │12.00 │ │99.00 │                │
│  │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ ...  │ │ ...  │ │ ...  │ │ ...  │ │ ...  │                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                                │
│                      [Загрузить ещё]                           │  ← or infinite scroll
└────────────────────────────────────────────────────────────────┘
```

**URL:** `/products?category_id=3` или `/products?brand_id=7` или `/products?search=крем`

---

### 6.4 Product Detail Page

```
┌────────────────────────────────────────────────────────────────┐
│  ← GARNIER                                                     │
├──────────────────────────┬─────────────────────────────────────┤
│                          │                                     │
│  ┌────────────────────┐  │  GARNIER                            │
│  │                    │  │  Крем для лица Garnier              │
│  │   PRODUCT IMAGE    │  │  Skin Naturals BB                   │
│  │   (zoomable)       │  │  Натурально-бежевый 50мл            │
│  │                    │  │                                     │
│  └────────────────────┘  │  117,00 m.  ̶1̶4̶0̶,̶0̶0̶  -16%          │
│  [thumb1] [thumb2]       │                                     │
│                          │  [████ В корзину ████]    ♡         │
│                          │                                     │
│                          │  ─────────────────────              │
│                          │  Штрих-код    3600541116634         │
│                          │  Бренд        GARNIER →             │
│                          │  ─────────────────────              │
├──────────────────────────┴─────────────────────────────────────┤
│  Другие товары                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ ...  │ │ ...  │ │ ...  │ │ ...  │ │ ...  │                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
└────────────────────────────────────────────────────────────────┘
```

**Desktop:** два колонки (изображение слева, информация справа).
**Mobile:** одна колонка (изображение сверху, информация снизу).

---

### 6.5 Cart Page

```
┌────────────────────────────────────────────────────────────────┐
│  Корзина                                             [🗑 Очистить] │
├────────────────────────────────────────┬───────────────────────┤
│                                        │                       │
│  ┌──────────────────────────────────┐  │  Итого                │
│  │ [img] Brand name           ✕     │  │                       │
│  │       Description                │  │  Сумма:    24,00 m.   │
│  │       [−] 2 шт [+]    24,00 m.  │  │                       │
│  └──────────────────────────────────┘  │  [Оформить заказ →]  │
│  ┌──────────────────────────────────┐  │                       │
│  │ [img] Brand name           ✕     │  │                       │
│  │       Description                │  │                       │
│  │       [−] 1 шт [+]    12,00 m.  │  │                       │
│  └──────────────────────────────────┘  │                       │
│                                        │                       │
├────────────────────────────────────────┴───────────────────────┤
│  Mobile: sticky bottom bar с итого + кнопка                    │
└────────────────────────────────────────────────────────────────┘
```

**Desktop:** товары слева (70%), итого справа (30%) — sticky sidebar.
**Mobile:** товары сверху, sticky bottom bar с итого и кнопкой.

---

### 6.6 Favorites Page

Аналогично мобильному — сетка `ProductCard` с заполненным сердечком. `EmptyState` если пусто.

---

### 6.7 Checkout Page

```
┌────────────────────────────────────────────────────────────────┐
│  ← Оформление заказа                                          │
├────────────────────────────────────────┬───────────────────────┤
│                                        │                       │
│  Вид заказа                            │  Ваш заказ            │
│  [🚗 Доставка] [🚶 Самовывоз]          │                       │
│                                        │  Крем Garnier ×2      │
│  Дата доставки                         │           24,00 m.    │
│  [24.02] [25.02] [26.02]              │  Порошок Ariel ×1     │
│                                        │           85,00 m.    │
│  Временной слот                        │                       │
│  [● 14:00-16:00] [○ 16:00-18:00]     │  ─────────────────    │
│  [○ 18:00-20:00] [○ 20:00-22:00]     │  Подытог:  109,00 m.  │
│                                        │  Доставка:  20,00 m.  │
│  Полное Имя*                           │  ─────────────────    │
│  ┌──────────────────────────────────┐  │  Итого:   129,00 m.  │
│  │                                  │  │                       │
│  └──────────────────────────────────┘  │                       │
│  Телефон*                              │                       │
│  ┌──────────────────────────────────┐  │                       │
│  │                                  │  │                       │
│  └──────────────────────────────────┘  │                       │
│  Адрес*                                │                       │
│  ┌──────────────────────────────────┐  │                       │
│  │                                  │  │                       │
│  └──────────────────────────────────┘  │                       │
│  Заметка                               │                       │
│  ┌──────────────────────────────────┐  │                       │
│  │                                  │  │                       │
│  └──────────────────────────────────┘  │                       │
│                                        │                       │
│  [██████████ Заказать ██████████]      │                       │
│                                        │                       │
├────────────────────────────────────────┴───────────────────────┤
│  Mobile: одна колонка, summary + кнопка внизу (sticky)         │
└────────────────────────────────────────────────────────────────┘
```

**Desktop:** форма слева (60%), summary справа (40%) — sticky.
**Mobile:** одна колонка, кнопка "Заказать" sticky внизу.

---

### 6.8 Order History Page

Аналогично мобильному: табы (Доставка / Самовывоз), фильтр по статусу, список карточек заказов.

---

### 6.9 Search Page

```
┌────────────────────────────────────────────────────────────────┐
│  ← [🔍 Поиск товаров...                              ] [✕]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Результаты: 12 товар(ов)                                     │
│                                                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ ...  │ │ ...  │ │ ...  │ │ ...  │ │ ...  │                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Auto-focus на поле поиска
- `useDebounce` (500ms)
- Результаты: `ProductGrid`

---

## 7. State Management (Zustand)

### 7.1 Cart Store

```typescript
interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => { ... },
      removeFromCart: (productId) => { ... },
      updateQuantity: (productId, quantity) => { ... },
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

### 7.2 Favorites Store

```typescript
interface FavoritesState {
  products: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      products: [],
      addFavorite: (product) => { ... },
      removeFavorite: (productId) => { ... },
      isFavorite: (productId) => get().products.some(p => p.id === productId),
    }),
    { name: 'favorites-storage' }
  )
);
```

### 7.3 Theme Store

```typescript
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
      get resolvedTheme() {
        const mode = get().mode;
        if (mode === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
      },
    }),
    { name: 'theme-storage' }
  )
);
```

### 7.4 Locale Store

```typescript
type Locale = 'ru' | 'tm';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ru',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'locale-storage' }
  )
);
```

---

## 8. Localization (i18n)

```typescript
// i18n/index.ts
import { ru } from './ru';
import { tm } from './tm';
import { useLocaleStore } from '../store/locale';

const translations: Record<string, Record<string, string>> = { ru, tm };

export function tr(key: string): string {
  const locale = useLocaleStore.getState().locale;
  return translations[locale]?.[key] ?? key;
}

// React hook version
export function useTr() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string) => translations[locale]?.[key] ?? key;
}
```

Строки полностью идентичны мобильному приложению (см. `technical_mobile.md` секция 10.2).

---

## 9. API Client

```typescript
// api/client.ts
import axios from 'axios';
import { useLocaleStore } from '../store/locale';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Добавляем lang ко всем запросам
api.interceptors.request.use((config) => {
  const lang = useLocaleStore.getState().locale;
  config.params = { ...config.params, lang };
  return config;
});
```

---

## 10. Компоненты

### 10.1 ProductCard

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  cartQuantity?: number;
}
```

Идентичен мобильной карточке: изображение, бренд, описание, цена, кнопка "В корзину" / quantity selector, сердечко.

### 10.2 ProductGrid

```typescript
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: number;    // auto-responsive if not provided
}
```

CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`

### 10.3 BannerCarousel

- Desktop: `height: 400px`, навигационные стрелки по бокам
- Mobile: `height: 200px`, swipe
- Автопрокрутка `4s`
- Page indicators (точки)

---

## 11. SEO & Performance

| Оптимизация | Реализация |
|---|---|
| Lazy loading страниц | `React.lazy()` + `Suspense` |
| Lazy loading изображений | `loading="lazy"` на `<img>` |
| Skeleton loading | `LoadingSkeleton` компонент вместо спиннеров |
| Image optimization | WebP формат, srcset для разных размеров |
| Code splitting | Vite automatic chunk splitting |
| Meta tags | `react-helmet-async` для title, description |

---

## 12. Packages (package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "lucide-react": "^0.460.0",
    "react-helmet-async": "^2.0.0",
    "swiper": "^11.0.0",
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

## 13. Environment

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_CDN_URL=https://cdn.elinhim.com
```

---

## 14. Отличия от мобильного приложения

| Аспект | Mobile (Flutter) | Web (React) |
|---|---|---|
| Навигация | Bottom tabs + GoRouter | Header nav + React Router |
| Сетка товаров | 2 колонки (фиксированная) | 2-5 колонок (responsive) |
| Product Detail | Одна колонка | Две колонки (desktop) |
| Cart | Одна колонка + sticky bottom | Две колонки (desktop) |
| Checkout | Одна колонка | Две колонки (desktop) |
| Theme toggle | Bottom sheet | Dropdown / header icon |
| Language toggle | Bottom sheet | Header toggle |
| Banner height | 200px | 400px (desktop), 200px (mobile) |
| Хранение данных | SharedPreferences | localStorage (via zustand persist) |
| Bottom navigation | Всегда видна | Только мобильная версия (< 768px) |
| Footer | Нет | Есть (контакты, ссылки) |

---

## 15. Чеклист разработки

- [ ] Инициализация: Vite + React + TypeScript
- [ ] Стили: CSS variables, theme switching, responsive breakpoints
- [ ] Store: Zustand — cart, favorites, theme, locale (с persist)
- [ ] API client: Axios + language interceptor
- [ ] i18n: строки RU/TM, hook useTr()
- [ ] Layout: Header (desktop + mobile), Footer, MobileNav
- [ ] UI: Button, Chip, EmptyState, LoadingSkeleton, SearchInput, Modal, Toast
- [ ] Components: ProductCard, ProductGrid, QuantitySelector, BannerCarousel
- [ ] Page: Home — баннеры, бренды, категории, секции товаров
- [ ] Page: Catalog — категории (список + expandable) + бренды (сетка)
- [ ] Page: Product List — фильтры, сортировка, пагинация/infinite scroll
- [ ] Page: Product Detail — галерея, info, related products
- [ ] Page: Cart — список товаров, summary, responsive layout
- [ ] Page: Favorites
- [ ] Page: Checkout — форма, зоны доставки, слоты, валидация
- [ ] Page: Order History — табы, фильтры, список
- [ ] Page: Search — debounce, результаты
- [ ] SEO: meta tags, lazy loading
- [ ] Responsive: тестирование на всех breakpoints
- [ ] Dark mode: тестирование
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
