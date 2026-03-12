import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/widgets/empty_state.dart';
import 'package:commerce/core/widgets/product_card.dart';
import 'package:commerce/features/favorites/logic/favorites_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final favs = getIt<FavoritesNotifier>();

    return Scaffold(
      appBar: AppBar(title: Text(l10n.favorites)),
      body: ListenableBuilder(
        listenable: favs,
        builder: (context, _) {
          if (favs.isEmpty) {
            return EmptyState(
              icon: LucideIcons.heart,
              title: l10n.emptyFavorites,
              subtitle: l10n.emptyFavoritesSubtitle,
            );
          }

          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.55,
            ),
            itemCount: favs.favorites.length,
            itemBuilder: (context, index) {
              return ProductCard(
                product: favs.favorites[index],
                onTap: () => context.push('/product/${favs.favorites[index].id}'),
              );
            },
          );
        },
      ),
    );
  }
}
