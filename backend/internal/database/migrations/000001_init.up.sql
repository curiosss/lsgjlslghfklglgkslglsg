-- Brands
CREATE TABLE IF NOT EXISTS brands (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    logo_url    VARCHAR(500),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id                 SERIAL PRIMARY KEY,
    name_ru            VARCHAR(255) NOT NULL,
    name_tm            VARCHAR(255) NOT NULL,
    image_url          VARCHAR(500),
    has_subcategories  BOOLEAN NOT NULL DEFAULT false,
    sort_order         INT NOT NULL DEFAULT 0,
    is_active          BOOLEAN NOT NULL DEFAULT true,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Subcategories
CREATE TABLE IF NOT EXISTS subcategories (
    id          SERIAL PRIMARY KEY,
    parent_id   INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name_ru     VARCHAR(255) NOT NULL,
    name_tm     VARCHAR(255) NOT NULL,
    image_url   VARCHAR(500),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true
);

-- Products
CREATE TABLE IF NOT EXISTS products (
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
    images           TEXT[],
    barcode          VARCHAR(50),
    is_active        BOOLEAN NOT NULL DEFAULT true,
    is_new           BOOLEAN NOT NULL DEFAULT false,
    is_discount      BOOLEAN NOT NULL DEFAULT false,
    sort_order       INT NOT NULL DEFAULT 0,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_is_discount ON products(is_discount) WHERE is_discount = true;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
    id          SERIAL PRIMARY KEY,
    image_url   VARCHAR(500) NOT NULL,
    link_type   VARCHAR(50),
    link_value  VARCHAR(255),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Delivery zones
CREATE TABLE IF NOT EXISTS delivery_zones (
    id              SERIAL PRIMARY KEY,
    name_ru         VARCHAR(255) NOT NULL,
    name_tm         VARCHAR(255) NOT NULL,
    delivery_price  DECIMAL(10,2) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true
);

-- Time slots
CREATE TABLE IF NOT EXISTS time_slots (
    id          SERIAL PRIMARY KEY,
    start_time  VARCHAR(5) NOT NULL,
    end_time    VARCHAR(5) NOT NULL,
    label       VARCHAR(20) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT true
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
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

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id                SERIAL PRIMARY KEY,
    order_id          INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id        INT NOT NULL REFERENCES products(id),
    product_name      VARCHAR(500) NOT NULL,
    product_image_url VARCHAR(500) NOT NULL,
    quantity          INT NOT NULL CHECK (quantity > 0),
    price             DECIMAL(10,2) NOT NULL,
    total             DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(200),
    role          VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('superadmin', 'admin', 'manager')),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
