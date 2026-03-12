class Brand {
  final int id;
  final String name;
  final String? logoUrl;

  const Brand({required this.id, required this.name, this.logoUrl});

  factory Brand.fromJson(Map<String, dynamic> json) {
    return Brand(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      logoUrl: json['logo_url'] as String? ?? json['image_url'] as String?,
    );
  }
}
