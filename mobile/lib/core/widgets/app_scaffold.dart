import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/features/cart/logic/cart_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class AppScaffold extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const AppScaffold({super.key, required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final cart = getIt<CartNotifier>();

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: theme.colorScheme.outline, width: 1)),
        ),
        child: ListenableBuilder(
          listenable: cart,
          builder: (context, _) {
            return BottomNavigationBar(
              currentIndex: navigationShell.currentIndex,
              onTap: (index) => navigationShell.goBranch(index, initialLocation: index == navigationShell.currentIndex),
              items: [
                BottomNavigationBarItem(
                  icon: const Icon(LucideIcons.home, size: 24),
                  label: l10n.home,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(LucideIcons.layoutGrid, size: 24),
                  label: l10n.categories,
                ),
                BottomNavigationBarItem(
                  icon: cart.totalCount > 0
                      ? Badge(
                          label: Text(
                            cart.totalPrice > 0 ? Formatters.price(cart.totalPrice) : '${cart.totalCount}',
                            style: const TextStyle(fontSize: 9, color: Colors.white),
                          ),
                          backgroundColor: theme.colorScheme.primary,
                          child: const Icon(LucideIcons.shoppingCart, size: 24),
                        )
                      : const Icon(LucideIcons.shoppingCart, size: 24),
                  label: cart.totalCount > 0 ? Formatters.price(cart.totalPrice) : l10n.cart,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(LucideIcons.heart, size: 24),
                  label: l10n.favorites,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(LucideIcons.fileText, size: 24),
                  label: l10n.orders,
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

// Small helper to avoid circular import
class Formatters {
  static String price(double value) {
    final formatted = value.toStringAsFixed(2).replaceAll('.', ',');
    return '$formatted м.';
  }
}
