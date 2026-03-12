import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:commerce/core/constants/storage_keys.dart';
import 'package:commerce/features/cart/data/models/cart_item_model.dart';

class CartRepository {
  final SharedPreferences _prefs;

  CartRepository(this._prefs);

  List<CartItem> getCart() {
    final json = _prefs.getString(StorageKeys.cartItems);
    if (json == null || json.isEmpty) return [];
    final list = jsonDecode(json) as List<dynamic>;
    return list.map((e) => CartItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> saveCart(List<CartItem> items) async {
    final json = jsonEncode(items.map((e) => e.toJson()).toList());
    await _prefs.setString(StorageKeys.cartItems, json);
  }
}
