# 📱 Commerce — Flutter Mobile App Technical Specification

> E-commerce мобильное приложение для бытовой химии, косметики и товаров для дома.
> Минималистичный чёрно-белый дизайн, мультиязычность (RU / TM), светлая и тёмная темы.

---

## 1. Обзор проекта

| Параметр | Значение |
|---|---|
| Название | Commerce |
| Пакет | `com.meransoft.commerce` |
| Платформы | Android, iOS |
| Мин. SDK | Android 6.0 (API 23) / iOS 14 |
| Язык | Dart 3.x, Flutter 3.x |
| Архитектура | Clean Simple Architecture (core + features) |
| State Management | `ChangeNotifier` + `ValueNotifier` |
| DI | `get_it` + `injectable` |
| Навигация | `go_router` |
| HTTP | `dio` |
| Локализация | RU, TM |

---

## 2. Дизайн-система

### 2.1 Цветовая палитра

#### Light Mode (основная)

| Токен | Цвет | Использование |
|---|---|---|
| `primary` | `#000000` (чёрный) | Основные кнопки, акценты, активный таб |
| `onPrimary` | `#FFFFFF` (белый) | Текст на primary-кнопках |
| `background` | `#FFFFFF` (белый) | Фон экранов |
| `surface` | `#F5F5F5` | Фон карточек, полей ввода |
| `surfaceVariant` | `#EEEEEE` | Чипсы категорий, разделители |
| `onBackground` | `#000000` | Основной текст |
| `onSurface` | `#1A1A1A` | Текст на карточках |
| `secondary` | `#666666` | Вторичный текст, описания |
| `outline` | `#E0E0E0` | Границы карточек, разделители |
| `error` | `#D32F2F` | Ошибки валидации, бейдж скидки |
| `inversePrimary` | `#FFFFFF` | Инвертированные элементы |

#### Dark Mode

| Токен | Цвет | Использование |
|---|---|---|
| `primary` | `#FFFFFF` (белый) | Основные кнопки, акценты, активный таб |
| `onPrimary` | `#000000` (чёрный) | Текст на primary-кнопках |
| `background` | `#0A0A0A` | Фон экранов |
| `surface` | `#1A1A1A` | Фон карточек |
| `surfaceVariant` | `#2A2A2A` | Чипсы, разделители |
| `onBackground` | `#FFFFFF` | Основной текст |
| `onSurface` | `#E0E0E0` | Текст на карточках |
| `secondary` | `#999999` | Вторичный текст |
| `outline` | `#333333` | Границы |
| `error` | `#EF5350` | Ошибки |

### 2.2 Типографика

Шрифт: **Inter** (Google Fonts) — чистый, современный, отличная читаемость.

| Стиль | Размер | Вес | Использование |
|---|---|---|---|
| `headlineLarge` | 28sp | `700` Bold | Заголовки экранов |
| `headlineMedium` | 22sp | `700` Bold | Названия секций |
| `titleLarge` | 18sp | `600` SemiBold | Бренд на карточке |
| `titleMedium` | 16sp | `600` SemiBold | Подзаголовки |
| `bodyLarge` | 16sp | `400` Regular | Основной текст, описания |
| `bodyMedium` | 14sp | `400` Regular | Описание товара на карточке |
| `bodySmall` | 12sp | `400` Regular | Подписи, метаданные |
| `labelLarge` | 14sp | `600` SemiBold | Текст кнопок |
| `labelMedium` | 12sp | `500` Medium | Чипсы, бейджи |
| `labelSmall` | 10sp | `500` Medium | Метки на табах |

### 2.3 Иконки

Использовать **Lucide Icons** (`lucide_icons` пакет) — тонкие линейные иконки, идеально вписываются в минималистичный ч/б дизайн. Stroke width: 1.5.

### 2.4 Скругления и отступы

| Элемент | Радиус | Padding |
|---|---|---|
| Карточка товара | `16px` | `12px` |
| Кнопка (основная) | `12px` | `16px vertical, 24px horizontal` |
| Кнопка (outline) | `12px` | `14px vertical, 20px horizontal` |
| Поле ввода | `12px` | `16px` |
| Чипс категории | `24px` (pill) | `8px vertical, 16px horizontal` |
| Карточка бренда | `16px` | `12px` |
| Модальное окно | `24px` (top) | `24px` |
| Bottom Navigation | `0px` | — |
| Изображение в карточке | `12px` | — |

### 2.5 Тени и elevation

Минимальное использование теней для чистого дизайна:

| Элемент | Тень |
|---|---|
| Карточка товара | `BoxShadow(color: black.withOpacity(0.04), blurRadius: 8, offset: (0, 2))` |
| Bottom Navigation | `BoxShadow(color: black.withOpacity(0.06), blurRadius: 12, offset: (0, -2))` |
| Модальное окно | `BoxShadow(color: black.withOpacity(0.1), blurRadius: 24, offset: (0, -4))` |
| Остальное | Без теней, разделение через `outline` цвет или пустое пространство |

### 2.6 Анимации

| Анимация | Длительность | Кривая |
|---|---|---|
| Переходы между экранами | `300ms` | `Curves.easeInOut` |
| Появление карточек (stagger) | `200ms` per item | `Curves.easeOut` |
| Кнопка «В корзину» → счётчик | `250ms` | `Curves.easeInOut` |
| Сердечко (избранное) | `200ms` scale bounce | `Curves.elasticOut` |
| Bottom sheet | `350ms` | `Curves.easeOutCubic` |
| Баннер авто-прокрутка | `4000ms` интервал, `600ms` переход | `Curves.easeInOut` |

---

## 3. Архитектура проекта

### 3.1 Структура папок

```
lib/
├── main.dart
├── app.dart                          # MaterialApp + GoRouter + Theme
│
├── core/
│   ├── constants/
│   │   ├── app_constants.dart        # API URL, ключи, таймауты
│   │   └── storage_keys.dart         # Ключи SharedPreferences
│   │
│   ├── di/
│   │   ├── injection.dart            # configureDependencies()
│   │   └── modules/
│   │       ├── network_module.dart   # Dio, interceptors
│   │       └── storage_module.dart   # SharedPreferences
│   │
│   ├── network/
│   │   ├── api_client.dart           # Dio wrapper
│   │   ├── api_endpoints.dart        # Все endpoint'ы
│   │   ├── interceptors/
│   │   │   ├── language_interceptor.dart
│   │   │   └── error_interceptor.dart
│   │   └── models/
│   │       ├── api_response.dart     # Обёртка ответа {data, message, status}
│   │       └── api_error.dart        # Модель ошибки
│   │
│   ├── router/
│   │   ├── app_router.dart           # GoRouter configuration
│   │   └── route_names.dart          # Константы имён маршрутов
│   │
│   ├── theme/
│   │   ├── app_theme.dart            # ThemeData для light/dark
│   │   ├── app_colors.dart           # Цветовые токены
│   │   ├── app_text_styles.dart      # Стили текста
│   │   └── theme_notifier.dart       # ChangeNotifier для переключения темы
│   │
│   ├── localization/
│   │   ├── app_localizations.dart    # Класс локализации
│   │   ├── locale_notifier.dart      # ChangeNotifier для смены языка
│   │   └── l10n/
│   │       ├── app_ru.dart           # Русские строки
│   │       └── app_tm.dart           # Туркменские строки
│   │
│   ├── utils/
│   │   ├── formatters.dart           # Форматирование цен, дат
│   │   ├── validators.dart           # Валидация форм
│   │   └── debouncer.dart            # Debounce для поиска
│   │
│   └── widgets/
│       ├── app_scaffold.dart         # Базовый Scaffold с bottom nav
│       ├── product_card.dart         # Переиспользуемая карточка товара
│       ├── empty_state.dart          # Виджет пустого состояния
│       ├── loading_indicator.dart    # Минималистичный индикатор загрузки
│       ├── search_bar.dart           # Строка поиска
│       ├── cached_image.dart         # Обёртка CachedNetworkImage
│       └── quantity_selector.dart    # Виджет +/- количество
│
├── features/
│   ├── home/
│   │   ├── data/
│   │   │   ├── home_repository.dart
│   │   │   └── models/
│   │   │       ├── banner_model.dart
│   │   │       └── home_section_model.dart
│   │   ├── logic/
│   │   │   └── home_notifier.dart
│   │   └── presentation/
│   │       ├── home_screen.dart
│   │       └── widgets/
│   │           ├── banner_carousel.dart
│   │           ├── brand_strip.dart
│   │           ├── category_chips.dart
│   │           └── product_section.dart
│   │
│   ├── catalog/
│   │   ├── data/
│   │   │   ├── catalog_repository.dart
│   │   │   └── models/
│   │   │       ├── category_model.dart
│   │   │       ├── subcategory_model.dart
│   │   │       └── brand_model.dart
│   │   ├── logic/
│   │   │   ├── categories_notifier.dart
│   │   │   └── brands_notifier.dart
│   │   └── presentation/
│   │       ├── catalog_screen.dart         # TabBar: Категории | Бренды
│   │       └── widgets/
│   │           ├── category_list_tile.dart
│   │           ├── subcategory_list.dart
│   │           └── brand_grid.dart
│   │
│   ├── product/
│   │   ├── data/
│   │   │   ├── product_repository.dart
│   │   │   └── models/
│   │   │       └── product_model.dart
│   │   ├── logic/
│   │   │   └── product_list_notifier.dart
│   │   └── presentation/
│   │       ├── product_list_screen.dart    # Список товаров категории / бренда
│   │       ├── product_detail_screen.dart  # Детальная страница товара
│   │       └── widgets/
│   │           ├── product_image_viewer.dart
│   │           ├── product_info_section.dart
│   │           ├── sort_chips.dart
│   │           └── related_products.dart
│   │
│   ├── cart/
│   │   ├── data/
│   │   │   ├── cart_repository.dart        # Локальное хранилище корзины
│   │   │   └── models/
│   │   │       └── cart_item_model.dart
│   │   ├── logic/
│   │   │   └── cart_notifier.dart          # Глобальный ChangeNotifier
│   │   └── presentation/
│   │       ├── cart_screen.dart
│   │       └── widgets/
│   │           ├── cart_item_tile.dart
│   │           ├── cart_summary_bar.dart
│   │           └── empty_cart.dart
│   │
│   ├── order/
│   │   ├── data/
│   │   │   ├── order_repository.dart
│   │   │   └── models/
│   │   │       ├── order_model.dart
│   │   │       ├── delivery_zone_model.dart
│   │   │       └── time_slot_model.dart
│   │   ├── logic/
│   │   │   ├── checkout_notifier.dart
│   │   │   └── order_history_notifier.dart
│   │   └── presentation/
│   │       ├── checkout_screen.dart
│   │       ├── order_history_screen.dart
│   │       └── widgets/
│   │           ├── delivery_type_toggle.dart
│   │           ├── date_selector.dart
│   │           ├── time_slot_selector.dart
│   │           ├── delivery_zone_picker.dart
│   │           ├── order_form.dart
│   │           ├── order_summary.dart
│   │           └── order_status_chips.dart
│   │
│   ├── favorites/
│   │   ├── data/
│   │   │   └── favorites_repository.dart   # Локальное хранилище
│   │   ├── logic/
│   │   │   └── favorites_notifier.dart     # Глобальный ChangeNotifier
│   │   └── presentation/
│   │       ├── favorites_screen.dart
│   │       └── widgets/
│   │           └── empty_favorites.dart
│   │
│   ├── profile/
│   │   ├── logic/
│   │   │   └── profile_notifier.dart
│   │   └── presentation/
│   │       ├── profile_screen.dart
│   │       └── widgets/
│   │           ├── profile_menu_tile.dart
│   │           ├── theme_selector.dart
│   │           └── language_selector.dart
│   │
│   └── search/
│       ├── data/
│       │   └── search_repository.dart
│       ├── logic/
│       │   └── search_notifier.dart
│       └── presentation/
│           ├── search_screen.dart
│           └── widgets/
│               └── search_result_tile.dart
```

### 3.2 Dependency Injection (get_it)

```dart
// core/di/injection.dart
import 'package:get_it/get_it.dart';

final getIt = GetIt.instance;

Future<void> configureDependencies() async {
  // ── Core ──
  getIt.registerLazySingleton<Dio>(() => createDio());
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<Dio>()));
  getIt.registerLazySingleton<SharedPreferences>(() => _sharedPrefs);

  // ── Notifiers (глобальные) ──
  getIt.registerLazySingleton<ThemeNotifier>(
    () => ThemeNotifier(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<LocaleNotifier>(
    () => LocaleNotifier(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<CartNotifier>(
    () => CartNotifier(getIt<CartRepository>()),
  );
  getIt.registerLazySingleton<FavoritesNotifier>(
    () => FavoritesNotifier(getIt<FavoritesRepository>()),
  );

  // ── Repositories ──
  getIt.registerLazySingleton<HomeRepository>(
    () => HomeRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<CatalogRepository>(
    () => CatalogRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<ProductRepository>(
    () => ProductRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<CartRepository>(
    () => CartRepository(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<FavoritesRepository>(
    () => FavoritesRepository(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<OrderRepository>(
    () => OrderRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<SearchRepository>(
    () => SearchRepository(getIt<ApiClient>()),
  );

  // ── Feature Notifiers (factory — создаются по запросу) ──
  getIt.registerFactory<HomeNotifier>(
    () => HomeNotifier(getIt<HomeRepository>()),
  );
  getIt.registerFactory<CategoriesNotifier>(
    () => CategoriesNotifier(getIt<CatalogRepository>()),
  );
  getIt.registerFactory<BrandsNotifier>(
    () => BrandsNotifier(getIt<CatalogRepository>()),
  );
  getIt.registerFactory<ProductListNotifier>(
    () => ProductListNotifier(getIt<ProductRepository>()),
  );
  getIt.registerFactory<CheckoutNotifier>(
    () => CheckoutNotifier(getIt<OrderRepository>()),
  );
  getIt.registerFactory<OrderHistoryNotifier>(
    () => OrderHistoryNotifier(getIt<OrderRepository>()),
  );
  getIt.registerFactory<SearchNotifier>(
    () => SearchNotifier(getIt<SearchRepository>()),
  );
}
```

### 3.3 State Management Pattern

Два уровня управления состоянием:

#### Глобальное состояние — `ChangeNotifier` (singleton через get_it)

```dart
// Тема, Язык, Корзина, Избранное — живут всё время работы приложения
class CartNotifier extends ChangeNotifier {
  final CartRepository _repository;
  List<CartItem> _items = [];

  List<CartItem> get items => _items;
  double get totalPrice => _items.fold(0, (sum, item) => sum + item.totalPrice);
  int get totalCount => _items.fold(0, (sum, item) => sum + item.quantity);

  Future<void> addToCart(Product product) async { ... notifyListeners(); }
  Future<void> removeFromCart(int productId) async { ... notifyListeners(); }
  Future<void> updateQuantity(int productId, int qty) async { ... notifyListeners(); }
  Future<void> clearCart() async { ... notifyListeners(); }
}
```

#### Локальное / микро-состояние — `ValueNotifier`

```dart
// Используется для простых UI-состояний внутри виджетов
final selectedTabIndex = ValueNotifier<int>(0);
final isExpanded = ValueNotifier<bool>(false);
final searchQuery = ValueNotifier<String>('');
final selectedTimeSlot = ValueNotifier<TimeSlot?>(null);
final selectedDate = ValueNotifier<DateTime>(DateTime.now());
```

#### Использование в виджетах

```dart
// ChangeNotifier — через ListenableBuilder
ListenableBuilder(
  listenable: getIt<CartNotifier>(),
  builder: (context, _) {
    final cart = getIt<CartNotifier>();
    return Text('${cart.totalCount} товаров');
  },
);

// ValueNotifier — через ValueListenableBuilder
ValueListenableBuilder<int>(
  valueListenable: selectedTabIndex,
  builder: (context, index, _) {
    return TabContent(index: index);
  },
);
```

---

## 4. Навигация (GoRouter)

### 4.1 Маршруты

```dart
// core/router/app_router.dart
final goRouter = GoRouter(
  initialLocation: '/home',
  navigatorKey: _rootNavigatorKey,
  routes: [
    // ── Shell Route (Bottom Navigation) ──
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return AppScaffold(navigationShell: navigationShell);
      },
      branches: [
        // Tab 1 — Главная
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/home',
              name: 'home',
              builder: (context, state) => const HomeScreen(),
            ),
          ],
        ),

        // Tab 2 — Категории & Бренды
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/catalog',
              name: 'catalog',
              builder: (context, state) => const CatalogScreen(),
            ),
          ],
        ),

        // Tab 3 — Корзина
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/cart',
              name: 'cart',
              builder: (context, state) => const CartScreen(),
            ),
          ],
        ),

        // Tab 4 — Избранное
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/favorites',
              name: 'favorites',
              builder: (context, state) => const FavoritesScreen(),
            ),
          ],
        ),

        // Tab 5 — Профиль
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/profile',
              name: 'profile',
              builder: (context, state) => const ProfileScreen(),
              routes: [
                GoRoute(
                  path: 'orders',
                  name: 'order-history',
                  builder: (context, state) => const OrderHistoryScreen(),
                ),
              ],
            ),
          ],
        ),
      ],
    ),

    // ── Полноэкранные маршруты (поверх shell) ──
    GoRoute(
      parentNavigatorKey: _rootNavigatorKey,
      path: '/product/:id',
      name: 'product-detail',
      builder: (context, state) => ProductDetailScreen(
        productId: int.parse(state.pathParameters['id']!),
      ),
    ),
    GoRoute(
      parentNavigatorKey: _rootNavigatorKey,
      path: '/products',
      name: 'product-list',
      builder: (context, state) {
        final extra = state.extra as ProductListArgs;
        return ProductListScreen(args: extra);
      },
    ),
    GoRoute(
      parentNavigatorKey: _rootNavigatorKey,
      path: '/checkout',
      name: 'checkout',
      builder: (context, state) => const CheckoutScreen(),
    ),
    GoRoute(
      parentNavigatorKey: _rootNavigatorKey,
      path: '/search',
      name: 'search',
      builder: (context, state) => const SearchScreen(),
    ),
  ],
);
```

### 4.2 Карта навигации

```
┌─────────────────────────────────────────────────────────────┐
│                     StatefulShellRoute                       │
│  ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Home │ │ Catalog  │ │  Cart  │ │Favorites │ │ Profile │ │
│  │  /   │ │          │ │        │ │          │ │         │ │
│  └──┬───┘ └────┬─────┘ └───┬────┘ └──────────┘ └────┬────┘ │
│     │          │            │                        │      │
└─────┼──────────┼────────────┼────────────────────────┼──────┘
      │          │            │                        │
      ▼          ▼            ▼                        ▼
  /product/:id  /products   /checkout           /profile/orders
  /search       /product/:id                    
```

---

## 5. Экраны приложения

### 5.1 Bottom Navigation Bar

```
┌─────────────────────────────────────────────┐
│  🏠        📂        🛒       ♡      👤     │
│ Главная  Каталог   Корзина  Избранное Профиль│
└─────────────────────────────────────────────┘
```

**Дизайн:**
- Фон: `background` цвет
- Разделитель сверху: тонкая линия `1px` цвета `outline`
- Иконки: Lucide, `24px`, неактивные — `secondary`, активные — `primary`
- Текст: `labelSmall`, неактивный — `secondary`, активный — `primary`
- Активный таб: только смена цвета (без подложки, без индикатора — чистый минимализм)
- На иконке корзины — бейдж с количеством товаров (маленький чёрный кружок с белым текстом)

---

### 5.2 Tab 1 — Главная (HomeScreen)

Основная страница магазина с баннерами, брендами и секциями товаров.

```
┌─────────────────────────────────────────┐
│ [🔍 Поиск...          ]  [☀] [📞] [RU] │  ← AppBar area
├─────────────────────────────────────────┤
│ [Новинки] [Мыло и гели] [Влажные салф.] │  ← Category chips (horizontal scroll)
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │         BANNER CAROUSEL             │ │  ← Auto-scroll, page indicator dots
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│            ● ○ ○ ○ ○ ○ ○               │
├─────────────────────────────────────────┤
│ [ARIEL] [elin.him] [L'Oréal] [911+] →  │  ← Brands horizontal scroll
├─────────────────────────────────────────┤
│ Новинки                            →    │  ← Section header + "See all"
│ ┌────────────┐  ┌────────────┐          │
│ │   [image]  │  │   [image]  │          │
│ │      ♡     │  │      ♡     │          │  ← Product grid 2 columns
│ │   Brand    │  │   Brand    │          │
│ │ Description│  │ Description│          │
│ │ 85,00 m.   │  │ 23,00 m.   │          │
│ │[В корзину] │  │[В корзину] │          │
│ └────────────┘  └────────────┘          │
├─────────────────────────────────────────┤
│ Скидки                             →    │
│ ┌────────────┐  ┌────────────┐          │
│ │ -17% badge │  │   [image]  │          │
│ │   [image]  │  │      ♡     │          │
│ │   Brand    │  │   Brand    │          │
│ │ 85,00  103 │  │ 12,00 m.   │          │
│ │[В корзину] │  │[В корзину] │          │
│ └────────────┘  └────────────┘          │
└─────────────────────────────────────────┘
```

#### Элементы:

**Search Bar (верхняя панель)**
- Поле поиска: `surface` фон, `outline` граница, `secondary` placeholder, `12px` radius, иконка лупы слева
- Справа: кнопка темы (солнце/луна `24px`), телефон (`24px`), языковой переключатель (текст `RU`/`TM` в чёрной/белой капсуле)
- При нажатии на поиск → навигация на `/search`

**Category Chips (горизонтальная прокрутка)**
- Pill-shape chips: `surfaceVariant` фон, `onBackground` текст
- Выбранный: `primary` фон, `onPrimary` текст
- Высота `36px`, горизонтальный padding `16px`, gap между чипсами `8px`
- При нажатии → переход на `/products` с фильтром категории

**Banner Carousel**
- Полная ширина экрана, высота `200px`, скругление `0` (edge-to-edge)
- Автопрокрутка каждые `4 секунды`
- Page indicator: маленькие точки `6px`, активная — `primary`, неактивные — `outline`
- Виджет: `PageView.builder` + `Timer.periodic`

**Brands Strip (горизонтальная прокрутка)**
- Карточки брендов: `80x80px`, `surface` фон, `16px` radius, `outline` граница
- Логотип бренда по центру
- Gap `12px`
- При нажатии → `/products` с фильтром бренда

**Product Sections (Новинки, Скидки)**
- Header: название секции (`headlineMedium`) + стрелка → (переход к полному списку)
- Сетка `2 колонки`, gap `12px`
- Показываем первые `4-6 товаров`, далее кнопка "Показать все"

**Product Card (переиспользуемый)**
```
┌─────────────────────┐
│              ♡       │  ← Favorite button (top-right)
│                      │
│      [Product        │
│       Image]         │  ← Image: aspect ratio 1:1, radius 12px
│                      │
│  -17%                │  ← Discount badge (if applicable)
├─────────────────────┤
│  Brand Name          │  ← titleLarge, bold, centered
│  Product description │  ← bodyMedium, secondary color, centered, max 2 lines
│                      │
│  85,00 m.  ̶1̶0̶3̶,̶0̶0̶   │  ← Price: primary bold + old price strikethrough
│                      │
│  ┌─────────────────┐ │
│  │   В корзину     │ │  ← Outline button, primary border
│  └─────────────────┘ │
│          OR           │
│  [−]    2 шт    [+]  │  ← Quantity selector (when in cart)
└─────────────────────┘
```

Элементы карточки:
- Фон: `surface`
- Граница: `outline`, `1px`
- Изображение: `CachedNetworkImage`, placeholder — серый шиммер
- Кнопка ♡: `28px`, без фона, обводка — `secondary`; если в избранном — залита `error` (красный)
- Бейдж скидки: `error` фон, белый текст, `8px` radius, позиция bottom-left на изображении
- Кнопка "В корзину": `OutlinedButton`, `primary` граница, `primary` текст
- Количество: `[−]` и `[+]` — квадратные кнопки `36x36` с `primary` фоном и `onPrimary` иконкой; текст количества посередине

---

### 5.3 Tab 2 — Каталог (CatalogScreen)

Экран с двумя табами: Категории и Бренды.

```
┌─────────────────────────────────────────┐
│      [Категории]     |    [Бренды]      │  ← TabBar
├─────────────────────────────────────────┤
│                                         │
│  CATEGORIES TAB:                        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [img] Новинки                       │ │  ← Simple list tile
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [img] Скидки                        │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [img] Косметические средства  → ∨   │ │  ← Expandable with → and ∨
│ ├─────────────────────────────────────┤ │
│ │   [img] для лица                    │ │  ← Subcategories (expanded)
│ │   [img] для глаз                    │ │
│ │   [img] для губ                     │ │
│ │   [img] для тела                    │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [img] Уход за лицом           → ∨   │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### Категории (Categories Tab)

**TabBar:**
- Два таба с иконками: 📦 Категории, 📋 Бренды
- Стиль: underline indicator `primary` цвет, `2px` толщина
- Неактивный таб: `secondary` текст; активный: `primary` текст

**Category List Tile:**
- Высота: `72px`
- Thumbnail: `56x56px`, `8px` radius
- Название: `bodyLarge`, `onBackground`
- Если есть подкатегории: справа кнопка `→` (прямой переход к списку товаров) и `∨`/`∧` (раскрыть/свернуть подкатегории)
- Если нет подкатегорий: тап на весь тайл → `/products`
- Разделитель: `Divider`, `outline` цвет

**Subcategory (раскрытый список):**
- Отступ слева `16px`
- Фон чуть другой: `surfaceVariant`
- Thumbnail: `48x48px`
- При тапе → `/products` с фильтром подкатегории

**Анимация раскрытия:**
- `AnimatedCrossFade` или `AnimatedSize` для плавного раскрытия
- Chevron `∨` → `∧` с `AnimatedRotation`

#### Бренды (Brands Tab)

```
┌─────────────────────────────────────────┐
│      [Категории]     |    [Бренды]      │
├─────────────────────────────────────────┤
│ [🔍 Поиск бренда...                  ] │  ← Search field
├─────────────────────────────────────────┤
│ ┌──────┐  ┌──────┐  ┌──────┐           │
│ │      │  │      │  │      │           │
│ │ARIEL │  │elin  │  │L'Oréal│          │  ← Grid 3 columns
│ │      │  │.him  │  │      │           │
│ │      │  │      │  │      │           │
│ │Ariel │  │elin  │  │L'Oréal│          │
│ └──────┘  └──────┘  └──────┘           │
│ ┌──────┐  ┌──────┐  ┌──────┐           │
│ │ 911+ │  │ ABC  │  │ACORD │           │
│ └──────┘  └──────┘  └──────┘           │
└─────────────────────────────────────────┘
```

**Brand Grid:**
- Сетка: `3 колонки`, `crossAxisSpacing: 12`, `mainAxisSpacing: 12`
- Карточка: `surface` фон, `outline` граница, `16px` radius
- Логотип: `CachedNetworkImage`, по центру, `fit: BoxFit.contain`
- Название бренда: `bodyMedium`, `onSurface`, по центру, под логотипом
- При нажатии → `/products` с фильтром бренда

**Search (поиск по брендам):**
- Фильтрация локально из загруженного списка
- `ValueNotifier<String>` для query
- `Debouncer` на 300ms

---

### 5.4 Tab 3 — Корзина (CartScreen)

```
┌─────────────────────────────────────────┐
│  Корзина                          🗑    │  ← Title + Clear all button
├─────────────────────────────────────────┤
│                                         │
│  EMPTY STATE (if cart is empty):        │
│                                         │
│            🛒 (large icon)              │
│                                         │
│     Ваша корзина пуста                  │
│   Добавьте товары в корзину             │
│     чтобы сделать заказ                 │
│                                         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                         │
│  WITH ITEMS:                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [img]  Brand name              ✕    │ │  ← Cart item tile
│ │        Product description          │ │
│ │        [−]  2 шт  [+]    24,00 m.  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [img]  Brand name              ✕    │ │
│ │        Product description          │ │
│ │        [−]  1 шт  [+]    12,00 m.  │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  36,00 m.        [█ Оформить заказ █]   │  ← Bottom bar (sticky)
│                                         │
└─────────────────────────────────────────┘
```

**Cart Item Tile:**
- Фон: `surface`, `16px` radius, `outline` граница
- Изображение: `80x80px`, `8px` radius, слева
- Справа от изображения:
  - Brand name: `titleMedium`, bold
  - Description: `bodySmall`, `secondary`, max 2 lines
  - Quantity selector: `[−]  N шт  [+]` — `primary` квадратные кнопки
  - Цена: `titleMedium`, `primary`, bold, справа
- Кнопка ✕: `24px`, `secondary` цвет, удаляет из корзины (с confirmation)

**Bottom Summary Bar:**
- Фиксированная внизу, поверх bottom nav
- Фон: `background` + верхняя граница `outline`
- Слева: общая сумма — `headlineMedium`, `primary`, bold
- Справа: кнопка "Оформить заказ" — `FilledButton`, `primary` фон, `onPrimary` текст, `12px` radius
- При нажатии → `/checkout`

**Empty State:**
- Иконка корзины: `80px`, тонкая обводка, `secondary` цвет
- Заголовок: `titleLarge`, `onBackground`
- Подпись: `bodyMedium`, `secondary`
- Центрирование по вертикали

**Clear All (🗑):**
- Иконка в AppBar справа
- При нажатии: диалог подтверждения
- Минималистичный AlertDialog с двумя кнопками

---

### 5.5 Tab 4 — Избранное (FavoritesScreen)

```
┌─────────────────────────────────────────┐
│  Избранное                              │
├─────────────────────────────────────────┤
│                                         │
│  EMPTY STATE:                           │
│                                         │
│            ♡ (large icon)               │
│                                         │
│   Ваш список избранных товаров пуст    │
│    Добавьте товары в список избранных   │
│     чтобы сохранить их на устройстве    │
│                                         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                         │
│  WITH ITEMS:                            │
│                                         │
│ ┌────────────┐  ┌────────────┐          │
│ │      ♥     │  │      ♥     │          │
│ │   [image]  │  │   [image]  │          │
│ │   Brand    │  │   Brand    │          │  ← Same product cards as Home
│ │ Description│  │ Description│          │
│ │ 12,00 m.   │  │ 56,80 m.   │          │
│ │ [−] 2шт[+]│  │[В корзину] │          │
│ └────────────┘  └────────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

**Хранение:** Локальное (`SharedPreferences` / Hive). Список `product_id` + полные данные товара для оффлайн-отображения.

**Поведение:**
- Сердечко на карточке — заполненное красным (`error`)
- Тап на ♥ → удаление из избранного (с анимацией исчезновения)
- Карточки идентичны карточкам на Home, та же сетка `2 колонки`
- Тап на карточку → `/product/:id`

---

### 5.6 Tab 5 — Профиль (ProfileScreen)

```
┌─────────────────────────────────────────┐
│  Профиль                                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ☀  Тема оформления          [▸]   ││  ← Theme selector
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  🌐 Язык / Dil               [RU▸] ││  ← Language selector
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📋 История заказов           [▸]   ││  ← Order history
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  📞 Связаться с нами          [▸]   ││  ← Contact (phone call)
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  ℹ  О приложении              [▸]   ││  ← About
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│           v1.0.0                        │  ← App version
│                                         │
└─────────────────────────────────────────┘
```

**Profile Menu Tile:**
- Высота: `60px`
- Иконка слева: `24px`, `onBackground`
- Текст: `bodyLarge`, `onBackground`
- Chevron / value справа: `secondary`
- Разделитель: `Divider`, `outline` цвет
- Фон: `surface`

**Theme Selector (при тапе → Bottom Sheet):**
```
┌─────────────────────────────────────────┐
│  Тема оформления                        │
├─────────────────────────────────────────┤
│  ○  Светлая                             │
│  ●  Тёмная                              │
│  ○  Системная                           │
└─────────────────────────────────────────┘
```
- `ThemeMode.light`, `ThemeMode.dark`, `ThemeMode.system`
- Radio-кнопки с `primary` акцентом
- Сохранение в `SharedPreferences`
- Мгновенное применение через `ThemeNotifier`

**Language Selector (при тапе → Bottom Sheet):**
```
┌─────────────────────────────────────────┐
│  Выберите язык                          │
├─────────────────────────────────────────┤
│  ● Русский                              │
│  ○ Türkmen                              │
└─────────────────────────────────────────┘
```
- Два варианта: `ru`, `tm`
- Сохранение в `SharedPreferences`
- Применение через `LocaleNotifier` → перезагрузка строк + пересброс API-запросов с новым языком

**История заказов → `/profile/orders`** (подробности в секции 5.8)

---

### 5.7 Checkout (CheckoutScreen) — Полноэкранный

```
┌─────────────────────────────────────────┐
│  ←  Заказ - доставка                    │  ← AppBar with back
├─────────────────────────────────────────┤
│                                         │
│  Вид заказа                             │
│  ┌──────────────┬──────────────┐        │
│  │ 🚗 Доставка  │ 🚶 Самовывоз │        │  ← Toggle tabs
│  └──────────────┴──────────────┘        │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │24.02.26│ │25.02.26│ │26.02.26│       │  ← Date selector (horizontal scroll)
│  └────────┘ └────────┘ └────────┘       │
│                                         │
│  ┌──────────────┐ ┌──────────────┐      │
│  │● 14:00-16:00 │ │○ 16:00-18:00 │      │  ← Time slot grid
│  └──────────────┘ └──────────────┘      │
│  ┌──────────────┐ ┌──────────────┐      │
│  │○ 18:00-20:00 │ │○ 20:00-22:00 │      │
│  └──────────────┘ └──────────────┘      │
│                                         │
│  Заполните поля                         │
│  ┌─────────────────────────────────┐    │
│  │ Полное Имя                      │    │  ← Text fields with validation
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Номер телефона                  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Адрес                           │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Заметка                         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Сумма корзины:            24,00 m.     │
│  Стоимость доставки:       20,00 m.     │
├─────────────────────────────────────────┤
│  44,00 m.         [████ Заказать ████]  │  ← Sticky bottom
└─────────────────────────────────────────┘
```

#### Элементы:

**Delivery/Pickup Toggle:**
- Два сегмента с иконками
- Активный: `primary` фон, `onPrimary` текст
- Неактивный: `surface` фон, `secondary` текст
- `16px` radius

**Date Selector:**
- Горизонтальный скролл чипов с датами (следующие 3 дня)
- Формат: `DD.MM.YYYY`
- Активный: `primary` фон; неактивный: `surfaceVariant` фон

**Time Slot Grid:**
- Сетка `2 колонки`
- Каждый слот: radio-chip `48px` высота
- Активный: `primary` граница + `primary` circle; неактивный: `outline` граница
- `ValueNotifier<TimeSlot?>` для выбранного слота

**Delivery Zone Picker:**
- При тапе на "Адрес" или отдельная кнопка "Выбрать район доставки"
- Открывается `showModalBottomSheet` с ListView зон
- Каждая зона: название + стоимость доставки
- При выборе → стоимость доставки обновляется в итоге

**Form Fields:**
- `TextFormField` с `OutlineInputBorder`
- Граница: `outline`; при фокусе: `primary`
- Ошибка: `error` цвет текста и границы
- Валидация: Имя (не пусто), Телефон (формат), Адрес (не пусто)
- Заметка — опционально

**Order Summary:**
- Сумма корзины + стоимость доставки
- `bodyLarge` текст, `titleMedium` значения
- Итого — `headlineMedium`, bold, `primary`

**Кнопка "Заказать":**
- `FilledButton`, полная ширина в bottom bar
- При отправке: загрузка (CircularProgressIndicator внутри кнопки)
- После успеха: показ SnackBar + очистка корзины + навигация на Home

---

### 5.8 История заказов (OrderHistoryScreen)

```
┌─────────────────────────────────────────┐
│  ←  История заказов                     │
├─────────────────────────────────────────┤
│      [Доставка]     |   [Самовывоз]     │  ← TabBar
├─────────────────────────────────────────┤
│  Все - 5 шт.                            │
│ ┌─────────────────────────────────────┐ │
│ │[Все][Новые][Подтв.][Отпр.][Дост.]  │ │  ← Status filter chips (wrap)
│ │[Отменен]                            │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│                                         │
│  EMPTY:                                 │
│            🔍 (large icon)              │
│     По вашему запросу ничего            │
│          не найдено                     │
│                                         │
│  WITH ORDERS:                           │
│ ┌─────────────────────────────────────┐ │
│ │ Заказ #1234     24.02.2026          │ │
│ │ 3 товара         44,00 m.           │ │
│ │ Статус: Подтверждён       ●         │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Status Filter Chips:**
- `Wrap` widget с `ChoiceChip`
- Статусы: Все, Новые, Подтверждён, Отправлен, Доставлен, Отменен
- Активный: `primary` фон; неактивный: `surfaceVariant` фон
- `ValueNotifier<OrderStatus?>` для фильтра

**Order Card:**
- `surface` фон, `outline` граница, `16px` radius
- Номер заказа + дата
- Количество товаров + сумма
- Статус с цветным индикатором:
  - Новый → `secondary`
  - Подтверждён → `primary`
  - Отправлен → синий акцент
  - Доставлен → зелёный
  - Отменен → `error`

---

### 5.9 Список товаров (ProductListScreen) — Полноэкранный

```
┌─────────────────────────────────────────┐
│  ←  Ariel                               │  ← Brand/Category name
├─────────────────────────────────────────┤
│  Всего: 22 товар(ов)                   │
│  [Низкие цены]  [Высокие цены]          │  ← Sort chips
├─────────────────────────────────────────┤
│ ┌────────────┐  ┌────────────┐          │
│ │   [image]  │  │   [image]  │          │
│ │   Brand    │  │   Brand    │          │  ← Product grid 2 columns
│ │ Description│  │ Description│          │
│ │ 85,00 m.   │  │ 23,00 m.   │          │
│ │[В корзину] │  │[В корзину] │          │
│ └────────────┘  └────────────┘          │
│         ...scroll...                    │
└─────────────────────────────────────────┘
```

**Sort Chips:**
- Два чипа: "Низкие цены" (↑), "Высокие цены" (↓)
- Outline стиль, при выборе — `primary` фон
- `ValueNotifier<SortOrder>` — `asc` / `desc` / `none`

**Pagination:**
- Бесконечная прокрутка
- `ScrollController` → при достижении конца → `loadMore()`
- Loading indicator внизу списка

---

### 5.10 Детальная страница товара (ProductDetailScreen)

```
┌─────────────────────────────────────────┐
│  ←  GARNIER                             │  ← Brand name
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │         PRODUCT IMAGE               ││  ← Zoomable, swipeable
│  │         (large, centered)           ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  GARNIER                                │  ← Brand: headlineMedium, bold
│  Крем для лица Garnier Skin Naturals    │  ← Name: bodyLarge
│  BB Натурально-бежевый 50-мл            │
│                                         │
│  ┌─────────────┐                        │
│  │ В корзину   │   117,00 m.      ♡    │  ← Action row
│  └─────────────┘                        │
│                                         │
│  ─────────────────────────────────────  │
│  Штрих-код          3600541116634       │  ← Product details
│  Бренд              GARNIER             │
│  ─────────────────────────────────────  │
│                                         │
│  Другие товары                          │  ← Related products
│ ┌────────────┐  ┌────────────┐          │
│ │   [image]  │  │   [image]  │          │
│ │   Brand    │  │   Brand    │          │
│ │ 49,80 m.   │  │ 32,50 m.   │          │
│ │[В корзину] │  │[В корзину] │          │
│ └────────────┘  └────────────┘          │
└─────────────────────────────────────────┘
```

**Product Image:**
- `InteractiveViewer` для zoom
- `CachedNetworkImage`
- Фон: `surfaceVariant` (чтобы товар выделялся на любом фоне)
- Высота: `300px`, `fit: BoxFit.contain`

**Action Row:**
- Кнопка "В корзину" / quantity selector
- Цена: `headlineMedium`, bold, `primary`
- Сердечко: `36px`
- Горизонтальное расположение

**Product Details:**
- Пары ключ-значение, разделённые `Divider`
- Ключ: `bodyMedium`, `secondary`; Значение: `bodyMedium`, `onBackground`
- Бренд — кликабельный (→ `/products` фильтр по бренду)

**Related Products:**
- Горизонтальная прокрутка `ListView.builder`
- Те же `ProductCard`, но ширина `160px`

---

### 5.11 Поиск (SearchScreen)

```
┌─────────────────────────────────────────┐
│  ← [🔍 Поиск товаров...        ] [✕]  │  ← Auto-focus search field
├─────────────────────────────────────────┤
│                                         │
│  INITIAL STATE:                         │
│                                         │
│  Введите название товара                │
│  для поиска                             │
│                                         │
│  RESULTS:                               │
│ ┌────────────┐  ┌────────────┐          │
│ │ Product    │  │ Product    │          │  ← Same product grid
│ │ Cards      │  │ Cards      │          │
│ └────────────┘  └────────────┘          │
│                                         │
│  NO RESULTS:                            │
│                                         │
│  По вашему запросу ничего не найдено    │
│                                         │
└─────────────────────────────────────────┘
```

**Search Field:**
- Auto-focus при открытии
- `Debouncer` на `500ms`
- Clear button (✕) справа
- Результаты обновляются автоматически при вводе

---

## 6. Модели данных

### 6.1 Product

```dart
class Product {
  final int id;
  final String name;
  final String brandName;
  final String? description;
  final double price;
  final double? oldPrice;         // null если нет скидки
  final String imageUrl;
  final String? barcode;
  final int? categoryId;
  final int? brandId;
  final int? discountPercent;     // null или 0 если нет скидки

  double? get discountPercent => oldPrice != null
      ? ((oldPrice! - price) / oldPrice! * 100).round().toDouble()
      : null;
}
```

### 6.2 Category

```dart
class Category {
  final int id;
  final String name;
  final String? imageUrl;
  final List<SubCategory> subCategories;  // пустой если нет подкатегорий
  final bool hasSubCategories;
}

class SubCategory {
  final int id;
  final String name;
  final String? imageUrl;
  final int parentId;
}
```

### 6.3 Brand

```dart
class Brand {
  final int id;
  final String name;
  final String? logoUrl;
}
```

### 6.4 Banner

```dart
class Banner {
  final int id;
  final String imageUrl;
  final String? linkType;     // 'category', 'brand', 'product', 'url'
  final String? linkValue;    // id или URL
}
```

### 6.5 CartItem

```dart
class CartItem {
  final Product product;
  int quantity;

  double get totalPrice => product.price * quantity;
}
```

### 6.6 Order

```dart
class Order {
  final int id;
  final String orderNumber;
  final DateTime createdAt;
  final OrderType type;             // delivery, pickup
  final OrderStatus status;         // new, confirmed, shipped, delivered, cancelled
  final List<OrderItem> items;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String? fullName;
  final String? phone;
  final String? address;
  final String? note;
  final String? deliveryDate;
  final String? timeSlot;
}

enum OrderType { delivery, pickup }

enum OrderStatus { all, newOrder, confirmed, shipped, delivered, cancelled }

class OrderItem {
  final int productId;
  final String productName;
  final int quantity;
  final double price;
}
```

### 6.7 DeliveryZone

```dart
class DeliveryZone {
  final int id;
  final String name;
  final double deliveryPrice;
}
```

### 6.8 TimeSlot

```dart
class TimeSlot {
  final String id;
  final String startTime;     // "14:00"
  final String endTime;       // "16:00"
  final String label;         // "14:00 - 16:00"
}
```

---

## 7. API Endpoints

### 7.1 Базовый URL

```
BASE_URL = https://api.elinhim.com/api/v1
```

### 7.2 Endpoints

| Метод | Endpoint | Описание | Query Params |
|---|---|---|---|
| `GET` | `/home` | Данные главной страницы | `lang` |
| `GET` | `/banners` | Список баннеров | `lang` |
| `GET` | `/categories` | Список категорий | `lang` |
| `GET` | `/categories/{id}/subcategories` | Подкатегории | `lang` |
| `GET` | `/brands` | Список брендов | `lang`, `search` |
| `GET` | `/products` | Список товаров | `lang`, `category_id`, `subcategory_id`, `brand_id`, `sort`, `page`, `limit`, `search` |
| `GET` | `/products/{id}` | Детали товара | `lang` |
| `GET` | `/products/{id}/related` | Похожие товары | `lang`, `limit` |
| `GET` | `/delivery-zones` | Зоны доставки | `lang` |
| `GET` | `/time-slots` | Доступные слоты | `date` |
| `POST` | `/orders` | Создание заказа | — |
| `GET` | `/orders` | История заказов | `type`, `status`, `page`, `limit` |
| `GET` | `/orders/{id}` | Детали заказа | — |

### 7.3 Language Interceptor

```dart
class LanguageInterceptor extends Interceptor {
  final LocaleNotifier _localeNotifier;

  LanguageInterceptor(this._localeNotifier);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.queryParameters['lang'] = _localeNotifier.locale.languageCode;
    handler.next(options);
  }
}
```

### 7.4 Error Interceptor

```dart
class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final apiError = ApiError.fromDioException(err);
    handler.reject(DioException(
      requestOptions: err.requestOptions,
      error: apiError,
    ));
  }
}
```

---

## 8. Локальное хранилище

### 8.1 SharedPreferences Keys

```dart
abstract class StorageKeys {
  static const themeMode = 'theme_mode';          // 'light' | 'dark' | 'system'
  static const locale = 'locale';                  // 'ru' | 'tm'
  static const cartItems = 'cart_items';           // JSON string
  static const favorites = 'favorite_products';    // JSON string
  static const lastOrderForm = 'last_order_form';  // Cached form data
}
```

### 8.2 Корзина (CartRepository)

```dart
class CartRepository {
  final SharedPreferences _prefs;

  List<CartItem> getCart() {
    final json = _prefs.getString(StorageKeys.cartItems);
    if (json == null) return [];
    return (jsonDecode(json) as List).map((e) => CartItem.fromJson(e)).toList();
  }

  Future<void> saveCart(List<CartItem> items) async {
    await _prefs.setString(StorageKeys.cartItems, jsonEncode(items));
  }
}
```

### 8.3 Избранное (FavoritesRepository)

```dart
class FavoritesRepository {
  final SharedPreferences _prefs;

  List<Product> getFavorites() { ... }
  Future<void> addFavorite(Product product) async { ... }
  Future<void> removeFavorite(int productId) async { ... }
  bool isFavorite(int productId) { ... }
}
```

---

## 9. Тема (Theme)

### 9.1 ThemeNotifier

```dart
class ThemeNotifier extends ChangeNotifier {
  final SharedPreferences _prefs;
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  ThemeNotifier(this._prefs) {
    _loadTheme();
  }

  void _loadTheme() {
    final value = _prefs.getString(StorageKeys.themeMode) ?? 'system';
    _themeMode = ThemeMode.values.firstWhere(
      (e) => e.name == value,
      orElse: () => ThemeMode.system,
    );
  }

  Future<void> setTheme(ThemeMode mode) async {
    _themeMode = mode;
    await _prefs.setString(StorageKeys.themeMode, mode.name);
    notifyListeners();
  }
}
```

### 9.2 AppTheme

```dart
class AppTheme {
  // ── LIGHT ──
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: Colors.white,
    colorScheme: const ColorScheme.light(
      primary: Color(0xFF000000),
      onPrimary: Color(0xFFFFFFFF),
      surface: Color(0xFFF5F5F5),
      onSurface: Color(0xFF1A1A1A),
      surfaceContainerHighest: Color(0xFFEEEEEE),
      outline: Color(0xFFE0E0E0),
      error: Color(0xFFD32F2F),
    ),
    textTheme: _textTheme(Colors.black),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
      elevation: 0,
      scrolledUnderElevation: 0,
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Colors.white,
      selectedItemColor: Colors.black,
      unselectedItemColor: Color(0xFF666666),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFFF5F5F5),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE0E0E0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.black, width: 1.5),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.black,
        side: const BorderSide(color: Colors.black),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
      ),
    ),
  );

  // ── DARK ──
  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF0A0A0A),
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFFFFFFFF),
      onPrimary: Color(0xFF000000),
      surface: Color(0xFF1A1A1A),
      onSurface: Color(0xFFE0E0E0),
      surfaceContainerHighest: Color(0xFF2A2A2A),
      outline: Color(0xFF333333),
      error: Color(0xFFEF5350),
    ),
    textTheme: _textTheme(Colors.white),
    // ... аналогично light, но инвертированные цвета
  );
}
```

---

## 10. Локализация

### 10.1 LocaleNotifier

```dart
class LocaleNotifier extends ChangeNotifier {
  final SharedPreferences _prefs;
  Locale _locale = const Locale('ru');

  Locale get locale => _locale;

  LocaleNotifier(this._prefs) {
    final code = _prefs.getString(StorageKeys.locale) ?? 'ru';
    _locale = Locale(code);
  }

  Future<void> setLocale(Locale locale) async {
    _locale = locale;
    await _prefs.setString(StorageKeys.locale, locale.languageCode);
    notifyListeners();
  }
}
```

### 10.2 Структура строк

```dart
// core/localization/l10n/app_ru.dart
const Map<String, String> ru = {
  // ── Bottom Navigation ──
  'nav_home': 'Главная',
  'nav_catalog': 'Каталог',
  'nav_cart': 'Корзина',
  'nav_favorites': 'Избранное',
  'nav_profile': 'Профиль',

  // ── Home ──
  'search_hint': 'Поиск',
  'new_arrivals': 'Новинки',
  'discounts': 'Скидки',
  'see_all': 'Смотреть все',
  'add_to_cart': 'В корзину',

  // ── Catalog ──
  'categories': 'Категории',
  'brands': 'Бренды',
  'search_brand': 'Поиск бренда...',

  // ── Cart ──
  'cart_title': 'Корзина',
  'cart_empty_title': 'Ваша корзина пуста',
  'cart_empty_subtitle': 'Добавьте товары в корзину\nчтобы сделать заказ',
  'checkout': 'Оформить заказ',
  'clear_cart': 'Очистить корзину',
  'clear_cart_confirm': 'Вы уверены, что хотите очистить корзину?',

  // ── Favorites ──
  'favorites_title': 'Избранное',
  'favorites_empty_title': 'Ваш список избранных товаров пуст',
  'favorites_empty_subtitle': 'Добавьте товары в список избранных\nчтобы сохранить их на устройстве',

  // ── Order ──
  'order_delivery': 'Заказ - доставка',
  'order_type': 'Вид заказа',
  'delivery': 'Доставка',
  'pickup': 'Самовывоз',
  'fill_fields': 'Заполните поля',
  'full_name': 'Полное Имя',
  'phone': 'Номер телефона',
  'address': 'Адрес',
  'note': 'Заметка',
  'cart_subtotal': 'Сумма корзины:',
  'delivery_fee': 'Стоимость доставки:',
  'place_order': 'Заказать',
  'order_success': 'Заказ успешно оформлен!',

  // ── Order History ──
  'order_history': 'История заказов',
  'all': 'Все',
  'status_new': 'Новые',
  'status_confirmed': 'Подтверждён',
  'status_shipped': 'Отправлен',
  'status_delivered': 'Доставлен',
  'status_cancelled': 'Отменен',
  'no_results': 'По вашему запросу ничего\nне найдено',

  // ── Product ──
  'total_products': 'Всего:',
  'products_count': 'товар(ов)',
  'low_price': 'Низкие цены',
  'high_price': 'Высокие цены',
  'barcode': 'Штрих-код',
  'brand': 'Бренд',
  'other_products': 'Другие товары',

  // ── Profile ──
  'profile_title': 'Профиль',
  'theme': 'Тема оформления',
  'language': 'Язык',
  'contact_us': 'Связаться с нами',
  'about': 'О приложении',
  'theme_light': 'Светлая',
  'theme_dark': 'Тёмная',
  'theme_system': 'Системная',

  // ── Validation ──
  'field_required': 'Поле не должно быть пустым',
  'invalid_phone': 'Некорректный номер телефона',

  // ── General ──
  'cancel': 'Отмена',
  'confirm': 'Подтвердить',
  'error_generic': 'Произошла ошибка. Попробуйте позже.',
  'retry': 'Повторить',
  'items_count': 'шт',
};
```

```dart
// core/localization/l10n/app_tm.dart
const Map<String, String> tm = {
  'nav_home': 'Baş sahypa',
  'nav_catalog': 'Kategoriýalar',
  'nav_cart': 'Sebet',
  'nav_favorites': 'Halanlarym',
  'nav_profile': 'Profil',
  'search_hint': 'Gözleg',
  'new_arrivals': 'Täzeler',
  'discounts': 'Arzanladyşlar',
  'add_to_cart': 'Sebede goş',
  'categories': 'Kategoriýalar',
  'brands': 'Brendler',
  // ... все ключи аналогично
};
```

### 10.3 Использование

```dart
// Вспомогательная функция
String tr(BuildContext context, String key) {
  final locale = getIt<LocaleNotifier>().locale;
  final strings = locale.languageCode == 'tm' ? tm : ru;
  return strings[key] ?? key;
}

// В виджете
Text(tr(context, 'add_to_cart'));
```

---

## 11. Пакеты (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter

  # ── Navigation ──
  go_router: ^14.0.0

  # ── DI ──
  get_it: ^8.0.0

  # ── Networking ──
  dio: ^5.0.0

  # ── Local Storage ──
  shared_preferences: ^2.3.0

  # ── Images ──
  cached_network_image: ^3.4.0

  # ── Icons ──
  lucide_icons: ^0.257.0

  # ── Fonts ──
  google_fonts: ^6.0.0

  # ── Utils ──
  intl: ^0.19.0               # Форматирование дат и чисел
  url_launcher: ^6.3.0        # Открытие телефона, ссылок
  shimmer: ^3.0.0              # Shimmer loading effect
  smooth_page_indicator: ^1.2.0  # Banner page dots

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
```

---

## 12. Запуск приложения (main.dart)

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureDependencies();
  runApp(const ElinHimApp());
}
```

```dart
// app.dart
class ElinHimApp extends StatelessWidget {
  const ElinHimApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: Listenable.merge([
        getIt<ThemeNotifier>(),
        getIt<LocaleNotifier>(),
      ]),
      builder: (context, _) {
        final themeNotifier = getIt<ThemeNotifier>();
        final localeNotifier = getIt<LocaleNotifier>();

        return MaterialApp.router(
          title: 'Commerce',
          debugShowCheckedModeBanner: false,
          themeMode: themeNotifier.themeMode,
          theme: AppTheme.light,
          darkTheme: AppTheme.dark,
          locale: localeNotifier.locale,
          supportedLocales: const [Locale('ru'), Locale('tm')],
          routerConfig: goRouter,
        );
      },
    );
  }
}
```

---

## 13. Резюме экранов и табов

| # | Таб | Экран | Иконка | Описание |
|---|---|---|---|---|
| 1 | Главная | `HomeScreen` | `Lucide.home` | Баннеры, бренды, секции товаров, поиск |
| 2 | Каталог | `CatalogScreen` | `Lucide.layoutGrid` | Категории (список) + Бренды (сетка) через TabBar |
| 3 | Корзина | `CartScreen` | `Lucide.shoppingCart` | Список товаров в корзине, итого, оформление |
| 4 | Избранное | `FavoritesScreen` | `Lucide.heart` | Сохранённые товары (локально) |
| 5 | Профиль | `ProfileScreen` | `Lucide.user` | Тема, язык, история заказов, контакты, о приложении |

| Полноэкранный | Путь | Описание |
|---|---|---|
| `ProductListScreen` | `/products` | Товары категории / бренда / поиска |
| `ProductDetailScreen` | `/product/:id` | Детали товара |
| `CheckoutScreen` | `/checkout` | Оформление заказа |
| `SearchScreen` | `/search` | Поиск товаров |
| `OrderHistoryScreen` | `/profile/orders` | История заказов |

---

## 14. Ключевые UX-принципы

1. **Минимализм** — Чёрно-белая палитра, минимум декоративных элементов, акцент на контент
2. **Скорость** — Shimmer loading вместо спиннеров, кэширование изображений, оптимистичные обновления корзины
3. **Консистентность** — Единая карточка товара везде (Home, Favorites, Search, Related)
4. **Тактильная обратная связь** — Haptic feedback на добавление в корзину / избранное
5. **Оффлайн-first** — Корзина и избранное работают без интернета
6. **Плавные переходы** — Анимации появления, исчезновения, переходов между экранами
7. **Доступность** — Достаточный контраст (чёрный на белом), крупные зоны нажатия (≥48px), семантические метки

---

## 15. Чеклист разработки

- [ ] Настройка проекта Flutter, пакеты, структура папок
- [ ] Core: DI (get_it), Dio + interceptors, SharedPreferences
- [ ] Core: AppTheme (light + dark), AppColors, TextStyles
- [ ] Core: Локализация (RU/TM), ThemeNotifier, LocaleNotifier
- [ ] Core: GoRouter с StatefulShellRoute, AppScaffold + Bottom Nav
- [ ] Core: Переиспользуемые виджеты (ProductCard, EmptyState, SearchBar, QuantitySelector)
- [ ] Feature: Home — баннеры, бренды, секции товаров
- [ ] Feature: Catalog — категории + подкатегории + бренды
- [ ] Feature: Product List — сетка, сортировка, пагинация
- [ ] Feature: Product Detail — изображение, инфо, related
- [ ] Feature: Cart — список, quantity, summary bar
- [ ] Feature: Checkout — форма, зоны доставки, слоты, валидация
- [ ] Feature: Favorites — локальное хранение, toggle
- [ ] Feature: Profile — тема, язык, история заказов
- [ ] Feature: Order History — табы, фильтры, список
- [ ] Feature: Search — debounce, результаты, empty state
- [ ] Тестирование на Android и iOS
- [ ] Оптимизация: lazy loading, image caching, build optimization
