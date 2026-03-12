import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/widgets/product_card.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/product/logic/product_list_notifier.dart';
import 'package:commerce/features/home/presentation/home_screen.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class ProductListScreen extends StatefulWidget {
  final ProductListArgs args;

  const ProductListScreen({super.key, required this.args});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  late final ProductListNotifier _notifier;
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _notifier = getIt<ProductListNotifier>();
    _notifier.loadProducts(
      categoryId: widget.args.categoryId,
      subcategoryId: widget.args.subcategoryId,
      brandId: widget.args.brandId,
    );
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      _notifier.loadMore();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _notifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(widget.args.title)),
      body: ListenableBuilder(
        listenable: _notifier,
        builder: (context, _) {
          if (_notifier.isLoading && _notifier.products.isEmpty) {
            return const LoadingIndicator();
          }

          return Column(
            children: [
              // Total + sort chips
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    Text(l10n.totalCount(_notifier.total), style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.primary)),
                    const Spacer(),
                    _SortChip(
                      label: l10n.lowPrice,
                      isSelected: _notifier.sort == 'price_asc',
                      onTap: () => _notifier.setSort(_notifier.sort == 'price_asc' ? null : 'price_asc'),
                    ),
                    const SizedBox(width: 8),
                    _SortChip(
                      label: l10n.highPrice,
                      isSelected: _notifier.sort == 'price_desc',
                      onTap: () => _notifier.setSort(_notifier.sort == 'price_desc' ? null : 'price_desc'),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: GridView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.55,
                  ),
                  itemCount: _notifier.products.length + (_notifier.isLoadingMore ? 2 : 0),
                  itemBuilder: (context, index) {
                    if (index >= _notifier.products.length) {
                      return const Center(child: CircularProgressIndicator(strokeWidth: 2));
                    }
                    return ProductCard(
                      product: _notifier.products[index],
                      onTap: () => context.push('/product/${_notifier.products[index].id}'),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _SortChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _SortChip({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? theme.colorScheme.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outline),
        ),
        child: Text(
          label,
          style: theme.textTheme.labelMedium?.copyWith(
            color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.primary,
          ),
        ),
      ),
    );
  }
}
