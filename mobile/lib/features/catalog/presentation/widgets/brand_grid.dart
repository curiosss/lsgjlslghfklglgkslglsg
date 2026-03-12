import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/catalog/logic/brands_notifier.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class BrandGrid extends StatelessWidget {
  final BrandsNotifier notifier;

  const BrandGrid({super.key, required this.notifier});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return ListenableBuilder(
      listenable: notifier,
      builder: (context, _) {
        if (notifier.isLoading) return const LoadingIndicator();

        return Column(
          children: [
            // Search
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                decoration: InputDecoration(
                  hintText: l10n.searchBrand,
                  prefixIcon: const Icon(LucideIcons.search, size: 20),
                ),
                onChanged: notifier.setSearchQuery,
              ),
            ),
            // Grid
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.85,
                ),
                itemCount: notifier.filteredBrands.length,
                itemBuilder: (context, index) {
                  final brand = notifier.filteredBrands[index];
                  return GestureDetector(
                    onTap: () => context.push('/products', extra: ProductListArgs(title: brand.name, brandId: brand.id)),
                    child: Container(
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: theme.colorScheme.outline),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(8),
                              child: brand.logoUrl != null
                                  ? AppCachedImage(imageUrl: brand.logoUrl!, fit: BoxFit.contain)
                                  : const SizedBox.shrink(),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text(brand.name, style: theme.textTheme.bodyMedium, textAlign: TextAlign.center),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}
