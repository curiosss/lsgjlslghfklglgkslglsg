import 'package:commerce/core/network/api_client.dart';
import 'package:commerce/core/network/api_endpoints.dart';
import 'package:commerce/features/home/data/models/banner_model.dart';
import 'package:commerce/features/catalog/data/models/brand_model.dart';
import 'package:commerce/features/catalog/data/models/category_model.dart';
import 'package:commerce/features/product/data/models/product_model.dart';

class HomeData {
  final List<BannerModel> banners;
  final List<Brand> brands;
  final List<Category> categories;
  final List<Product> newProducts;
  final List<Product> discountProducts;

  HomeData({
    required this.banners,
    required this.brands,
    required this.categories,
    required this.newProducts,
    required this.discountProducts,
  });
}

class HomeRepository {
  final ApiClient _client;

  HomeRepository(this._client);

  Future<HomeData> getHomeData() async {
    final response = await _client.get(ApiEndpoints.home);
    final responseData = response.data as Map<String, dynamic>;
    final data = responseData['data'] as Map<String, dynamic>? ?? {};

    final bannersJson = data['banners'] as List<dynamic>? ?? [];
    final brandsJson = data['brands'] as List<dynamic>? ?? [];
    final categoriesJson = data['categories'] as List<dynamic>? ?? [];
    final newProductsJson = data['new_products'] as List<dynamic>? ?? [];
    final discountProductsJson =
        data['discount_products'] as List<dynamic>? ?? [];

    return HomeData(
      banners: bannersJson
          .map((e) => BannerModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      brands: brandsJson
          .map((e) => Brand.fromJson(e as Map<String, dynamic>))
          .toList(),
      categories: categoriesJson
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList(),
      newProducts: newProductsJson
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList(),
      discountProducts: discountProductsJson
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
