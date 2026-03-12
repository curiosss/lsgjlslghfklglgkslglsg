import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/features/catalog/data/models/brand_model.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';

class BrandStrip extends StatelessWidget {
  final List<Brand> brands;

  const BrandStrip({super.key, required this.brands});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      height: 100,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: brands.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final brand = brands[index];
          return GestureDetector(
            onTap: () => context.push('/products', extra: ProductListArgs(title: brand.name, brandId: brand.id)),
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: theme.colorScheme.outline),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: brand.logoUrl != null
                    ? AppCachedImage(imageUrl: brand.logoUrl!, fit: BoxFit.contain)
                    : Center(
                        child: Text(brand.name, style: theme.textTheme.labelSmall, textAlign: TextAlign.center),
                      ),
              ),
            ),
          );
        },
      ),
    );
  }
}
