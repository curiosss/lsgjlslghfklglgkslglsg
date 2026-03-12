import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:commerce/core/widgets/app_scaffold.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';
import 'package:commerce/features/catalog/presentation/catalog_screen.dart';
import 'package:commerce/features/cart/presentation/cart_screen.dart';
import 'package:commerce/features/favorites/presentation/favorites_screen.dart';
import 'package:commerce/features/order/presentation/order_history_screen.dart';
import 'package:commerce/features/product/presentation/product_detail_screen.dart';
import 'package:commerce/features/product/presentation/product_list_screen.dart';
import 'package:commerce/features/order/presentation/checkout_screen.dart';
import 'package:commerce/features/search/presentation/search_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

final goRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/home',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return AppScaffold(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(routes: [
          GoRoute(path: '/home', name: 'home', builder: (context, state) => const HomeScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: '/catalog', name: 'catalog', builder: (context, state) => const CatalogScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: '/cart', name: 'cart', builder: (context, state) => const CartScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: '/favorites', name: 'favorites', builder: (context, state) => const FavoritesScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: '/orders', name: 'orders', builder: (context, state) => const OrderHistoryScreen()),
        ]),
      ],
    ),
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
        final args = state.extra as ProductListArgs;
        return ProductListScreen(args: args);
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
