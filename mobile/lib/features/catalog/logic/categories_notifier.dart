import 'package:flutter/foundation.dart' hide Category;
import 'package:commerce/features/catalog/data/catalog_repository.dart';
import 'package:commerce/features/catalog/data/models/category_model.dart';

class CategoriesNotifier extends ChangeNotifier {
  final CatalogRepository _repository;

  CategoriesNotifier(this._repository);

  bool _isLoading = false;
  String? _error;
  List<Category> _categories = [];
  final Set<int> _expandedIds = {};

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Category> get categories => _categories;
  Set<int> get expandedIds => _expandedIds;

  bool isExpanded(int id) => _expandedIds.contains(id);

  Future<void> loadCategories() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _categories = await _repository.getCategories();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> toggleExpand(int categoryId) async {
    if (_expandedIds.contains(categoryId)) {
      _expandedIds.remove(categoryId);
      notifyListeners();
      return;
    }

    final index = _categories.indexWhere((c) => c.id == categoryId);
    if (index == -1) return;

    final category = _categories[index];
    if (category.subCategories.isEmpty) {
      try {
        final subs = await _repository.getSubcategories(categoryId);
        _categories[index] = category.copyWith(subCategories: subs);
      } catch (_) {}
    }

    _expandedIds.add(categoryId);
    notifyListeners();
  }
}
