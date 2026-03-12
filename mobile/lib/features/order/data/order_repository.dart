import 'package:commerce/core/network/api_client.dart';
import 'package:commerce/core/network/api_endpoints.dart';
import 'package:commerce/features/order/data/models/order_model.dart';
import 'package:commerce/features/order/data/models/delivery_zone_model.dart';
import 'package:commerce/features/order/data/models/time_slot_model.dart';

class OrderRepository {
  final ApiClient _client;

  OrderRepository(this._client);

  Future<List<DeliveryZone>> getDeliveryZones() async {
    final response = await _client.get(ApiEndpoints.deliveryZones);
    final list = _extractList(response.data);
    return list.map((e) => DeliveryZone.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<TimeSlot>> getTimeSlots() async {
    final response = await _client.get(ApiEndpoints.timeSlots);
    final list = _extractList(response.data);
    return list.map((e) => TimeSlot.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> createOrder(Map<String, dynamic> body) async {
    await _client.post(ApiEndpoints.orders, data: body);
  }

  Future<List<Order>> getOrders({
    String? type,
    String? status,
    String? phone,
    int page = 1,
    int limit = 20,
  }) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (type != null) params['type'] = type;
    if (status != null && status != 'all') params['status'] = status;
    if (phone != null) params['phone'] = phone;

    final response = await _client.get(ApiEndpoints.orders, queryParameters: params);
    final list = _extractList(response.data);
    return list.map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
  }

  List<dynamic> _extractList(dynamic data) {
    if (data is List) return data;
    if (data is Map<String, dynamic>) {
      return data['data'] as List<dynamic>? ?? [];
    }
    return [];
  }
}
