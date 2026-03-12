import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/utils/formatters.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/core/widgets/empty_state.dart';
import 'package:commerce/core/widgets/quantity_selector.dart';
import 'package:commerce/features/cart/logic/cart_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final cart = getIt<CartNotifier>();

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.cart),
        actions: [
          ListenableBuilder(
            listenable: cart,
            builder: (context, _) {
              if (cart.isEmpty) return const SizedBox.shrink();
              return IconButton(
                onPressed: () => _showClearConfirm(context, cart, l10n),
                icon: const Icon(LucideIcons.trash2, size: 24),
              );
            },
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: cart,
        builder: (context, _) {
          if (cart.isEmpty) {
            return EmptyState(
              icon: LucideIcons.shoppingCart,
              title: l10n.emptyCart,
              subtitle: l10n.emptyCartSubtitle,
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: cart.items.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = cart.items[index];
                    return Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: theme.colorScheme.outline),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: AppCachedImage(
                              imageUrl: item.product.imageUrl,
                              width: 80, height: 80,
                              fit: BoxFit.contain,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(item.product.brandName, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                                    ),
                                    GestureDetector(
                                      onTap: () => cart.removeFromCart(item.product.id),
                                      child: Icon(LucideIcons.x, size: 20, color: theme.colorScheme.secondary),
                                    ),
                                  ],
                                ),
                                Text(
                                  item.product.name,
                                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.secondary),
                                  maxLines: 2, overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    QuantitySelector(
                                      quantity: item.quantity,
                                      unitLabel: l10n.pieces,
                                      onIncrement: () => cart.updateQuantity(item.product.id, item.quantity + 1),
                                      onDecrement: () => cart.updateQuantity(item.product.id, item.quantity - 1),
                                    ),
                                    Text(
                                      Formatters.price(item.totalPrice),
                                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              // Bottom bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border(top: BorderSide(color: theme.colorScheme.outline)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      Formatters.price(cart.totalPrice),
                      style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                    ),
                    FilledButton(
                      onPressed: () => context.push('/checkout'),
                      child: Text(l10n.checkout),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showClearConfirm(BuildContext context, CartNotifier cart, AppLocalizations l10n) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(l10n.clearCartConfirm),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: Text(l10n.cancel)),
          TextButton(
            onPressed: () {
              cart.clearCart();
              Navigator.pop(ctx);
            },
            child: Text(l10n.confirm),
          ),
        ],
      ),
    );
  }
}
