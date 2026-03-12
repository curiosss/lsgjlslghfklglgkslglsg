import 'package:commerce/features/catalog/data/models/subcategory_model.dart';

class Category {
  final int id;
  final String name;
  final String? imageUrl;
  final List<SubCategory> subCategories;

  bool get hasSubCategories => subCategories.isNotEmpty;

  const Category({
    required this.id,
    required this.name,
    this.imageUrl,
    this.subCategories = const [],
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      imageUrl: json['image_url'] as String?,
      subCategories: (json['subcategories'] as List<dynamic>?)
              ?.map((e) => SubCategory.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Category copyWith({List<SubCategory>? subCategories}) {
    return Category(
      id: id,
      name: name,
      imageUrl: imageUrl,
      subCategories: subCategories ?? this.subCategories,
    );
  }
}
