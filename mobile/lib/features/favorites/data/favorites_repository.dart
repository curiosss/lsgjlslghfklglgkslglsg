import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:commerce/core/constants/storage_keys.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class FavoritesRepository {
  final SharedPreferences _prefs;

  FavoritesRepository(this._prefs);

  List<Product> getFavorites() {
    final json = _prefs.getString(StorageKeys.favorites);
    if (json == null || json.isEmpty) return [];
    final list = jsonDecode(json) as List<dynamic>;
    return list.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> saveFavorites(List<Product> products) async {
    final json = jsonEncode(products.map((e) => e.toJson()).toList());
    await _prefs.setString(StorageKeys.favorites, json);
  }

  Future<void> addFavorite(Product product) async {
    final list = getFavorites();
    if (!list.any((p) => p.id == product.id)) {
      list.add(product);
      await saveFavorites(list);
    }
  }

  Future<void> removeFavorite(int productId) async {
    final list = getFavorites();
    list.removeWhere((p) => p.id == productId);
    await saveFavorites(list);
  }

  bool isFavorite(int productId) {
    return getFavorites().any((p) => p.id == productId);
  }
}
