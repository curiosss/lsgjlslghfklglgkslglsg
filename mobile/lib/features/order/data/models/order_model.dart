class Order {
  final int id;
  final String? orderNumber;
  final DateTime createdAt;
  final String type;
  final String status;
  final List<OrderItem> items;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String? fullName;
  final String? phone;
  final String? address;
  final String? note;
  final String? deliveryDate;
  final String? timeSlot;

  const Order({
    required this.id,
    this.orderNumber,
    required this.createdAt,
    required this.type,
    required this.status,
    this.items = const [],
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    this.fullName,
    this.phone,
    this.address,
    this.note,
    this.deliveryDate,
    this.timeSlot,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as int,
      orderNumber: json['order_number'] as String?,
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.now(),
      type: json['type'] as String? ?? 'delivery',
      status: json['status'] as String? ?? 'new',
      items: (json['items'] as List<dynamic>?)
              ?.map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0,
      deliveryFee: (json['delivery_fee'] as num?)?.toDouble() ?? 0,
      total: (json['total'] as num?)?.toDouble() ?? 0,
      fullName: json['full_name'] as String?,
      phone: json['phone'] as String?,
      address: json['address'] as String?,
      note: json['note'] as String?,
      deliveryDate: json['delivery_date'] as String?,
      timeSlot: json['time_slot'] as String?,
    );
  }
}

class OrderItem {
  final int productId;
  final String productName;
  final int quantity;
  final double price;

  const OrderItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      productId: json['product_id'] as int? ?? 0,
      productName: json['product_name'] as String? ?? '',
      quantity: json['quantity'] as int? ?? 0,
      price: (json['price'] as num?)?.toDouble() ?? 0,
    );
  }
}
