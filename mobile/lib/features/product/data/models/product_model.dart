class Product {
  final int id;
  final String name;
  final String brandName;
  final int? brandId;
  final int? categoryId;
  final int? subcategoryId;
  final String? description;
  final double price;
  final double? oldPrice;
  final int? discountPercent;
  final String imageUrl;
  final List<String>? images;
  final String? barcode;
  final bool isNew;
  final bool isDiscount;

  const Product({
    required this.id,
    required this.name,
    required this.brandName,
    this.brandId,
    this.categoryId,
    this.subcategoryId,
    this.description,
    required this.price,
    this.oldPrice,
    this.discountPercent,
    required this.imageUrl,
    this.images,
    this.barcode,
    this.isNew = false,
    this.isDiscount = false,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      brandName: json['brand_name'] as String? ?? '',
      brandId: json['brand_id'] as int?,
      categoryId: json['category_id'] as int?,
      subcategoryId: json['subcategory_id'] as int?,
      description: json['description'] as String?,
      price: (json['price'] as num?)?.toDouble() ?? 0,
      oldPrice: (json['old_price'] as num?)?.toDouble(),
      discountPercent: json['discount_percent'] as int?,
      imageUrl: json['image_url'] as String? ?? '',
      images: (json['images'] as List<dynamic>?)?.cast<String>(),
      barcode: json['barcode'] as String?,
      isNew: json['is_new'] as bool? ?? false,
      isDiscount: json['is_discount'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'brand_name': brandName,
      'brand_id': brandId,
      'category_id': categoryId,
      'subcategory_id': subcategoryId,
      'description': description,
      'price': price,
      'old_price': oldPrice,
      'discount_percent': discountPercent,
      'image_url': imageUrl,
      'images': images,
      'barcode': barcode,
      'is_new': isNew,
      'is_discount': isDiscount,
    };
  }
}
