import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/utils/formatters.dart';
import 'package:commerce/core/widgets/loading_indicator.dart';
import 'package:commerce/features/order/logic/checkout_notifier.dart';
import 'package:commerce/features/cart/logic/cart_notifier.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  late final CheckoutNotifier _notifier;
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _notifier = getIt<CheckoutNotifier>()..loadCheckoutData();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _noteCtrl.dispose();
    _notifier.dispose();
    super.dispose();
  }

  List<DateTime> get _availableDates {
    final now = DateTime.now();
    return List.generate(3, (i) => now.add(Duration(days: i)));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final cart = getIt<CartNotifier>();

    return Scaffold(
      appBar: AppBar(title: Text(l10n.orderDelivery)),
      body: ListenableBuilder(
        listenable: _notifier,
        builder: (context, _) {
          if (_notifier.isLoading) return const LoadingIndicator();

          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Delivery type toggle
                        Text(l10n.orderType, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(child: _TypeButton(
                              icon: LucideIcons.truck, label: l10n.delivery,
                              isSelected: _notifier.isDelivery,
                              onTap: () => _notifier.setDeliveryType(true),
                            )),
                            const SizedBox(width: 8),
                            Expanded(child: _TypeButton(
                              icon: LucideIcons.footprints, label: l10n.pickup,
                              isSelected: !_notifier.isDelivery,
                              onTap: () => _notifier.setDeliveryType(false),
                            )),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Date selector
                        SizedBox(
                          height: 40,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: _availableDates.length,
                            separatorBuilder: (_, __) => const SizedBox(width: 8),
                            itemBuilder: (context, index) {
                              final date = _availableDates[index];
                              final isSelected = _notifier.selectedDate.day == date.day;
                              return GestureDetector(
                                onTap: () => _notifier.setDate(date),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  decoration: BoxDecoration(
                                    color: isSelected ? theme.colorScheme.primary : theme.colorScheme.surfaceContainerHighest,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Center(
                                    child: Text(
                                      Formatters.dateShort(date),
                                      style: theme.textTheme.labelMedium?.copyWith(
                                        color: isSelected ? theme.colorScheme.onPrimary : null,
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Time slots
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2, crossAxisSpacing: 8, mainAxisSpacing: 8, childAspectRatio: 3,
                          ),
                          itemCount: _notifier.timeSlots.length,
                          itemBuilder: (context, index) {
                            final slot = _notifier.timeSlots[index];
                            final isSelected = _notifier.selectedTimeSlot?.id == slot.id;
                            return GestureDetector(
                              onTap: () => _notifier.setTimeSlot(slot),
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outline),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                                        size: 18, color: isSelected ? theme.colorScheme.primary : theme.colorScheme.secondary),
                                    const SizedBox(width: 8),
                                    Text(slot.label, style: theme.textTheme.labelMedium),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 24),

                        // Form fields
                        Text(l10n.fillFields, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _nameCtrl,
                          decoration: InputDecoration(hintText: l10n.fullName),
                          validator: (v) => (v == null || v.trim().isEmpty) ? l10n.nameFieldRequired : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _phoneCtrl,
                          decoration: InputDecoration(hintText: l10n.phone),
                          keyboardType: TextInputType.phone,
                          validator: (v) => (v == null || v.trim().isEmpty) ? l10n.phoneFieldRequired : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _addressCtrl,
                          decoration: InputDecoration(
                            hintText: l10n.address,
                            suffixIcon: _notifier.isDelivery && _notifier.zones.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(LucideIcons.mapPin, size: 20),
                                    onPressed: () => _showZonePicker(context),
                                  )
                                : null,
                          ),
                          validator: (v) => (v == null || v.trim().isEmpty) ? l10n.addressFieldRequired : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _noteCtrl,
                          decoration: InputDecoration(hintText: l10n.note),
                          maxLines: 2,
                        ),
                        const SizedBox(height: 24),

                        // Summary
                        ListenableBuilder(
                          listenable: cart,
                          builder: (context, _) {
                            return Column(
                              children: [
                                _SummaryRow(label: l10n.cartTotal, value: Formatters.price(cart.totalPrice)),
                                if (_notifier.isDelivery)
                                  _SummaryRow(label: l10n.deliveryFee, value: Formatters.price(_notifier.deliveryFee)),
                              ],
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Bottom bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(border: Border(top: BorderSide(color: theme.colorScheme.outline))),
                child: ListenableBuilder(
                  listenable: Listenable.merge([cart, _notifier]),
                  builder: (context, _) {
                    final total = cart.totalPrice + _notifier.deliveryFee;
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(Formatters.price(total), style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                        FilledButton(
                          onPressed: _notifier.isSubmitting ? null : () => _submit(context),
                          child: _notifier.isSubmitting
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                              : Text(l10n.placeOrder),
                        ),
                      ],
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

  Future<void> _submit(BuildContext context) async {
    if (!_formKey.currentState!.validate()) return;
    final cart = getIt<CartNotifier>();
    final l10n = AppLocalizations.of(context);

    final items = cart.items.map((i) => {
      'product_id': i.product.id,
      'quantity': i.quantity,
      'price': i.product.price,
    }).toList();

    final success = await _notifier.submitOrder(
      items: items,
      subtotal: cart.totalPrice,
      fullName: _nameCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      address: _addressCtrl.text.trim(),
      note: _noteCtrl.text.trim(),
    );

    if (success && context.mounted) {
      await cart.clearCart();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.orderSuccess)));
        context.go('/home');
      }
    }
  }

  void _showZonePicker(BuildContext context) {
    final theme = Theme.of(context);
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: _notifier.zones.length,
          separatorBuilder: (_, __) => const Divider(),
          itemBuilder: (context, index) {
            final zone = _notifier.zones[index];
            return ListTile(
              title: Text(zone.name),
              trailing: Text(Formatters.price(zone.deliveryPrice), style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              onTap: () {
                _notifier.setZone(zone);
                _addressCtrl.text = zone.name;
                Navigator.pop(ctx);
              },
            );
          },
        );
      },
    );
  }
}

class _TypeButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _TypeButton({required this.icon, required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? theme.colorScheme.primary : theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outline),
        ),
        child: Column(
          children: [
            Icon(icon, size: 24, color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.secondary),
            const SizedBox(height: 4),
            Text(label, style: theme.textTheme.labelMedium?.copyWith(
              color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.secondary,
            )),
          ],
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;

  const _SummaryRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: theme.textTheme.bodyLarge),
          Text(value, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
