import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/providers/app_provider.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/home/logic/home_notifier.dart';
import 'package:commerce/features/home/presentation/widgets/banner_carousel.dart';
import 'package:commerce/features/home/presentation/widgets/brand_strip.dart';
import 'package:commerce/features/home/presentation/widgets/category_chips.dart';
import 'package:commerce/features/home/presentation/widgets/product_section.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final HomeNotifier _notifier;

  @override
  void initState() {
    super.initState();
    _notifier = getIt<HomeNotifier>();
    _notifier.loadHome();
  }

  @override
  void dispose() {
    _notifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final appProvider = getIt<AppProvider>();

    return Scaffold(
      body: SafeArea(
        child: ListenableBuilder(
          listenable: _notifier,
          builder: (context, _) {
            if (_notifier.isLoading && _notifier.banners.isEmpty) {
              return const LoadingIndicator();
            }

            return RefreshIndicator(
              onRefresh: () => _notifier.loadHome(),
              child: CustomScrollView(
                slivers: [
                  // Search bar + actions
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => context.push('/search'),
                              child: Container(
                                height: 48,
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.surface,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: theme.colorScheme.outline),
                                ),
                                child: Row(
                                  children: [
                                    Icon(LucideIcons.search, size: 20, color: theme.colorScheme.secondary),
                                    const SizedBox(width: 12),
                                    Text(l10n.search, style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.secondary)),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            onPressed: () {
                              final current = appProvider.themeMode;
                              appProvider.setTheme(
                                current == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark,
                              );
                            },
                            icon: Icon(
                              theme.brightness == Brightness.dark ? LucideIcons.sun : LucideIcons.moon,
                              size: 24,
                            ),
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(LucideIcons.phone, size: 24),
                          ),
                          ListenableBuilder(
                            listenable: appProvider,
                            builder: (context, _) {
                              return GestureDetector(
                                onTap: () {
                                  appProvider.setLocale(appProvider.isRussian ? 'tk' : 'ru');
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: theme.colorScheme.primary,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    appProvider.isRussian ? 'RU' : 'TM',
                                    style: theme.textTheme.labelMedium?.copyWith(
                                      color: theme.colorScheme.onPrimary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Category chips
                  if (_notifier.categories.isNotEmpty)
                    SliverToBoxAdapter(
                      child: CategoryChips(categories: _notifier.categories),
                    ),

                  // Banner carousel
                  if (_notifier.banners.isNotEmpty)
                    SliverToBoxAdapter(
                      child: BannerCarousel(banners: _notifier.banners),
                    ),

                  // Brand strip
                  if (_notifier.brands.isNotEmpty)
                    SliverToBoxAdapter(
                      child: BrandStrip(brands: _notifier.brands),
                    ),

                  // New products section
                  if (_notifier.newProducts.isNotEmpty)
                    SliverToBoxAdapter(
                      child: ProductSection(
                        title: l10n.newArrivals,
                        products: _notifier.newProducts,
                        onSeeAll: () => context.push('/products', extra: ProductListArgs(title: l10n.newArrivals, isNew: true)),
                      ),
                    ),

                  // Discount products section
                  if (_notifier.discountProducts.isNotEmpty)
                    SliverToBoxAdapter(
                      child: ProductSection(
                        title: l10n.discounts,
                        products: _notifier.discountProducts,
                        onSeeAll: () => context.push('/products', extra: ProductListArgs(title: l10n.discounts, isDiscount: true)),
                      ),
                    ),

                  const SliverPadding(padding: EdgeInsets.only(bottom: 16)),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class ProductListArgs {
  final String title;
  final int? categoryId;
  final int? subcategoryId;
  final int? brandId;
  final bool isNew;
  final bool isDiscount;

  const ProductListArgs({
    required this.title,
    this.categoryId,
    this.subcategoryId,
    this.brandId,
    this.isNew = false,
    this.isDiscount = false,
  });
}
