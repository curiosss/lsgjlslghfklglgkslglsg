import 'package:flutter/foundation.dart';
import 'package:commerce/features/cart/data/cart_repository.dart';
import 'package:commerce/features/cart/data/models/cart_item_model.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class CartNotifier extends ChangeNotifier {
  final CartRepository _repository;
  List<CartItem> _items = [];

  CartNotifier(this._repository);

  List<CartItem> get items => _items;
  double get totalPrice => _items.fold(0, (sum, item) => sum + item.totalPrice);
  int get totalCount => _items.fold(0, (sum, item) => sum + item.quantity);
  bool get isEmpty => _items.isEmpty;

  int getQuantity(int productId) {
    final item = _items.where((i) => i.product.id == productId).firstOrNull;
    return item?.quantity ?? 0;
  }

  bool isInCart(int productId) => _items.any((i) => i.product.id == productId);

  void loadCart() {
    _items = _repository.getCart();
    notifyListeners();
  }

  Future<void> addToCart(Product product) async {
    final index = _items.indexWhere((i) => i.product.id == product.id);
    if (index >= 0) {
      _items[index].quantity++;
    } else {
      _items.add(CartItem(product: product));
    }
    await _repository.saveCart(_items);
    notifyListeners();
  }

  Future<void> removeFromCart(int productId) async {
    _items.removeWhere((i) => i.product.id == productId);
    await _repository.saveCart(_items);
    notifyListeners();
  }

  Future<void> updateQuantity(int productId, int qty) async {
    if (qty <= 0) {
      await removeFromCart(productId);
      return;
    }
    final index = _items.indexWhere((i) => i.product.id == productId);
    if (index >= 0) {
      _items[index].quantity = qty;
      await _repository.saveCart(_items);
      notifyListeners();
    }
  }

  Future<void> clearCart() async {
    _items.clear();
    await _repository.saveCart(_items);
    notifyListeners();
  }
}
