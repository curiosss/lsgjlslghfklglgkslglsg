import 'package:flutter/foundation.dart';
import 'package:commerce/core/constants/app_constants.dart';
import 'package:commerce/features/product/data/product_repository.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class ProductListNotifier extends ChangeNotifier {
  final ProductRepository _repository;

  ProductListNotifier(this._repository);

  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _error;
  List<Product> _products = [];
  int _total = 0;
  int _page = 1;
  String? _sort;

  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get error => _error;
  List<Product> get products => _products;
  int get total => _total;
  bool get hasMore => _products.length < _total;
  String? get sort => _sort;

  int? _categoryId;
  int? _subcategoryId;
  int? _brandId;

  Future<void> loadProducts({
    int? categoryId,
    int? subcategoryId,
    int? brandId,
    String? sort,
  }) async {
    _categoryId = categoryId;
    _subcategoryId = subcategoryId;
    _brandId = brandId;
    _sort = sort;
    _page = 1;
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _repository.getProducts(
        categoryId: _categoryId,
        subcategoryId: _subcategoryId,
        brandId: _brandId,
        sort: _sort,
        page: _page,
        limit: AppConstants.paginationLimit,
      );
      _products = result.products;
      _total = result.total;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadMore() async {
    if (_isLoadingMore || !hasMore) return;
    _isLoadingMore = true;
    notifyListeners();

    try {
      _page++;
      final result = await _repository.getProducts(
        categoryId: _categoryId,
        subcategoryId: _subcategoryId,
        brandId: _brandId,
        sort: _sort,
        page: _page,
        limit: AppConstants.paginationLimit,
      );
      _products.addAll(result.products);
      _total = result.total;
    } catch (e) {
      _page--;
    }

    _isLoadingMore = false;
    notifyListeners();
  }

  void setSort(String? sort) {
    if (_sort == sort) return;
    _sort = sort;
    loadProducts(
      categoryId: _categoryId,
      subcategoryId: _subcategoryId,
      brandId: _brandId,
      sort: _sort,
    );
  }
}
