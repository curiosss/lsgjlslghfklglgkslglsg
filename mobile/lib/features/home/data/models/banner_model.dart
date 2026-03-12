class BannerModel {
  final int id;
  final String imageUrl;
  final String? linkType;
  final String? linkValue;

  const BannerModel({
    required this.id,
    required this.imageUrl,
    this.linkType,
    this.linkValue,
  });

  factory BannerModel.fromJson(Map<String, dynamic> json) {
    return BannerModel(
      id: json['id'] as int,
      imageUrl: json['image_url'] as String? ?? '',
      linkType: json['link_type'] as String?,
      linkValue: json['link_value'] as String?,
    );
  }
}
