class DeliveryZone {
  final int id;
  final String name;
  final double deliveryPrice;

  const DeliveryZone({
    required this.id,
    required this.name,
    required this.deliveryPrice,
  });

  factory DeliveryZone.fromJson(Map<String, dynamic> json) {
    return DeliveryZone(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      deliveryPrice: (json['delivery_price'] as num?)?.toDouble() ??
          (json['price'] as num?)?.toDouble() ??
          0,
    );
  }
}
