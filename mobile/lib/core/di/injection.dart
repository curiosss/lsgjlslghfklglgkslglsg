import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:commerce/core/network/api_client.dart';
import 'package:commerce/core/network/interceptors/language_interceptor.dart';
import 'package:commerce/core/network/interceptors/error_interceptor.dart';
import 'package:commerce/core/providers/app_provider.dart';
import 'package:commerce/features/home/data/home_repository.dart';
import 'package:commerce/features/catalog/data/catalog_repository.dart';
import 'package:commerce/features/product/data/product_repository.dart';
import 'package:commerce/features/cart/data/cart_repository.dart';
import 'package:commerce/features/favorites/data/favorites_repository.dart';
import 'package:commerce/features/order/data/order_repository.dart';
import 'package:commerce/features/search/data/search_repository.dart';
import 'package:commerce/features/home/logic/home_notifier.dart';
import 'package:commerce/features/catalog/logic/categories_notifier.dart';
import 'package:commerce/features/catalog/logic/brands_notifier.dart';
import 'package:commerce/features/product/logic/product_list_notifier.dart';
import 'package:commerce/features/cart/logic/cart_notifier.dart';
import 'package:commerce/features/favorites/logic/favorites_notifier.dart';
import 'package:commerce/features/order/logic/checkout_notifier.dart';
import 'package:commerce/features/order/logic/order_history_notifier.dart';
import 'package:commerce/features/search/logic/search_notifier.dart';

final getIt = GetIt.instance;

Future<void> configureDependencies() async {
  final prefs = await SharedPreferences.getInstance();

  // Core
  getIt.registerSingleton<SharedPreferences>(prefs);
  getIt.registerLazySingleton<AppProvider>(() => AppProvider(prefs));

  final dio = ApiClient.createDio();
  dio.interceptors.addAll([
    LanguageInterceptor(getIt<AppProvider>()),
    ErrorInterceptor(),
  ]);
  getIt.registerSingleton<Dio>(dio);
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<Dio>()));

  // Repositories
  getIt.registerLazySingleton<HomeRepository>(() => HomeRepository(getIt<ApiClient>()));
  getIt.registerLazySingleton<CatalogRepository>(() => CatalogRepository(getIt<ApiClient>()));
  getIt.registerLazySingleton<ProductRepository>(() => ProductRepository(getIt<ApiClient>()));
  getIt.registerLazySingleton<CartRepository>(() => CartRepository(prefs));
  getIt.registerLazySingleton<FavoritesRepository>(() => FavoritesRepository(prefs));
  getIt.registerLazySingleton<OrderRepository>(() => OrderRepository(getIt<ApiClient>()));
  getIt.registerLazySingleton<SearchRepository>(() => SearchRepository(getIt<ApiClient>()));

  // Global notifiers (singletons)
  getIt.registerLazySingleton<CartNotifier>(() => CartNotifier(getIt<CartRepository>())..loadCart());
  getIt.registerLazySingleton<FavoritesNotifier>(() => FavoritesNotifier(getIt<FavoritesRepository>())..loadFavorites());

  // Feature notifiers (factory)
  getIt.registerFactory<HomeNotifier>(() => HomeNotifier(getIt<HomeRepository>()));
  getIt.registerFactory<CategoriesNotifier>(() => CategoriesNotifier(getIt<CatalogRepository>()));
  getIt.registerFactory<BrandsNotifier>(() => BrandsNotifier(getIt<CatalogRepository>()));
  getIt.registerFactory<ProductListNotifier>(() => ProductListNotifier(getIt<ProductRepository>()));
  getIt.registerFactory<CheckoutNotifier>(() => CheckoutNotifier(getIt<OrderRepository>()));
  getIt.registerFactory<OrderHistoryNotifier>(() => OrderHistoryNotifier(getIt<OrderRepository>()));
  getIt.registerFactory<SearchNotifier>(() => SearchNotifier(getIt<SearchRepository>()));
}
