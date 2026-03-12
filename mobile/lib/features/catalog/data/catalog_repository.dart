import 'package:commerce/core/network/api_client.dart';
import 'package:commerce/core/network/api_endpoints.dart';
import 'package:commerce/features/catalog/data/models/category_model.dart';
import 'package:commerce/features/catalog/data/models/subcategory_model.dart';
import 'package:commerce/features/catalog/data/models/brand_model.dart';

class CatalogRepository {
  final ApiClient _client;

  CatalogRepository(this._client);

  Future<List<Category>> getCategories() async {
    final response = await _client.get(ApiEndpoints.categories);
    final list = _extractList(response.data);
    return list.map((e) => Category.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<SubCategory>> getSubcategories(int categoryId) async {
    final response = await _client.get(ApiEndpoints.subcategories(categoryId));
    final list = _extractList(response.data);
    return list.map((e) => SubCategory.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Brand>> getBrands() async {
    final response = await _client.get(ApiEndpoints.brands);
    final list = _extractList(response.data);
    return list.map((e) => Brand.fromJson(e as Map<String, dynamic>)).toList();
  }

  List<dynamic> _extractList(dynamic data) {
    if (data is List) return data;
    if (data is Map<String, dynamic>) {
      return data['data'] as List<dynamic>? ?? [];
    }
    return [];
  }
}
