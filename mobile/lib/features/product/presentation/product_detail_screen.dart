import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/utils/formatters.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/core/widgets/product_card.dart';
import 'package:commerce/core/widgets/quantity_selector.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/product/data/product_repository.dart';
import 'package:commerce/features/product/data/models/product_model.dart';
import 'package:commerce/features/cart/logic/cart_notifier.dart';
import 'package:commerce/features/favorites/logic/favorites_notifier.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class ProductDetailScreen extends StatefulWidget {
  final int productId;

  const ProductDetailScreen({super.key, required this.productId});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Product? _product;
  List<Product> _related = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    try {
      final repo = getIt<ProductRepository>();
      final results = await Future.wait([
        repo.getProductById(widget.productId),
        repo.getRelatedProducts(widget.productId),
      ]);
      setState(() {
        _product = results[0] as Product;
        _related = results[1] as List<Product>;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final cart = getIt<CartNotifier>();
    final favs = getIt<FavoritesNotifier>();

    if (_isLoading) {
      return Scaffold(appBar: AppBar(), body: const LoadingIndicator());
    }
    if (_product == null) {
      return Scaffold(appBar: AppBar(), body: const Center(child: Text('Product not found')));
    }

    final product = _product!;

    return Scaffold(
      appBar: AppBar(title: Text(product.brandName)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product image
            Container(
              width: double.infinity,
              height: 300,
              color: theme.colorScheme.surfaceContainerHighest,
              child: InteractiveViewer(
                child: AppCachedImage(imageUrl: product.imageUrl, fit: BoxFit.contain, width: double.infinity, height: 300),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Brand & name
                  Text(product.brandName, style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(product.name, style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.secondary)),
                  const SizedBox(height: 16),

                  // Action row
                  ListenableBuilder(
                    listenable: Listenable.merge([cart, favs]),
                    builder: (context, _) {
                      final qty = cart.getQuantity(product.id);
                      final isFav = favs.isFavorite(product.id);

                      return Row(
                        children: [
                          if (qty > 0)
                            QuantitySelector(
                              quantity: qty,
                              unitLabel: l10n.pieces,
                              onIncrement: () => cart.updateQuantity(product.id, qty + 1),
                              onDecrement: () => cart.updateQuantity(product.id, qty - 1),
                            )
                          else
                            OutlinedButton(
                              onPressed: () => cart.addToCart(product),
                              child: Text(l10n.addToCart),
                            ),
                          const SizedBox(width: 16),
                          Text(
                            Formatters.price(product.price),
                            style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const Spacer(),
                          IconButton(
                            onPressed: () => favs.toggleFavorite(product),
                            icon: Icon(
                              isFav ? LucideIcons.heartOff : LucideIcons.heart,
                              size: 36,
                              color: isFav ? theme.colorScheme.error : theme.colorScheme.secondary,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  const Divider(),

                  // Details
                  if (product.barcode != null) ...[
                    _DetailRow(label: l10n.barcode, value: product.barcode!),
                    const Divider(),
                  ],
                  _DetailRow(
                    label: l10n.brand,
                    value: product.brandName,
                    onTap: product.brandId != null
                        ? () => context.push('/products', extra: ProductListArgs(title: product.brandName, brandId: product.brandId))
                        : null,
                  ),
                  const Divider(),
                  const SizedBox(height: 24),

                  // Related
                  if (_related.isNotEmpty) ...[
                    Text(l10n.relatedProducts, style: theme.textTheme.headlineMedium),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 320,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: _related.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          return SizedBox(
                            width: 180,
                            child: ProductCard(
                              product: _related[index],
                              onTap: () => context.push('/product/${_related[index].id}'),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback? onTap;

  const _DetailRow({required this.label, required this.value, this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.secondary)),
          GestureDetector(
            onTap: onTap,
            child: Text(
              value,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: onTap != null ? theme.colorScheme.primary : null,
                fontWeight: onTap != null ? FontWeight.bold : null,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
