import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/widgets/product_card.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class ProductSection extends StatelessWidget {
  final String title;
  final List<Product> products;
  final VoidCallback? onSeeAll;

  const ProductSection({
    super.key,
    required this.title,
    required this.products,
    this.onSeeAll,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final displayProducts = products.take(6).toList();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: theme.textTheme.headlineMedium),
              if (onSeeAll != null)
                IconButton(
                  onPressed: onSeeAll,
                  icon: const Icon(LucideIcons.arrowRight, size: 24),
                ),
            ],
          ),
          const SizedBox(height: 8),
          // Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              childAspectRatio: 0.65,
            ),
            itemCount: displayProducts.length,
            itemBuilder: (context, index) {
              return ProductCard(
                product: displayProducts[index],
                onTap: () =>
                    context.push('/product/${displayProducts[index].id}'),
              );
            },
          ),
        ],
      ),
    );
  }
}
