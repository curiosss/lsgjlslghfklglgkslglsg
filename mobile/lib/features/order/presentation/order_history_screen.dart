import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/utils/formatters.dart';
import 'package:commerce/core/widgets/empty_state.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/order/logic/order_history_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  late final OrderHistoryNotifier _notifier;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _notifier = getIt<OrderHistoryNotifier>()..loadOrders();
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        _notifier.setTypeFilter(_tabController.index == 0 ? 'delivery' : 'pickup');
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _notifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    final statusFilters = [
      ('all', l10n.allOrders),
      ('new', l10n.newOrders),
      ('confirmed', l10n.confirmed),
      ('shipped', l10n.shipped),
      ('delivered', l10n.delivered),
      ('cancelled', l10n.cancelled),
    ];

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            TabBar(
              controller: _tabController,
              tabs: [
                Tab(icon: const Icon(LucideIcons.truck, size: 20), text: l10n.delivery),
                Tab(icon: const Icon(LucideIcons.footprints, size: 20), text: l10n.pickup),
              ],
            ),
            ListenableBuilder(
              listenable: _notifier,
              builder: (context, _) {
                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Text('${l10n.allOrders} - ${_notifier.orders.length} ${l10n.pieces}.', style: theme.textTheme.bodyMedium),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: statusFilters.map((f) {
                          final isSelected = _notifier.statusFilter == f.$1;
                          return ChoiceChip(
                            label: Text(f.$2),
                            selected: isSelected,
                            onSelected: (_) => _notifier.setStatusFilter(f.$1),
                            selectedColor: theme.colorScheme.primary,
                            labelStyle: TextStyle(color: isSelected ? theme.colorScheme.onPrimary : null),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 8),
            Expanded(
              child: ListenableBuilder(
                listenable: _notifier,
                builder: (context, _) {
                  if (_notifier.isLoading) return const LoadingIndicator();
                  if (_notifier.orders.isEmpty) {
                    return EmptyState(icon: LucideIcons.search, title: l10n.noResults);
                  }

                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _notifier.orders.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final order = _notifier.orders[index];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: theme.colorScheme.outline),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('${l10n.orderNumber} #${order.id}', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                                Text(Formatters.date(order.createdAt), style: theme.textTheme.bodySmall),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('${order.items.length} ${l10n.items}', style: theme.textTheme.bodyMedium),
                                Text(Formatters.price(order.total), style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            _StatusBadge(status: order.status, l10n: l10n, theme: theme),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  final AppLocalizations l10n;
  final ThemeData theme;

  const _StatusBadge({required this.status, required this.l10n, required this.theme});

  @override
  Widget build(BuildContext context) {
    Color color;
    String text;
    switch (status) {
      case 'confirmed':
        color = theme.colorScheme.primary;
        text = l10n.confirmed;
      case 'shipped':
        color = Colors.blue;
        text = l10n.shipped;
      case 'delivered':
        color = Colors.green;
        text = l10n.delivered;
      case 'cancelled':
        color = theme.colorScheme.error;
        text = l10n.cancelled;
      default:
        color = theme.colorScheme.secondary;
        text = l10n.newOrders;
    }

    return Row(
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
        const SizedBox(width: 8),
        Text(text, style: theme.textTheme.bodySmall?.copyWith(color: color)),
      ],
    );
  }
}
