import 'package:flutter/foundation.dart';
import 'package:commerce/features/catalog/data/catalog_repository.dart';
import 'package:commerce/features/catalog/data/models/brand_model.dart';

class BrandsNotifier extends ChangeNotifier {
  final CatalogRepository _repository;

  BrandsNotifier(this._repository);

  bool _isLoading = false;
  String? _error;
  List<Brand> _brands = [];
  String _searchQuery = '';

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Brand> get brands => _brands;
  String get searchQuery => _searchQuery;

  List<Brand> get filteredBrands {
    if (_searchQuery.isEmpty) return _brands;
    final q = _searchQuery.toLowerCase();
    return _brands.where((b) => b.name.toLowerCase().contains(q)).toList();
  }

  Future<void> loadBrands() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _brands = await _repository.getBrands();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }
}
