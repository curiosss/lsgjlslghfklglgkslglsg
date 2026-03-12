import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class QuantitySelector extends StatelessWidget {
  final int quantity;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final String unitLabel;

  const QuantitySelector({
    super.key,
    required this.quantity,
    required this.onIncrement,
    required this.onDecrement,
    this.unitLabel = 'шт',
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _SquareButton(
          icon: LucideIcons.minus,
          onTap: onDecrement,
          color: theme.colorScheme.primary,
          iconColor: theme.colorScheme.onPrimary,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            '$quantity $unitLabel',
            style: theme.textTheme.labelLarge,
          ),
        ),
        _SquareButton(
          icon: LucideIcons.plus,
          onTap: onIncrement,
          color: theme.colorScheme.primary,
          iconColor: theme.colorScheme.onPrimary,
        ),
      ],
    );
  }
}

class _SquareButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final Color color;
  final Color iconColor;

  const _SquareButton({
    required this.icon,
    required this.onTap,
    required this.color,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 18, color: iconColor),
      ),
    );
  }
}
