import 'package:flutter/foundation.dart';
import 'package:commerce/features/favorites/data/favorites_repository.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class FavoritesNotifier extends ChangeNotifier {
  final FavoritesRepository _repository;
  List<Product> _favorites = [];

  FavoritesNotifier(this._repository);

  List<Product> get favorites => _favorites;
  bool get isEmpty => _favorites.isEmpty;

  bool isFavorite(int productId) => _favorites.any((p) => p.id == productId);

  void loadFavorites() {
    _favorites = _repository.getFavorites();
    notifyListeners();
  }

  Future<void> toggleFavorite(Product product) async {
    if (isFavorite(product.id)) {
      await _repository.removeFavorite(product.id);
    } else {
      await _repository.addFavorite(product);
    }
    _favorites = _repository.getFavorites();
    notifyListeners();
  }
}
