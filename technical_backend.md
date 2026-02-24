# 🖥️ Commerce — Go Backend Technical Specification

> REST API сервер для e-commerce приложения бытовой химии, косметики и товаров для дома.
> Обслуживает мобильное приложение (Flutter), веб-клиент (React) и админ-панель (React).

---

## 1. Обзор проекта

| Параметр | Значение |
|---|---|
| Язык | Go 1.22+ |
| Фреймворк | `Gin` (HTTP router) |
| БД | PostgreSQL 16 |
| ORM / Query | `sqlx` (raw SQL + struct mapping) |
| Миграции | `golang-migrate` |
| Валидация | `go-playground/validator` |
| Auth (Admin) | JWT (`golang-jwt/jwt`) |
| Хеширование | `bcrypt` |
| Загрузка файлов | Локальная файловая система (`/uploads/`) |
| Конфигурация | `.env` + `viper` |
| Логирование | `zerolog` |
| Документация | Swagger (`swaggo/swag`) |
| Контейнеризация | Docker + Docker Compose |

---

## 2. Архитектура

### 2.1 Слои

```
┌───────────────────────────────────────────┐
│              HTTP Layer (Gin)              │  ← Handlers / Controllers
├───────────────────────────────────────────┤
│            Service Layer                  │  ← Business logic
├───────────────────────────────────────────┤
│           Repository Layer                │  ← Database access (sqlx)
├───────────────────────────────────────────┤
│             PostgreSQL                    │  ← Data storage
└───────────────────────────────────────────┘
```

### 2.2 Структура папок

```
backend/
├── cmd/
│   └── server/
│       └── main.go                    # Entry point
│
├── internal/
│   ├── config/
│   │   └── config.go                  # Viper config loading
│   │
│   ├── database/
│   │   ├── postgres.go                # DB connection
│   │   └── migrations/
│   │       ├── 001_create_brands.up.sql
│   │       ├── 001_create_brands.down.sql
│   │       ├── 002_create_categories.up.sql
│   │       ├── 002_create_categories.down.sql
│   │       ├── 003_create_subcategories.up.sql
│   │       ├── 004_create_products.up.sql
│   │       ├── 005_create_banners.up.sql
│   │       ├── 006_create_delivery_zones.up.sql
│   │       ├── 007_create_time_slots.up.sql
│   │       ├── 008_create_orders.up.sql
│   │       ├── 009_create_order_items.up.sql
│   │       └── 010_create_admins.up.sql
│   │
│   ├── models/
│   │   ├── product.go
│   │   ├── category.go
│   │   ├── subcategory.go
│   │   ├── brand.go
│   │   ├── banner.go
│   │   ├── order.go
│   │   ├── delivery_zone.go
│   │   ├── time_slot.go
│   │   ├── admin.go
│   │   └── response.go               # ApiResponse, Pagination, ApiError
│   │
│   ├── repository/
│   │   ├── product_repo.go
│   │   ├── category_repo.go
│   │   ├── brand_repo.go
│   │   ├── banner_repo.go
│   │   ├── order_repo.go
│   │   ├── delivery_zone_repo.go
│   │   ├── time_slot_repo.go
│   │   └── admin_repo.go
│   │
│   ├── service/
│   │   ├── product_service.go
│   │   ├── category_service.go
│   │   ├── brand_service.go
│   │   ├── banner_service.go
│   │   ├── order_service.go
│   │   ├── delivery_zone_service.go
│   │   ├── time_slot_service.go
│   │   ├── admin_service.go
│   │   ├── home_service.go            # Агрегация данных для Home
│   │   └── upload_service.go          # Загрузка файлов
│   │
│   ├── handler/
│   │   ├── product_handler.go
│   │   ├── category_handler.go
│   │   ├── brand_handler.go
│   │   ├── banner_handler.go
│   │   ├── order_handler.go
│   │   ├── delivery_zone_handler.go
│   │   ├── time_slot_handler.go
│   │   ├── admin_handler.go
│   │   ├── home_handler.go
│   │   ├── upload_handler.go
│   │   └── auth_handler.go            # Login, refresh token
│   │
│   ├── middleware/
│   │   ├── auth.go                    # JWT authentication
│   │   ├── cors.go                    # CORS настройки
│   │   ├── logger.go                  # Request logging
│   │   └── recovery.go               # Panic recovery
│   │
│   ├── router/
│   │   └── router.go                  # Gin route registration
│   │
│   └── utils/
│       ├── response.go                # Helper: JSON responses
│       ├── pagination.go              # Helper: parse page/limit
│       ├── language.go                # Helper: get lang from query
│       └── validator.go               # Custom validation rules
│
├── uploads/                           # Загруженные файлы (gitignored)
│   ├── products/
│   ├── categories/
│   ├── brands/
│   └── banners/
│
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── go.mod
└── go.sum
```

---

## 3. Конфигурация

### 3.1 .env

```env
# Server
SERVER_PORT=8080
SERVER_MODE=release        # debug / release

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=commerce
DB_PASSWORD=secret
DB_NAME=commerce_db
DB_SSLMODE=disable

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=168h    # 7 days

# Upload
UPLOAD_DIR=./uploads
UPLOAD_MAX_SIZE=10485760   # 10MB
BASE_URL=https://api.elinhim.com
```

### 3.2 Config struct

```go
type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    JWT      JWTConfig
    Upload   UploadConfig
}

type ServerConfig struct {
    Port string `mapstructure:"SERVER_PORT"`
    Mode string `mapstructure:"SERVER_MODE"`
}

type DatabaseConfig struct {
    Host     string `mapstructure:"DB_HOST"`
    Port     string `mapstructure:"DB_PORT"`
    User     string `mapstructure:"DB_USER"`
    Password string `mapstructure:"DB_PASSWORD"`
    DBName   string `mapstructure:"DB_NAME"`
    SSLMode  string `mapstructure:"DB_SSLMODE"`
}

type JWTConfig struct {
    Secret        string        `mapstructure:"JWT_SECRET"`
    Expiry        time.Duration `mapstructure:"JWT_EXPIRY"`
    RefreshExpiry time.Duration `mapstructure:"JWT_REFRESH_EXPIRY"`
}

type UploadConfig struct {
    Dir     string `mapstructure:"UPLOAD_DIR"`
    MaxSize int64  `mapstructure:"UPLOAD_MAX_SIZE"`
    BaseURL string `mapstructure:"BASE_URL"`
}
```

---

## 4. API Routes

### 4.1 Public API (Клиент — Mobile & Web)

Префикс: `/api/v1`

| Метод | Endpoint | Handler | Описание |
|---|---|---|---|
| `GET` | `/home` | `HomeHandler.GetHome` | Данные главной страницы |
| `GET` | `/banners` | `BannerHandler.GetAll` | Список баннеров |
| `GET` | `/categories` | `CategoryHandler.GetAll` | Список категорий с подкатегориями |
| `GET` | `/categories/:id/subcategories` | `CategoryHandler.GetSubcategories` | Подкатегории |
| `GET` | `/brands` | `BrandHandler.GetAll` | Список брендов |
| `GET` | `/products` | `ProductHandler.GetAll` | Список товаров (с фильтрами) |
| `GET` | `/products/:id` | `ProductHandler.GetByID` | Детали товара |
| `GET` | `/products/:id/related` | `ProductHandler.GetRelated` | Похожие товары |
| `GET` | `/delivery-zones` | `DeliveryZoneHandler.GetAll` | Зоны доставки |
| `GET` | `/time-slots` | `TimeSlotHandler.GetAll` | Временные слоты |
| `POST` | `/orders` | `OrderHandler.Create` | Создание заказа |
| `GET` | `/orders` | `OrderHandler.GetByPhone` | История заказов по телефону |

### 4.2 Admin API

Префикс: `/api/v1/admin`

Все маршруты защищены JWT middleware.

| Метод | Endpoint | Handler | Описание |
|---|---|---|---|
| **Auth** | | | |
| `POST` | `/auth/login` | `AuthHandler.Login` | Вход |
| `POST` | `/auth/refresh` | `AuthHandler.Refresh` | Обновление токена |
| `GET` | `/auth/me` | `AuthHandler.Me` | Текущий админ |
| **Products** | | | |
| `GET` | `/products` | `ProductHandler.AdminGetAll` | Список (с is_active, все языки) |
| `GET` | `/products/:id` | `ProductHandler.AdminGetByID` | Детали |
| `POST` | `/products` | `ProductHandler.Create` | Создание |
| `PUT` | `/products/:id` | `ProductHandler.Update` | Обновление |
| `DELETE` | `/products/:id` | `ProductHandler.Delete` | Удаление |
| **Categories** | | | |
| `GET` | `/categories` | `CategoryHandler.AdminGetAll` | Список |
| `POST` | `/categories` | `CategoryHandler.Create` | Создание |
| `PUT` | `/categories/:id` | `CategoryHandler.Update` | Обновление |
| `DELETE` | `/categories/:id` | `CategoryHandler.Delete` | Удаление |
| **SubCategories** | | | |
| `POST` | `/subcategories` | `CategoryHandler.CreateSub` | Создание |
| `PUT` | `/subcategories/:id` | `CategoryHandler.UpdateSub` | Обновление |
| `DELETE` | `/subcategories/:id` | `CategoryHandler.DeleteSub` | Удаление |
| **Brands** | | | |
| `GET` | `/brands` | `BrandHandler.AdminGetAll` | Список |
| `POST` | `/brands` | `BrandHandler.Create` | Создание |
| `PUT` | `/brands/:id` | `BrandHandler.Update` | Обновление |
| `DELETE` | `/brands/:id` | `BrandHandler.Delete` | Удаление |
| **Banners** | | | |
| `GET` | `/banners` | `BannerHandler.AdminGetAll` | Список |
| `POST` | `/banners` | `BannerHandler.Create` | Создание |
| `PUT` | `/banners/:id` | `BannerHandler.Update` | Обновление |
| `DELETE` | `/banners/:id` | `BannerHandler.Delete` | Удаление |
| **Orders** | | | |
| `GET` | `/orders` | `OrderHandler.AdminGetAll` | Все заказы |
| `GET` | `/orders/:id` | `OrderHandler.AdminGetByID` | Детали заказа |
| `PUT` | `/orders/:id/status` | `OrderHandler.UpdateStatus` | Смена статуса |
| **Delivery Zones** | | | |
| `GET` | `/delivery-zones` | `DeliveryZoneHandler.AdminGetAll` | Список |
| `POST` | `/delivery-zones` | `DeliveryZoneHandler.Create` | Создание |
| `PUT` | `/delivery-zones/:id` | `DeliveryZoneHandler.Update` | Обновление |
| `DELETE` | `/delivery-zones/:id` | `DeliveryZoneHandler.Delete` | Удаление |
| **Time Slots** | | | |
| `GET` | `/time-slots` | `TimeSlotHandler.AdminGetAll` | Список |
| `POST` | `/time-slots` | `TimeSlotHandler.Create` | Создание |
| `PUT` | `/time-slots/:id` | `TimeSlotHandler.Update` | Обновление |
| `DELETE` | `/time-slots/:id` | `TimeSlotHandler.Delete` | Удаление |
| **Admins** | | | |
| `GET` | `/admins` | `AdminHandler.GetAll` | Список (superadmin) |
| `POST` | `/admins` | `AdminHandler.Create` | Создание (superadmin) |
| `PUT` | `/admins/:id` | `AdminHandler.Update` | Обновление |
| `DELETE` | `/admins/:id` | `AdminHandler.Delete` | Удаление (superadmin) |
| **Upload** | | | |
| `POST` | `/upload` | `UploadHandler.Upload` | Загрузка файла |
| `DELETE` | `/upload` | `UploadHandler.Delete` | Удаление файла |

---

## 5. Query Parameters

### 5.1 Products (GET /products)

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `lang` | `string` | `ru` | Язык (`ru` / `tm`) |
| `category_id` | `int` | — | Фильтр по категории |
| `subcategory_id` | `int` | — | Фильтр по подкатегории |
| `brand_id` | `int` | — | Фильтр по бренду |
| `search` | `string` | — | Поиск по имени (ILIKE) |
| `sort` | `string` | — | `price_asc`, `price_desc`, `newest` |
| `is_new` | `bool` | — | Только новинки |
| `is_discount` | `bool` | — | Только со скидкой |
| `page` | `int` | `1` | Номер страницы |
| `limit` | `int` | `20` | Элементов на странице (max 100) |

### 5.2 Orders (GET /orders — admin)

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `type` | `string` | — | `delivery` / `pickup` |
| `status` | `string` | — | Фильтр по статусу |
| `search` | `string` | — | Поиск по номеру или телефону |
| `date_from` | `string` | — | Дата от (YYYY-MM-DD) |
| `date_to` | `string` | — | Дата до (YYYY-MM-DD) |
| `page` | `int` | `1` | Номер страницы |
| `limit` | `int` | `20` | Элементов на странице |

---

## 6. Authentication (JWT)

### 6.1 Login Flow

```
POST /api/v1/admin/auth/login
{
  "username": "admin",
  "password": "secret123"
}

→ 200 OK
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400,
    "admin": {
      "id": 1,
      "username": "admin",
      "full_name": "Super Admin",
      "role": "superadmin"
    }
  }
}
```

### 6.2 JWT Claims

```go
type Claims struct {
    AdminID  int       `json:"admin_id"`
    Username string    `json:"username"`
    Role     AdminRole `json:"role"`
    jwt.RegisteredClaims
}
```

### 6.3 Auth Middleware

```go
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        // Bearer <token> → parse → validate → set admin context
        // 401 if invalid or expired
    }
}
```

### 6.4 Role-based Access

| Роль | Доступ |
|---|---|
| `superadmin` | Полный доступ, управление админами |
| `admin` | Всё кроме управления админами |
| `manager` | Только просмотр + управление заказами |

---

## 7. Middleware

### 7.1 CORS

```go
func CORSMiddleware() gin.HandlerFunc {
    return cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001", "https://elinhim.com", "https://admin.elinhim.com"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept-Language"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}
```

### 7.2 Logger

```go
func LoggerMiddleware(logger zerolog.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()
        logger.Info().
            Str("method", c.Request.Method).
            Str("path", c.Request.URL.Path).
            Int("status", c.Writer.Status()).
            Dur("latency", time.Since(start)).
            Msg("request")
    }
}
```

---

## 8. Localization Logic

```go
// utils/language.go
func GetLang(c *gin.Context) string {
    lang := c.Query("lang")
    if lang == "tm" {
        return "tm"
    }
    return "ru"
}

// В service слое
func (s *ProductService) GetAll(ctx context.Context, lang string, filters ProductFilters) ([]ProductResponse, Pagination, error) {
    products, total, err := s.repo.GetAll(ctx, filters)
    if err != nil {
        return nil, Pagination{}, err
    }

    responses := make([]ProductResponse, len(products))
    for i, p := range products {
        responses[i] = p.ToResponse(lang)
    }
    // ...
}

// В модели
func (p *Product) ToResponse(lang string) ProductResponse {
    name := p.NameRu
    description := p.DescriptionRu
    if lang == "tm" {
        name = p.NameTm
        if p.DescriptionTm != nil {
            description = p.DescriptionTm
        }
    }
    return ProductResponse{
        ID:          p.ID,
        Name:        name,
        Description: description,
        // ...
    }
}
```

---

## 9. File Upload

### 9.1 Upload Handler

```go
func (h *UploadHandler) Upload(c *gin.Context) {
    file, err := c.FormFile("file")
    // Validate: size, type (image/jpeg, image/png, image/webp)
    // Generate unique filename: uuid + ext
    // Save to: uploads/{category}/filename.ext
    // Return: { "url": "/uploads/products/abc123.jpg" }
}
```

### 9.2 Serving Static Files

```go
router.Static("/uploads", "./uploads")
```

---

## 10. Пример Handler → Service → Repository

### Handler

```go
func (h *ProductHandler) GetAll(c *gin.Context) {
    lang := utils.GetLang(c)
    filters := ProductFilters{
        CategoryID:    utils.QueryInt(c, "category_id"),
        SubCategoryID: utils.QueryInt(c, "subcategory_id"),
        BrandID:       utils.QueryInt(c, "brand_id"),
        Search:        c.Query("search"),
        Sort:          c.Query("sort"),
        IsNew:         utils.QueryBool(c, "is_new"),
        IsDiscount:    utils.QueryBool(c, "is_discount"),
    }
    page, limit := utils.GetPagination(c)

    products, pagination, err := h.service.GetAll(c.Request.Context(), lang, filters, page, limit)
    if err != nil {
        utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
        return
    }

    utils.SuccessResponse(c, products, &pagination)
}
```

### Service

```go
func (s *ProductService) GetAll(ctx context.Context, lang string, filters ProductFilters, page, limit int) ([]ProductResponse, Pagination, error) {
    products, total, err := s.repo.GetAll(ctx, filters, page, limit)
    if err != nil {
        return nil, Pagination{}, err
    }

    responses := make([]ProductResponse, len(products))
    for i, p := range products {
        responses[i] = p.ToResponse(lang)
        // Resolve brand name
        if p.BrandID != nil {
            brand, _ := s.brandRepo.GetByID(ctx, *p.BrandID)
            if brand != nil {
                responses[i].BrandName = brand.Name
            }
        }
    }

    pagination := utils.NewPagination(page, limit, total)
    return responses, pagination, nil
}
```

### Repository

```go
func (r *ProductRepo) GetAll(ctx context.Context, filters ProductFilters, page, limit int) ([]Product, int, error) {
    query := `SELECT * FROM products WHERE is_active = true`
    countQuery := `SELECT COUNT(*) FROM products WHERE is_active = true`
    args := []interface{}{}
    argIdx := 1

    if filters.CategoryID != nil {
        query += fmt.Sprintf(" AND category_id = $%d", argIdx)
        countQuery += fmt.Sprintf(" AND category_id = $%d", argIdx)
        args = append(args, *filters.CategoryID)
        argIdx++
    }
    // ... other filters ...

    switch filters.Sort {
    case "price_asc":
        query += " ORDER BY price ASC"
    case "price_desc":
        query += " ORDER BY price DESC"
    default:
        query += " ORDER BY sort_order ASC, id DESC"
    }

    // Count
    var total int
    err := r.db.GetContext(ctx, &total, countQuery, args...)
    if err != nil {
        return nil, 0, err
    }

    // Pagination
    offset := (page - 1) * limit
    query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argIdx, argIdx+1)
    args = append(args, limit, offset)

    var products []Product
    err = r.db.SelectContext(ctx, &products, query, args...)
    return products, total, err
}
```

---

## 11. Docker

### 11.1 Dockerfile

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/.env .
EXPOSE 8080
CMD ["./server"]
```

### 11.2 docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: commerce
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: commerce_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      - DB_HOST=db
    volumes:
      - ./uploads:/app/uploads

volumes:
  postgres_data:
```

---

## 12. Makefile

```makefile
.PHONY: run build migrate-up migrate-down seed swagger

run:
	go run cmd/server/main.go

build:
	go build -o bin/server cmd/server/main.go

migrate-up:
	migrate -path internal/database/migrations -database "postgres://commerce:secret@localhost:5432/commerce_db?sslmode=disable" up

migrate-down:
	migrate -path internal/database/migrations -database "postgres://commerce:secret@localhost:5432/commerce_db?sslmode=disable" down 1

seed:
	go run cmd/seed/main.go

swagger:
	swag init -g cmd/server/main.go -o docs

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
```

---

## 13. Go Packages (go.mod)

```
module github.com/meransoft/commerce-backend

go 1.22

require (
    github.com/gin-gonic/gin
    github.com/gin-contrib/cors
    github.com/jmoiron/sqlx
    github.com/lib/pq
    github.com/golang-jwt/jwt/v5
    github.com/go-playground/validator/v10
    github.com/spf13/viper
    github.com/rs/zerolog
    github.com/google/uuid
    github.com/golang-migrate/migrate/v4
    github.com/swaggo/swag
    github.com/swaggo/gin-swagger
    golang.org/x/crypto                     // bcrypt
)
```

---

## 14. Error Codes

| Code | HTTP | Описание |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Ошибка валидации полей |
| `UNAUTHORIZED` | 401 | Не авторизован / невалидный токен |
| `FORBIDDEN` | 403 | Недостаточно прав |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `CONFLICT` | 409 | Конфликт (дубликат) |
| `INTERNAL_ERROR` | 500 | Внутренняя ошибка сервера |
| `FILE_TOO_LARGE` | 413 | Файл слишком большой |
| `UNSUPPORTED_FILE` | 415 | Неподдерживаемый тип файла |

---

## 15. Чеклист разработки

- [ ] Инициализация проекта Go, структура папок
- [ ] Конфигурация (viper + .env)
- [ ] Подключение PostgreSQL (sqlx)
- [ ] Миграции (golang-migrate)
- [ ] Модели данных (все структуры)
- [ ] Repository слой: products, categories, brands, banners, orders, delivery_zones, time_slots, admins
- [ ] Service слой: бизнес-логика, локализация, агрегация home
- [ ] Handler слой: все endpoints (public + admin)
- [ ] Middleware: CORS, JWT auth, logger, recovery
- [ ] JWT: login, refresh, claims, role-based access
- [ ] File upload: загрузка, валидация, хранение
- [ ] Валидация запросов (validator)
- [ ] Swagger документация
- [ ] Docker + Docker Compose
- [ ] Seed данных (начальные категории, бренды, admin)
- [ ] Тестирование endpoints (Postman / httpie)
