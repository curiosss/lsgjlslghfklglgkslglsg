import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/features/catalog/data/models/category_model.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';

class CategoryListTile extends StatelessWidget {
  final Category category;
  final bool isExpanded;
  final VoidCallback onToggleExpand;

  const CategoryListTile({
    super.key,
    required this.category,
    required this.isExpanded,
    required this.onToggleExpand,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            border: Border(bottom: BorderSide(color: theme.colorScheme.outline)),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            leading: category.imageUrl != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: AppCachedImage(imageUrl: category.imageUrl!, width: 56, height: 56, fit: BoxFit.cover),
                  )
                : Container(
                    width: 56, height: 56,
                    decoration: BoxDecoration(color: theme.colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(8)),
                  ),
            title: Text(category.name, style: theme.textTheme.bodyLarge),
            trailing: category.hasSubCategories
                ? Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        onPressed: () => context.push('/products', extra: ProductListArgs(title: category.name, categoryId: category.id)),
                        icon: const Icon(LucideIcons.arrowRight, size: 20),
                      ),
                      IconButton(
                        onPressed: onToggleExpand,
                        icon: AnimatedRotation(
                          turns: isExpanded ? 0.5 : 0,
                          duration: const Duration(milliseconds: 200),
                          child: const Icon(LucideIcons.chevronDown, size: 20),
                        ),
                      ),
                    ],
                  )
                : null,
            onTap: category.hasSubCategories
                ? onToggleExpand
                : () => context.push('/products', extra: ProductListArgs(title: category.name, categoryId: category.id)),
          ),
        ),
        // Subcategories
        AnimatedSize(
          duration: const Duration(milliseconds: 200),
          child: isExpanded
              ? Column(
                  children: category.subCategories.map((sub) {
                    return Container(
                      color: theme.colorScheme.surfaceContainerHighest,
                      child: ListTile(
                        contentPadding: const EdgeInsets.only(left: 32, right: 16),
                        leading: sub.imageUrl != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: AppCachedImage(imageUrl: sub.imageUrl!, width: 48, height: 48, fit: BoxFit.cover),
                              )
                            : null,
                        title: Text(sub.name, style: theme.textTheme.bodyMedium),
                        onTap: () => context.push('/products', extra: ProductListArgs(title: sub.name, subcategoryId: sub.id)),
                      ),
                    );
                  }).toList(),
                )
              : const SizedBox.shrink(),
        ),
      ],
    );
  }
}
