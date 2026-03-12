import 'package:flutter/foundation.dart' hide Category;
import 'package:commerce/features/home/data/home_repository.dart';
import 'package:commerce/features/home/data/models/banner_model.dart';
import 'package:commerce/features/catalog/data/models/brand_model.dart';
import 'package:commerce/features/catalog/data/models/category_model.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class HomeNotifier extends ChangeNotifier {
  final HomeRepository _repository;

  HomeNotifier(this._repository);

  bool _isLoading = false;
  String? _error;
  List<BannerModel> _banners = [];
  List<Brand> _brands = [];
  List<Category> _categories = [];
  List<Product> _newProducts = [];
  List<Product> _discountProducts = [];

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<BannerModel> get banners => _banners;
  List<Brand> get brands => _brands;
  List<Category> get categories => _categories;
  List<Product> get newProducts => _newProducts;
  List<Product> get discountProducts => _discountProducts;

  Future<void> loadHome() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _repository.getHomeData();
      _banners = data.banners;
      _brands = data.brands;
      _categories = data.categories;
      _newProducts = data.newProducts;
      _discountProducts = data.discountProducts;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }
}
