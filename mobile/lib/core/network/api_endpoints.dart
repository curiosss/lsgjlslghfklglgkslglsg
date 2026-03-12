abstract class ApiEndpoints {
  static const String home = '/home';
  static const String banners = '/banners';
  static const String categories = '/categories';
  static String subcategories(int categoryId) => '/categories/$categoryId/subcategories';
  static const String brands = '/brands';
  static const String products = '/products';
  static String productById(int id) => '/products/$id';
  static String relatedProducts(int id) => '/products/$id/related';
  static const String deliveryZones = '/delivery-zones';
  static const String timeSlots = '/time-slots';
  static const String orders = '/orders';
}
