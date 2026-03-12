import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/widgets/product_card.dart';
import 'package:commerce/core/widgets/empty_state.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/search/logic/search_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  late final SearchNotifier _notifier;
  final _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _notifier = getIt<SearchNotifier>();
  }

  @override
  void dispose() {
    _controller.dispose();
    _notifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: TextField(
          controller: _controller,
          autofocus: true,
          decoration: InputDecoration(
            hintText: l10n.search,
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            filled: false,
            contentPadding: EdgeInsets.zero,
            suffixIcon: IconButton(
              onPressed: () {
                _controller.clear();
                _notifier.setQuery('');
              },
              icon: const Icon(LucideIcons.x, size: 20),
            ),
          ),
          onChanged: _notifier.setQuery,
        ),
      ),
      body: ListenableBuilder(
        listenable: _notifier,
        builder: (context, _) {
          if (!_notifier.hasQuery) {
            return Center(
              child: Text(
                l10n.search,
                style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.secondary),
              ),
            );
          }

          if (_notifier.isLoading) return const LoadingIndicator();

          if (_notifier.results.isEmpty) {
            return EmptyState(icon: LucideIcons.search, title: l10n.noResults);
          }

          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.55,
            ),
            itemCount: _notifier.results.length,
            itemBuilder: (context, index) {
              return ProductCard(
                product: _notifier.results[index],
                onTap: () => context.push('/product/${_notifier.results[index].id}'),
              );
            },
          );
        },
      ),
    );
  }
}
