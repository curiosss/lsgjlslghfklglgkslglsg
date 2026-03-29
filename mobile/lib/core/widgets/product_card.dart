import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/utils/formatters.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/core/widgets/quantity_selector.dart';
import 'package:commerce/features/product/data/models/product_model.dart';
import 'package:commerce/features/cart/logic/cart_notifier.dart';
import 'package:commerce/features/favorites/logic/favorites_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onTap;

  const ProductCard({super.key, required this.product, this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final cart = getIt<CartNotifier>();
    final favs = getIt<FavoritesNotifier>();

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: theme.colorScheme.outline),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Image + favorite + discount badge
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  AppCachedImage(
                    imageUrl: product.imageUrl,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                    fit: BoxFit.cover,
                  ),
                  // Favorite button
                  Positioned(
                    top: 8,
                    right: 8,
                    child: ListenableBuilder(
                      listenable: favs,
                      builder: (context, _) {
                        final isFav = favs.isFavorite(product.id);
                        return GestureDetector(
                          onTap: () => favs.toggleFavorite(product),
                          child: Icon(
                            isFav ? LucideIcons.heartOff : LucideIcons.heart,
                            size: 24,
                            color: isFav
                                ? theme.colorScheme.error
                                : theme.colorScheme.secondary,
                          ),
                        );
                      },
                    ),
                  ),
                  // Discount badge
                  if (product.isDiscount &&
                      product.discountPercent != null &&
                      product.discountPercent! > 0)
                    Positioned(
                      bottom: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.error,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '-${product.discountPercent}%',
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                children: [
                  // Brand name
                  Text(
                    product.brandName,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  // Description
                  Text(
                    product.name,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.secondary,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  // Price
                  _buildPrice(theme),
                  const SizedBox(height: 4),
                  // Cart button or quantity selector
                  ListenableBuilder(
                    listenable: cart,
                    builder: (context, _) {
                      final qty = cart.getQuantity(product.id);
                      if (qty > 0) {
                        return QuantitySelector(
                          quantity: qty,
                          unitLabel: l10n.pieces,
                          onIncrement: () =>
                              cart.updateQuantity(product.id, qty + 1),
                          onDecrement: () =>
                              cart.updateQuantity(product.id, qty - 1),
                        );
                      }
                      return SizedBox(
                        width: double.infinity,
                        height: 36, // Slightly smaller button
                        child: OutlinedButton(
                          onPressed: () => cart.addToCart(product),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                          ),
                          child: Text(
                            l10n.addToCart,
                            style: const TextStyle(fontSize: 13),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrice(ThemeData theme) {
    if (product.oldPrice != null && product.oldPrice! > product.price) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            Formatters.price(product.price),
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            Formatters.priceRaw(product.oldPrice!),
            style: theme.textTheme.bodySmall?.copyWith(
              decoration: TextDecoration.lineThrough,
              color: theme.colorScheme.secondary,
            ),
          ),
        ],
      );
    }
    return Text(
      Formatters.price(product.price),
      style: theme.textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.bold,
        color: theme.colorScheme.primary,
      ),
    );
  }
}
