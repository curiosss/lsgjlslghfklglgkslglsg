class SubCategory {
  final int id;
  final String name;
  final String? imageUrl;
  final int parentId;

  const SubCategory({
    required this.id,
    required this.name,
    this.imageUrl,
    required this.parentId,
  });

  factory SubCategory.fromJson(Map<String, dynamic> json) {
    return SubCategory(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      imageUrl: json['image_url'] as String?,
      parentId: json['category_id'] as int? ?? json['parent_id'] as int? ?? 0,
    );
  }
}
