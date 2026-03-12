import 'package:commerce/core/network/api_client.dart';
import 'package:commerce/core/network/api_endpoints.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class ProductListResult {
  final List<Product> products;
  final int total;

  ProductListResult({required this.products, required this.total});
}

class ProductRepository {
  final ApiClient _client;

  ProductRepository(this._client);

  Future<ProductListResult> getProducts({
    int? categoryId,
    int? subcategoryId,
    int? brandId,
    String? sort,
    int page = 1,
    int limit = 20,
    String? search,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (categoryId != null) params['category_id'] = categoryId;
    if (subcategoryId != null) params['subcategory_id'] = subcategoryId;
    if (brandId != null) params['brand_id'] = brandId;
    if (sort != null) params['sort'] = sort;
    if (search != null && search.isNotEmpty) params['search'] = search;

    final response = await _client.get(ApiEndpoints.products, queryParameters: params);
    final data = response.data;

    List<dynamic> list;
    int total;

    if (data is Map<String, dynamic>) {
      list = data['data'] as List<dynamic>? ?? [];
      total = data['total'] as int? ?? list.length;
    } else if (data is List) {
      list = data;
      total = list.length;
    } else {
      list = [];
      total = 0;
    }

    return ProductListResult(
      products: list.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList(),
      total: total,
    );
  }

  Future<Product> getProductById(int id) async {
    final response = await _client.get(ApiEndpoints.productById(id));
    final data = response.data;
    final json = data is Map<String, dynamic>
        ? (data['data'] as Map<String, dynamic>? ?? data)
        : data as Map<String, dynamic>;
    return Product.fromJson(json);
  }

  Future<List<Product>> getRelatedProducts(int productId, {int limit = 10}) async {
    final response = await _client.get(
      ApiEndpoints.relatedProducts(productId),
      queryParameters: {'limit': limit},
    );
    final data = response.data;
    List<dynamic> list;
    if (data is Map<String, dynamic>) {
      list = data['data'] as List<dynamic>? ?? [];
    } else if (data is List) {
      list = data;
    } else {
      list = [];
    }
    return list.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();
  }
}
