import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/features/catalog/logic/categories_notifier.dart';
import 'package:commerce/features/catalog/logic/brands_notifier.dart';
import 'package:commerce/features/catalog/presentation/widgets/category_list_tile.dart';
import 'package:commerce/features/catalog/presentation/widgets/brand_grid.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  late final CategoriesNotifier _categoriesNotifier;
  late final BrandsNotifier _brandsNotifier;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _categoriesNotifier = getIt<CategoriesNotifier>()..loadCategories();
    _brandsNotifier = getIt<BrandsNotifier>()..loadBrands();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _categoriesNotifier.dispose();
    _brandsNotifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            TabBar(
              controller: _tabController,
              tabs: [
                Tab(icon: const Icon(LucideIcons.layoutList), text: l10n.categories),
                Tab(icon: const Icon(LucideIcons.square), text: l10n.brands),
              ],
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  // Categories tab
                  ListenableBuilder(
                    listenable: _categoriesNotifier,
                    builder: (context, _) {
                      if (_categoriesNotifier.isLoading) return const LoadingIndicator();
                      return ListView.builder(
                        itemCount: _categoriesNotifier.categories.length,
                        itemBuilder: (context, index) {
                          return CategoryListTile(
                            category: _categoriesNotifier.categories[index],
                            isExpanded: _categoriesNotifier.isExpanded(_categoriesNotifier.categories[index].id),
                            onToggleExpand: () => _categoriesNotifier.toggleExpand(_categoriesNotifier.categories[index].id),
                          );
                        },
                      );
                    },
                  ),
                  // Brands tab
                  BrandGrid(notifier: _brandsNotifier),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
