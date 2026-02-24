# 📊 Commerce — Модели данных (Database & API Models)

> Единое описание моделей данных для всех платформ: Backend (Go), Web Client (React), Admin Panel (React), Mobile (Flutter).
> Все модели синхронизированы между клиентом и сервером. Формат обмена — JSON.

---

## 1. Обзор

| Параметр | Значение |
|---|---|
| Формат обмена | JSON (REST API) |
| Время | UTC (ISO 8601) |
| ID | `int` (auto increment) |
| Валюта | Манат (`m.`), `float64`, 2 знака после запятой |
| Языки | `ru`, `tm` |
| Изображения | URL-путь относительно CDN / абсолютный URL |

---

## 2. Основные сущности (Entity Relationship)

```
┌──────────┐     ┌──────────────┐     ┌───────────┐
│  Brand   │────<│   Product    │>────│ Category  │
└──────────┘     └──────┬───────┘     └─────┬─────┘
                        │                   │
                        │              ┌────┴──────┐
                        │              │SubCategory│
                        │              └───────────┘
                        │
                 ┌──────┴───────┐
                 │  OrderItem   │
                 └──────┬───────┘
                        │
                 ┌──────┴───────┐     ┌──────────────┐
                 │    Order     │────>│ DeliveryZone │
                 └──────────────┘     └──────────────┘
                        │
                 ┌──────┴───────┐
                 │   TimeSlot   │
                 └──────────────┘

┌──────────┐     ┌──────────────┐
│  Banner  │     │    Admin     │
└──────────┘     └──────────────┘
```

---

## 3. Модели

### 3.1 Product (Товар)

Основная сущность магазина.

#### Поля

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| Name | `string` | `name` | нет | Название товара (локализованное) |
| NameTm | `string` | `name_tm` | да | Название на туркменском (только backend/admin) |
| NameRu | `string` | `name_ru` | да | Название на русском (только backend/admin) |
| BrandName | `string` | `brand_name` | нет | Название бренда |
| BrandID | `int` | `brand_id` | да | FK на Brand |
| CategoryID | `int` | `category_id` | да | FK на Category |
| SubCategoryID | `int` | `subcategory_id` | да | FK на SubCategory |
| Description | `string` | `description` | да | Описание товара (локализованное) |
| Price | `float` | `price` | нет | Текущая цена |
| OldPrice | `float` | `old_price` | да | Старая цена (если есть скидка) |
| DiscountPercent | `int` | `discount_percent` | да | Процент скидки (вычисляемый или хранимый) |
| ImageUrl | `string` | `image_url` | нет | Основное изображение |
| Images | `[]string` | `images` | да | Дополнительные изображения |
| Barcode | `string` | `barcode` | да | Штрих-код EAN-13 |
| IsActive | `bool` | `is_active` | нет | Активен ли товар |
| IsNew | `bool` | `is_new` | нет | Флаг "Новинка" |
| IsDiscount | `bool` | `is_discount` | нет | Флаг "Со скидкой" |
| SortOrder | `int` | `sort_order` | нет | Порядок сортировки |
| CreatedAt | `datetime` | `created_at` | нет | Дата создания |
| UpdatedAt | `datetime` | `updated_at` | нет | Дата обновления |

#### JSON (API Response — клиент)

```json
{
  "id": 42,
  "name": "Крем для лица Garnier Skin Naturals BB Натурально-бежевый 50мл",
  "brand_name": "GARNIER",
  "brand_id": 7,
  "category_id": 3,
  "subcategory_id": 12,
  "description": "Увлажняющий BB-крем с натуральным бежевым оттенком",
  "price": 117.00,
  "old_price": 140.00,
  "discount_percent": 16,
  "image_url": "/uploads/products/garnier-bb-cream.jpg",
  "images": [
    "/uploads/products/garnier-bb-cream-1.jpg",
    "/uploads/products/garnier-bb-cream-2.jpg"
  ],
  "barcode": "3600541116634",
  "is_new": false,
  "is_discount": true
}
```

#### Go struct

```go
type Product struct {
    ID              int       `json:"id" db:"id"`
    NameRu          string    `json:"name_ru" db:"name_ru"`
    NameTm          string    `json:"name_tm" db:"name_tm"`
    BrandID         *int      `json:"brand_id" db:"brand_id"`
    CategoryID      *int      `json:"category_id" db:"category_id"`
    SubCategoryID   *int      `json:"subcategory_id" db:"subcategory_id"`
    DescriptionRu   *string   `json:"description_ru" db:"description_ru"`
    DescriptionTm   *string   `json:"description_tm" db:"description_tm"`
    Price           float64   `json:"price" db:"price"`
    OldPrice        *float64  `json:"old_price" db:"old_price"`
    DiscountPercent *int      `json:"discount_percent" db:"discount_percent"`
    ImageUrl        string    `json:"image_url" db:"image_url"`
    Images          []string  `json:"images" db:"images"`
    Barcode         *string   `json:"barcode" db:"barcode"`
    IsActive        bool      `json:"is_active" db:"is_active"`
    IsNew           bool      `json:"is_new" db:"is_new"`
    IsDiscount      bool      `json:"is_discount" db:"is_discount"`
    SortOrder       int       `json:"sort_order" db:"sort_order"`
    CreatedAt       time.Time `json:"created_at" db:"created_at"`
    UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// ProductResponse — ответ клиенту (с локализованным name)
type ProductResponse struct {
    ID              int      `json:"id"`
    Name            string   `json:"name"`
    BrandName       string   `json:"brand_name"`
    BrandID         *int     `json:"brand_id,omitempty"`
    CategoryID      *int     `json:"category_id,omitempty"`
    SubCategoryID   *int     `json:"subcategory_id,omitempty"`
    Description     *string  `json:"description,omitempty"`
    Price           float64  `json:"price"`
    OldPrice        *float64 `json:"old_price,omitempty"`
    DiscountPercent *int     `json:"discount_percent,omitempty"`
    ImageUrl        string   `json:"image_url"`
    Images          []string `json:"images,omitempty"`
    Barcode         *string  `json:"barcode,omitempty"`
    IsNew           bool     `json:"is_new"`
    IsDiscount      bool     `json:"is_discount"`
}
```

#### TypeScript interface (React — Web & Admin)

```typescript
interface Product {
  id: number;
  name: string;
  brand_name: string;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  description?: string;
  price: number;
  old_price?: number;
  discount_percent?: number;
  image_url: string;
  images?: string[];
  barcode?: string;
  is_new: boolean;
  is_discount: boolean;
}

// Admin — с двуязычными полями
interface ProductAdmin extends Product {
  name_ru: string;
  name_tm: string;
  description_ru?: string;
  description_tm?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

#### Dart class (Flutter)

```dart
class Product {
  final int id;
  final String name;
  final String brandName;
  final int? brandId;
  final int? categoryId;
  final int? subcategoryId;
  final String? description;
  final double price;
  final double? oldPrice;
  final int? discountPercent;
  final String imageUrl;
  final List<String>? images;
  final String? barcode;
  final bool isNew;
  final bool isDiscount;

  Product({
    required this.id,
    required this.name,
    required this.brandName,
    this.brandId,
    this.categoryId,
    this.subcategoryId,
    this.description,
    required this.price,
    this.oldPrice,
    this.discountPercent,
    required this.imageUrl,
    this.images,
    this.barcode,
    required this.isNew,
    required this.isDiscount,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
    id: json['id'],
    name: json['name'],
    brandName: json['brand_name'],
    brandId: json['brand_id'],
    categoryId: json['category_id'],
    subcategoryId: json['subcategory_id'],
    description: json['description'],
    price: (json['price'] as num).toDouble(),
    oldPrice: json['old_price'] != null ? (json['old_price'] as num).toDouble() : null,
    discountPercent: json['discount_percent'],
    imageUrl: json['image_url'],
    images: json['images'] != null ? List<String>.from(json['images']) : null,
    barcode: json['barcode'],
    isNew: json['is_new'] ?? false,
    isDiscount: json['is_discount'] ?? false,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'brand_name': brandName,
    'brand_id': brandId,
    'category_id': categoryId,
    'subcategory_id': subcategoryId,
    'description': description,
    'price': price,
    'old_price': oldPrice,
    'discount_percent': discountPercent,
    'image_url': imageUrl,
    'images': images,
    'barcode': barcode,
    'is_new': isNew,
    'is_discount': isDiscount,
  };
}
```

---

### 3.2 Category (Категория)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| NameRu | `string` | `name_ru` | нет | Название (RU) |
| NameTm | `string` | `name_tm` | нет | Название (TM) |
| ImageUrl | `string` | `image_url` | да | Иконка/изображение категории |
| HasSubCategories | `bool` | `has_subcategories` | нет | Есть ли подкатегории |
| SortOrder | `int` | `sort_order` | нет | Порядок сортировки |
| IsActive | `bool` | `is_active` | нет | Активна ли |
| CreatedAt | `datetime` | `created_at` | нет | Дата создания |

#### JSON (API Response — клиент)

```json
{
  "id": 3,
  "name": "Косметические средства",
  "image_url": "/uploads/categories/cosmetics.jpg",
  "has_subcategories": true,
  "subcategories": [
    { "id": 10, "name": "для лица", "image_url": "/uploads/sub/face.jpg", "parent_id": 3 },
    { "id": 11, "name": "для глаз", "image_url": "/uploads/sub/eyes.jpg", "parent_id": 3 },
    { "id": 12, "name": "для губ", "image_url": "/uploads/sub/lips.jpg", "parent_id": 3 }
  ]
}
```

#### Go struct

```go
type Category struct {
    ID               int       `json:"id" db:"id"`
    NameRu           string    `json:"name_ru" db:"name_ru"`
    NameTm           string    `json:"name_tm" db:"name_tm"`
    ImageUrl         *string   `json:"image_url" db:"image_url"`
    HasSubCategories bool      `json:"has_subcategories" db:"has_subcategories"`
    SortOrder        int       `json:"sort_order" db:"sort_order"`
    IsActive         bool      `json:"is_active" db:"is_active"`
    CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

type CategoryResponse struct {
    ID               int                    `json:"id"`
    Name             string                 `json:"name"`
    ImageUrl         *string                `json:"image_url,omitempty"`
    HasSubCategories bool                   `json:"has_subcategories"`
    SubCategories    []SubCategoryResponse  `json:"subcategories,omitempty"`
}
```

#### TypeScript

```typescript
interface Category {
  id: number;
  name: string;
  image_url?: string;
  has_subcategories: boolean;
  subcategories?: SubCategory[];
}

interface CategoryAdmin extends Category {
  name_ru: string;
  name_tm: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
```

---

### 3.3 SubCategory (Подкатегория)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| ParentID | `int` | `parent_id` | нет | FK на Category |
| NameRu | `string` | `name_ru` | нет | Название (RU) |
| NameTm | `string` | `name_tm` | нет | Название (TM) |
| ImageUrl | `string` | `image_url` | да | Иконка |
| SortOrder | `int` | `sort_order` | нет | Порядок |
| IsActive | `bool` | `is_active` | нет | Активна ли |

#### Go struct

```go
type SubCategory struct {
    ID        int     `json:"id" db:"id"`
    ParentID  int     `json:"parent_id" db:"parent_id"`
    NameRu    string  `json:"name_ru" db:"name_ru"`
    NameTm    string  `json:"name_tm" db:"name_tm"`
    ImageUrl  *string `json:"image_url" db:"image_url"`
    SortOrder int     `json:"sort_order" db:"sort_order"`
    IsActive  bool    `json:"is_active" db:"is_active"`
}

type SubCategoryResponse struct {
    ID       int     `json:"id"`
    Name     string  `json:"name"`
    ImageUrl *string `json:"image_url,omitempty"`
    ParentID int     `json:"parent_id"`
}
```

#### TypeScript

```typescript
interface SubCategory {
  id: number;
  name: string;
  image_url?: string;
  parent_id: number;
}

interface SubCategoryAdmin extends SubCategory {
  name_ru: string;
  name_tm: string;
  sort_order: number;
  is_active: boolean;
}
```

---

### 3.4 Brand (Бренд)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| Name | `string` | `name` | нет | Название бренда (одинаковое для всех языков) |
| LogoUrl | `string` | `logo_url` | да | Логотип бренда |
| SortOrder | `int` | `sort_order` | нет | Порядок |
| IsActive | `bool` | `is_active` | нет | Активен ли |
| CreatedAt | `datetime` | `created_at` | нет | Дата создания |

#### JSON

```json
{
  "id": 1,
  "name": "ARIEL",
  "logo_url": "/uploads/brands/ariel.png"
}
```

#### Go struct

```go
type Brand struct {
    ID        int       `json:"id" db:"id"`
    Name      string    `json:"name" db:"name"`
    LogoUrl   *string   `json:"logo_url" db:"logo_url"`
    SortOrder int       `json:"sort_order" db:"sort_order"`
    IsActive  bool      `json:"is_active" db:"is_active"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type BrandResponse struct {
    ID      int     `json:"id"`
    Name    string  `json:"name"`
    LogoUrl *string `json:"logo_url,omitempty"`
}
```

#### TypeScript

```typescript
interface Brand {
  id: number;
  name: string;
  logo_url?: string;
}

interface BrandAdmin extends Brand {
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
```

---

### 3.5 Banner (Баннер)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| ImageUrl | `string` | `image_url` | нет | Изображение баннера |
| LinkType | `string` | `link_type` | да | Тип ссылки: `category`, `brand`, `product`, `url` |
| LinkValue | `string` | `link_value` | да | Значение ссылки (id или URL) |
| SortOrder | `int` | `sort_order` | нет | Порядок показа |
| IsActive | `bool` | `is_active` | нет | Активен ли |
| CreatedAt | `datetime` | `created_at` | нет | Дата создания |

#### JSON

```json
{
  "id": 1,
  "image_url": "/uploads/banners/spring-sale.jpg",
  "link_type": "category",
  "link_value": "3"
}
```

#### Go struct

```go
type Banner struct {
    ID        int       `json:"id" db:"id"`
    ImageUrl  string    `json:"image_url" db:"image_url"`
    LinkType  *string   `json:"link_type" db:"link_type"`
    LinkValue *string   `json:"link_value" db:"link_value"`
    SortOrder int       `json:"sort_order" db:"sort_order"`
    IsActive  bool      `json:"is_active" db:"is_active"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type BannerResponse struct {
    ID        int     `json:"id"`
    ImageUrl  string  `json:"image_url"`
    LinkType  *string `json:"link_type,omitempty"`
    LinkValue *string `json:"link_value,omitempty"`
}
```

#### TypeScript

```typescript
interface Banner {
  id: number;
  image_url: string;
  link_type?: 'category' | 'brand' | 'product' | 'url';
  link_value?: string;
}

interface BannerAdmin extends Banner {
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
```

---

### 3.6 Order (Заказ)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| OrderNumber | `string` | `order_number` | нет | Номер заказа (напр. `#1234`) |
| Type | `enum` | `type` | нет | `delivery` / `pickup` |
| Status | `enum` | `status` | нет | Статус заказа |
| FullName | `string` | `full_name` | нет | ФИО клиента |
| Phone | `string` | `phone` | нет | Телефон клиента |
| Address | `string` | `address` | да | Адрес доставки |
| Note | `string` | `note` | да | Заметка к заказу |
| DeliveryZoneID | `int` | `delivery_zone_id` | да | FK на DeliveryZone |
| DeliveryDate | `string` | `delivery_date` | да | Дата доставки (`YYYY-MM-DD`) |
| TimeSlot | `string` | `time_slot` | да | Временной слот (`14:00-16:00`) |
| Subtotal | `float` | `subtotal` | нет | Сумма товаров |
| DeliveryFee | `float` | `delivery_fee` | нет | Стоимость доставки |
| Total | `float` | `total` | нет | Итого |
| Items | `[]OrderItem` | `items` | нет | Позиции заказа |
| CreatedAt | `datetime` | `created_at` | нет | Дата создания |
| UpdatedAt | `datetime` | `updated_at` | нет | Дата обновления |

#### Статусы заказа (OrderStatus)

| Значение | JSON | RU | TM | Описание |
|---|---|---|---|---|
| new | `"new"` | Новый | Täze | Только создан |
| confirmed | `"confirmed"` | Подтверждён | Tassyklandy | Принят оператором |
| shipped | `"shipped"` | Отправлен | Ugradyldy | В пути |
| delivered | `"delivered"` | Доставлен | Eltip berildi | Завершён |
| cancelled | `"cancelled"` | Отменен | Ýatyryldy | Отменён |

#### Типы заказа (OrderType)

| Значение | JSON | RU | TM |
|---|---|---|---|
| delivery | `"delivery"` | Доставка | Eltip bermek |
| pickup | `"pickup"` | Самовывоз | Özüň almak |

#### JSON (API Response)

```json
{
  "id": 1,
  "order_number": "#1234",
  "type": "delivery",
  "status": "confirmed",
  "full_name": "Иван Иванов",
  "phone": "+99365123456",
  "address": "ул. Пушкина, д. 10",
  "note": "Позвонить за 10 минут",
  "delivery_zone_id": 2,
  "delivery_date": "2026-02-25",
  "time_slot": "14:00-16:00",
  "subtotal": 24.00,
  "delivery_fee": 20.00,
  "total": 44.00,
  "items": [
    {
      "id": 1,
      "product_id": 42,
      "product_name": "Крем Garnier BB 50мл",
      "product_image_url": "/uploads/products/garnier-bb.jpg",
      "quantity": 2,
      "price": 12.00,
      "total": 24.00
    }
  ],
  "created_at": "2026-02-24T10:30:00Z",
  "updated_at": "2026-02-24T11:00:00Z"
}
```

#### Go struct

```go
type OrderStatus string

const (
    OrderStatusNew       OrderStatus = "new"
    OrderStatusConfirmed OrderStatus = "confirmed"
    OrderStatusShipped   OrderStatus = "shipped"
    OrderStatusDelivered OrderStatus = "delivered"
    OrderStatusCancelled OrderStatus = "cancelled"
)

type OrderType string

const (
    OrderTypeDelivery OrderType = "delivery"
    OrderTypePickup   OrderType = "pickup"
)

type Order struct {
    ID             int         `json:"id" db:"id"`
    OrderNumber    string      `json:"order_number" db:"order_number"`
    Type           OrderType   `json:"type" db:"type"`
    Status         OrderStatus `json:"status" db:"status"`
    FullName       string      `json:"full_name" db:"full_name"`
    Phone          string      `json:"phone" db:"phone"`
    Address        *string     `json:"address" db:"address"`
    Note           *string     `json:"note" db:"note"`
    DeliveryZoneID *int        `json:"delivery_zone_id" db:"delivery_zone_id"`
    DeliveryDate   *string     `json:"delivery_date" db:"delivery_date"`
    TimeSlot       *string     `json:"time_slot" db:"time_slot"`
    Subtotal       float64     `json:"subtotal" db:"subtotal"`
    DeliveryFee    float64     `json:"delivery_fee" db:"delivery_fee"`
    Total          float64     `json:"total" db:"total"`
    Items          []OrderItem `json:"items"`
    CreatedAt      time.Time   `json:"created_at" db:"created_at"`
    UpdatedAt      time.Time   `json:"updated_at" db:"updated_at"`
}

type OrderItem struct {
    ID              int     `json:"id" db:"id"`
    OrderID         int     `json:"order_id" db:"order_id"`
    ProductID       int     `json:"product_id" db:"product_id"`
    ProductName     string  `json:"product_name" db:"product_name"`
    ProductImageUrl string  `json:"product_image_url" db:"product_image_url"`
    Quantity        int     `json:"quantity" db:"quantity"`
    Price           float64 `json:"price" db:"price"`
    Total           float64 `json:"total" db:"total"`
}
```

#### TypeScript

```typescript
type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type OrderType = 'delivery' | 'pickup';

interface Order {
  id: number;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  full_name: string;
  phone: string;
  address?: string;
  note?: string;
  delivery_zone_id?: number;
  delivery_date?: string;
  time_slot?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image_url: string;
  quantity: number;
  price: number;
  total: number;
}
```

---

### 3.7 CreateOrder (Запрос на создание заказа)

| Поле | Тип | JSON ключ | Обязательное | Описание |
|---|---|---|---|---|
| Type | `string` | `type` | да | `delivery` / `pickup` |
| FullName | `string` | `full_name` | да | ФИО |
| Phone | `string` | `phone` | да | Телефон |
| Address | `string` | `address` | при delivery | Адрес |
| Note | `string` | `note` | нет | Заметка |
| DeliveryZoneID | `int` | `delivery_zone_id` | при delivery | Зона доставки |
| DeliveryDate | `string` | `delivery_date` | да | Дата (`YYYY-MM-DD`) |
| TimeSlot | `string` | `time_slot` | да | Слот (`14:00-16:00`) |
| Items | `[]CartItemReq` | `items` | да | Товары |

#### JSON (Request Body)

```json
{
  "type": "delivery",
  "full_name": "Иван Иванов",
  "phone": "+99365123456",
  "address": "ул. Пушкина, д. 10",
  "note": "Позвонить за 10 минут",
  "delivery_zone_id": 2,
  "delivery_date": "2026-02-25",
  "time_slot": "14:00-16:00",
  "items": [
    { "product_id": 42, "quantity": 2 },
    { "product_id": 15, "quantity": 1 }
  ]
}
```

#### Go struct

```go
type CreateOrderRequest struct {
    Type           OrderType        `json:"type" validate:"required,oneof=delivery pickup"`
    FullName       string           `json:"full_name" validate:"required,min=2,max=100"`
    Phone          string           `json:"phone" validate:"required"`
    Address        *string          `json:"address"`
    Note           *string          `json:"note"`
    DeliveryZoneID *int             `json:"delivery_zone_id"`
    DeliveryDate   string           `json:"delivery_date" validate:"required"`
    TimeSlot       string           `json:"time_slot" validate:"required"`
    Items          []CartItemRequest `json:"items" validate:"required,min=1"`
}

type CartItemRequest struct {
    ProductID int `json:"product_id" validate:"required"`
    Quantity  int `json:"quantity" validate:"required,min=1"`
}
```

#### TypeScript

```typescript
interface CreateOrderRequest {
  type: OrderType;
  full_name: string;
  phone: string;
  address?: string;
  note?: string;
  delivery_zone_id?: number;
  delivery_date: string;
  time_slot: string;
  items: { product_id: number; quantity: number }[];
}
```

---

### 3.8 DeliveryZone (Зона доставки)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| NameRu | `string` | `name_ru` | нет | Название (RU) |
| NameTm | `string` | `name_tm` | нет | Название (TM) |
| DeliveryPrice | `float` | `delivery_price` | нет | Стоимость доставки |
| IsActive | `bool` | `is_active` | нет | Активна ли |

#### JSON

```json
{
  "id": 2,
  "name": "Центр города",
  "delivery_price": 20.00
}
```

#### Go struct

```go
type DeliveryZone struct {
    ID            int     `json:"id" db:"id"`
    NameRu        string  `json:"name_ru" db:"name_ru"`
    NameTm        string  `json:"name_tm" db:"name_tm"`
    DeliveryPrice float64 `json:"delivery_price" db:"delivery_price"`
    IsActive      bool    `json:"is_active" db:"is_active"`
}

type DeliveryZoneResponse struct {
    ID            int     `json:"id"`
    Name          string  `json:"name"`
    DeliveryPrice float64 `json:"delivery_price"`
}
```

#### TypeScript

```typescript
interface DeliveryZone {
  id: number;
  name: string;
  delivery_price: number;
}

interface DeliveryZoneAdmin extends DeliveryZone {
  name_ru: string;
  name_tm: string;
  is_active: boolean;
}
```

---

### 3.9 TimeSlot (Временной слот)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| StartTime | `string` | `start_time` | нет | Начало (`HH:MM`) |
| EndTime | `string` | `end_time` | нет | Конец (`HH:MM`) |
| Label | `string` | `label` | нет | Отображаемый текст |
| IsActive | `bool` | `is_active` | нет | Активен ли |

#### JSON

```json
{
  "id": 1,
  "start_time": "14:00",
  "end_time": "16:00",
  "label": "14:00 - 16:00"
}
```

#### Go struct

```go
type TimeSlot struct {
    ID        int    `json:"id" db:"id"`
    StartTime string `json:"start_time" db:"start_time"`
    EndTime   string `json:"end_time" db:"end_time"`
    Label     string `json:"label" db:"label"`
    IsActive  bool   `json:"is_active" db:"is_active"`
}
```

#### TypeScript

```typescript
interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  label: string;
}
```

---

### 3.10 CartItem (Элемент корзины — клиентская модель)

Хранится **локально** на клиенте (Flutter — SharedPreferences, React — localStorage).

| Поле | Тип | JSON ключ | Описание |
|---|---|---|---|
| Product | `Product` | `product` | Полный объект товара |
| Quantity | `int` | `quantity` | Количество |

#### JSON (localStorage)

```json
{
  "product": { "id": 42, "name": "...", "price": 12.00, "..." : "..." },
  "quantity": 2
}
```

#### TypeScript

```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

#### Dart

```dart
class CartItem {
  final Product product;
  int quantity;

  CartItem({ required this.product, required this.quantity });

  double get totalPrice => product.price * quantity;

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
    product: Product.fromJson(json['product']),
    quantity: json['quantity'],
  );

  Map<String, dynamic> toJson() => {
    'product': product.toJson(),
    'quantity': quantity,
  };
}
```

---

### 3.11 Admin (Администратор)

| Поле | Тип | JSON ключ | Nullable | Описание |
|---|---|---|---|---|
| ID | `int` | `id` | нет | Уникальный идентификатор |
| Username | `string` | `username` | нет | Логин |
| PasswordHash | `string` | — | нет | Хэш пароля (не отдаётся клиенту) |
| FullName | `string` | `full_name` | да | ФИО |
| Role | `string` | `role` | нет | `superadmin` / `admin` / `manager` |
| IsActive | `bool` | `is_active` | нет | Активен ли |
| CreatedAt | `datetime` | `created_at` | нет | Дата создания |

#### Go struct

```go
type AdminRole string

const (
    RoleSuperAdmin AdminRole = "superadmin"
    RoleAdmin      AdminRole = "admin"
    RoleManager    AdminRole = "manager"
)

type Admin struct {
    ID           int       `json:"id" db:"id"`
    Username     string    `json:"username" db:"username"`
    PasswordHash string    `json:"-" db:"password_hash"`
    FullName     *string   `json:"full_name" db:"full_name"`
    Role         AdminRole `json:"role" db:"role"`
    IsActive     bool      `json:"is_active" db:"is_active"`
    CreatedAt    time.Time `json:"created_at" db:"created_at"`
}
```

#### TypeScript

```typescript
type AdminRole = 'superadmin' | 'admin' | 'manager';

interface Admin {
  id: number;
  username: string;
  full_name?: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}
```

---

### 3.12 HomeData (Данные главной страницы)

Агрегированный ответ для главной страницы мобильного и веб-клиента.

#### JSON

```json
{
  "banners": [ ... ],
  "brands": [ ... ],
  "sections": [
    {
      "id": "new_arrivals",
      "title": "Новинки",
      "type": "new",
      "products": [ ... ]
    },
    {
      "id": "discounts",
      "title": "Скидки",
      "type": "discount",
      "products": [ ... ]
    }
  ],
  "categories": [ ... ]
}
```

#### Go struct

```go
type HomeData struct {
    Banners    []BannerResponse   `json:"banners"`
    Brands     []BrandResponse    `json:"brands"`
    Sections   []HomeSection      `json:"sections"`
    Categories []CategoryResponse `json:"categories"`
}

type HomeSection struct {
    ID       string            `json:"id"`
    Title    string            `json:"title"`
    Type     string            `json:"type"`
    Products []ProductResponse `json:"products"`
}
```

#### TypeScript

```typescript
interface HomeData {
  banners: Banner[];
  brands: Brand[];
  sections: HomeSection[];
  categories: Category[];
}

interface HomeSection {
  id: string;
  title: string;
  type: 'new' | 'discount';
  products: Product[];
}
```

---

## 4. API обёртка ответов

Все ответы API оборачиваются в стандартную структуру.

### 4.1 Успешный ответ

```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

### 4.2 Успешный ответ (список с пагинацией)

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "total_pages": 8
  }
}
```

### 4.3 Ошибка

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Поле 'full_name' обязательно",
    "details": {
      "full_name": "Поле не должно быть пустым"
    }
  }
}
```

### Go structs

```go
type ApiResponse struct {
    Success    bool        `json:"success"`
    Data       interface{} `json:"data,omitempty"`
    Message    string      `json:"message,omitempty"`
    Pagination *Pagination `json:"pagination,omitempty"`
    Error      *ApiError   `json:"error,omitempty"`
}

type Pagination struct {
    Page       int `json:"page"`
    Limit      int `json:"limit"`
    Total      int `json:"total"`
    TotalPages int `json:"total_pages"`
}

type ApiError struct {
    Code    string            `json:"code"`
    Message string            `json:"message"`
    Details map[string]string `json:"details,omitempty"`
}
```

### TypeScript

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  error?: ApiErrorResponse;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}
```

---

## 5. Database Schema (PostgreSQL)

```sql
-- Бренды
CREATE TABLE brands (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    logo_url    VARCHAR(500),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Категории
CREATE TABLE categories (
    id                 SERIAL PRIMARY KEY,
    name_ru            VARCHAR(255) NOT NULL,
    name_tm            VARCHAR(255) NOT NULL,
    image_url          VARCHAR(500),
    has_subcategories  BOOLEAN NOT NULL DEFAULT false,
    sort_order         INT NOT NULL DEFAULT 0,
    is_active          BOOLEAN NOT NULL DEFAULT true,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Подкатегории
CREATE TABLE subcategories (
    id          SERIAL PRIMARY KEY,
    parent_id   INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name_ru     VARCHAR(255) NOT NULL,
    name_tm     VARCHAR(255) NOT NULL,
    image_url   VARCHAR(500),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true
);

-- Товары
CREATE TABLE products (
    id               SERIAL PRIMARY KEY,
    name_ru          VARCHAR(500) NOT NULL,
    name_tm          VARCHAR(500) NOT NULL,
    brand_id         INT REFERENCES brands(id) ON DELETE SET NULL,
    category_id      INT REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id   INT REFERENCES subcategories(id) ON DELETE SET NULL,
    description_ru   TEXT,
    description_tm   TEXT,
    price            DECIMAL(10,2) NOT NULL,
    old_price        DECIMAL(10,2),
    discount_percent INT,
    image_url        VARCHAR(500) NOT NULL,
    images           TEXT[],                -- PostgreSQL array
    barcode          VARCHAR(50),
    is_active        BOOLEAN NOT NULL DEFAULT true,
    is_new           BOOLEAN NOT NULL DEFAULT false,
    is_discount      BOOLEAN NOT NULL DEFAULT false,
    sort_order       INT NOT NULL DEFAULT 0,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_is_new ON products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_is_discount ON products(is_discount) WHERE is_discount = true;
CREATE INDEX idx_products_price ON products(price);

-- Баннеры
CREATE TABLE banners (
    id          SERIAL PRIMARY KEY,
    image_url   VARCHAR(500) NOT NULL,
    link_type   VARCHAR(50),
    link_value  VARCHAR(255),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Зоны доставки
CREATE TABLE delivery_zones (
    id              SERIAL PRIMARY KEY,
    name_ru         VARCHAR(255) NOT NULL,
    name_tm         VARCHAR(255) NOT NULL,
    delivery_price  DECIMAL(10,2) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true
);

-- Временные слоты
CREATE TABLE time_slots (
    id          SERIAL PRIMARY KEY,
    start_time  VARCHAR(5) NOT NULL,
    end_time    VARCHAR(5) NOT NULL,
    label       VARCHAR(20) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT true
);

-- Заказы
CREATE TABLE orders (
    id               SERIAL PRIMARY KEY,
    order_number     VARCHAR(20) NOT NULL UNIQUE,
    type             VARCHAR(20) NOT NULL CHECK (type IN ('delivery', 'pickup')),
    status           VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    full_name        VARCHAR(200) NOT NULL,
    phone            VARCHAR(50) NOT NULL,
    address          VARCHAR(500),
    note             TEXT,
    delivery_zone_id INT REFERENCES delivery_zones(id),
    delivery_date    DATE,
    time_slot        VARCHAR(20),
    subtotal         DECIMAL(10,2) NOT NULL,
    delivery_fee     DECIMAL(10,2) NOT NULL DEFAULT 0,
    total            DECIMAL(10,2) NOT NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Позиции заказа
CREATE TABLE order_items (
    id                SERIAL PRIMARY KEY,
    order_id          INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id        INT NOT NULL REFERENCES products(id),
    product_name      VARCHAR(500) NOT NULL,
    product_image_url VARCHAR(500) NOT NULL,
    quantity          INT NOT NULL CHECK (quantity > 0),
    price             DECIMAL(10,2) NOT NULL,
    total             DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Администраторы
CREATE TABLE admins (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(200),
    role          VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('superadmin', 'admin', 'manager')),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 6. Соответствие моделей по платформам

| Модель | Backend (Go) | Admin (React TS) | Web Client (React TS) | Mobile (Flutter/Dart) |
|---|---|---|---|---|
| Product | `Product` / `ProductResponse` | `ProductAdmin` | `Product` | `Product` |
| Category | `Category` / `CategoryResponse` | `CategoryAdmin` | `Category` | `Category` |
| SubCategory | `SubCategory` / `SubCategoryResponse` | `SubCategoryAdmin` | `SubCategory` | `SubCategory` |
| Brand | `Brand` / `BrandResponse` | `BrandAdmin` | `Brand` | `Brand` |
| Banner | `Banner` / `BannerResponse` | `BannerAdmin` | `Banner` | `Banner` |
| Order | `Order` | `Order` | `Order` | `Order` |
| OrderItem | `OrderItem` | `OrderItem` | `OrderItem` | `OrderItem` |
| DeliveryZone | `DeliveryZone` / `DeliveryZoneResponse` | `DeliveryZoneAdmin` | `DeliveryZone` | `DeliveryZone` |
| TimeSlot | `TimeSlot` | `TimeSlot` | `TimeSlot` | `TimeSlot` |
| CartItem | — (клиентская) | — | `CartItem` | `CartItem` |
| Admin | `Admin` | `Admin` | — | — |
| HomeData | `HomeData` | — | `HomeData` | `HomeData` |
| ApiResponse | `ApiResponse` | `ApiResponse<T>` | `ApiResponse<T>` | `ApiResponse` |

---

## 7. Правила локализации моделей

| Правило | Описание |
|---|---|
| Backend хранит оба языка | `name_ru`, `name_tm`, `description_ru`, `description_tm` |
| API отдаёт один язык | На основе `?lang=ru` или `?lang=tm` → поле `name`, `description` |
| Admin видит оба языка | Формы с двумя полями для каждого языка |
| Brand.name — одинаковый | Бренды не локализуются (ARIEL, GARNIER — везде одинаково) |
| Статусы заказов | Локализация на клиенте по enum-значениям |
