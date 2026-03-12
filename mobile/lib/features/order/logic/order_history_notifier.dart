import 'package:flutter/foundation.dart';
import 'package:commerce/features/order/data/order_repository.dart';
import 'package:commerce/features/order/data/models/order_model.dart';

class OrderHistoryNotifier extends ChangeNotifier {
  final OrderRepository _repository;

  OrderHistoryNotifier(this._repository);

  bool _isLoading = false;
  String? _error;
  List<Order> _orders = [];
  String _typeFilter = 'delivery';
  String _statusFilter = 'all';

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Order> get orders => _orders;
  String get typeFilter => _typeFilter;
  String get statusFilter => _statusFilter;

  Future<void> loadOrders({String? phone}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await _repository.getOrders(
        type: _typeFilter,
        status: _statusFilter,
        phone: phone,
      );
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  void setTypeFilter(String type) {
    _typeFilter = type;
    loadOrders();
  }

  void setStatusFilter(String status) {
    _statusFilter = status;
    loadOrders();
  }
}
