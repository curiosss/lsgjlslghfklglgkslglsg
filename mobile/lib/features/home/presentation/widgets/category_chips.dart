import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:commerce/features/catalog/data/models/category_model.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';

class CategoryChips extends StatelessWidget {
  final List<Category> categories;

  const CategoryChips({super.key, required this.categories});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      height: 52,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = categories[index];
          return GestureDetector(
            onTap: () => context.push('/products', extra: ProductListArgs(title: cat.name, categoryId: cat.id)),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Center(
                child: Text(cat.name, style: theme.textTheme.labelLarge),
              ),
            ),
          );
        },
      ),
    );
  }
}
