import 'package:flutter/foundation.dart';
import 'package:commerce/features/search/data/search_repository.dart';
import 'package:commerce/features/product/data/models/product_model.dart';
import 'package:commerce/core/utils/debouncer.dart';
import 'package:commerce/core/constants/app_constants.dart';

class SearchNotifier extends ChangeNotifier {
  final SearchRepository _repository;
  final _debouncer = Debouncer(duration: AppConstants.searchDebounce);

  SearchNotifier(this._repository);

  bool _isLoading = false;
  String _query = '';
  List<Product> _results = [];

  bool get isLoading => _isLoading;
  String get query => _query;
  List<Product> get results => _results;
  bool get hasQuery => _query.isNotEmpty;

  void setQuery(String query) {
    _query = query;
    if (query.isEmpty) {
      _results = [];
      notifyListeners();
      return;
    }
    _debouncer.run(() => _search());
  }

  Future<void> _search() async {
    _isLoading = true;
    notifyListeners();

    try {
      _results = await _repository.search(_query);
    } catch (_) {
      _results = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  @override
  void dispose() {
    _debouncer.dispose();
    super.dispose();
  }
}
