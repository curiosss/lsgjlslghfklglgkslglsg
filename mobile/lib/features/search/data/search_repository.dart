import 'package:commerce/core/network/api_client.dart';
import 'package:commerce/core/network/api_endpoints.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class SearchRepository {
  final ApiClient _client;

  SearchRepository(this._client);

  Future<List<Product>> search(String query, {int page = 1, int limit = 20}) async {
    final response = await _client.get(
      ApiEndpoints.products,
      queryParameters: {'search': query, 'page': page, 'limit': limit},
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
