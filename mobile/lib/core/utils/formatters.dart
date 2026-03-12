import 'package:intl/intl.dart';

abstract class Formatters {
  static String price(double value) {
    final formatted = value.toStringAsFixed(2).replaceAll('.', ',');
    return '$formatted м.';
  }

  static String priceRaw(double value) {
    return value.toStringAsFixed(2).replaceAll('.', ',');
  }

  static String date(DateTime date) {
    return DateFormat('dd.MM.yyyy').format(date);
  }

  static String dateShort(DateTime date) {
    return DateFormat('dd.MM.yyyy').format(date);
  }
}
