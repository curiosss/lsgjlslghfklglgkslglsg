import 'package:flutter/foundation.dart';
import 'package:commerce/features/order/data/order_repository.dart';
import 'package:commerce/features/order/data/models/delivery_zone_model.dart';
import 'package:commerce/features/order/data/models/time_slot_model.dart';

class CheckoutNotifier extends ChangeNotifier {
  final OrderRepository _repository;

  CheckoutNotifier(this._repository);

  bool _isLoading = false;
  bool _isSubmitting = false;
  String? _error;

  List<DeliveryZone> _zones = [];
  List<TimeSlot> _timeSlots = [];

  bool _isDelivery = true;
  DateTime _selectedDate = DateTime.now();
  TimeSlot? _selectedTimeSlot;
  DeliveryZone? _selectedZone;

  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get error => _error;
  List<DeliveryZone> get zones => _zones;
  List<TimeSlot> get timeSlots => _timeSlots;
  bool get isDelivery => _isDelivery;
  DateTime get selectedDate => _selectedDate;
  TimeSlot? get selectedTimeSlot => _selectedTimeSlot;
  DeliveryZone? get selectedZone => _selectedZone;
  double get deliveryFee => _isDelivery ? (_selectedZone?.deliveryPrice ?? 0) : 0;

  Future<void> loadCheckoutData() async {
    _isLoading = true;
    notifyListeners();

    try {
      final results = await Future.wait([
        _repository.getDeliveryZones(),
        _repository.getTimeSlots(),
      ]);
      _zones = results[0] as List<DeliveryZone>;
      _timeSlots = results[1] as List<TimeSlot>;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  void setDeliveryType(bool isDelivery) {
    _isDelivery = isDelivery;
    if (!isDelivery) _selectedZone = null;
    notifyListeners();
  }

  void setDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  void setTimeSlot(TimeSlot slot) {
    _selectedTimeSlot = slot;
    notifyListeners();
  }

  void setZone(DeliveryZone zone) {
    _selectedZone = zone;
    notifyListeners();
  }

  Future<bool> submitOrder({
    required List<Map<String, dynamic>> items,
    required double subtotal,
    required String fullName,
    required String phone,
    required String address,
    String? note,
  }) async {
    _isSubmitting = true;
    _error = null;
    notifyListeners();

    try {
      await _repository.createOrder({
        'type': _isDelivery ? 'delivery' : 'pickup',
        'delivery_date': '${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
        'time_slot': _selectedTimeSlot?.label ?? '',
        'time_slot_id': _selectedTimeSlot?.id,
        'delivery_zone_id': _selectedZone?.id,
        'full_name': fullName,
        'phone': phone,
        'address': address,
        'note': note ?? '',
        'items': items,
        'subtotal': subtotal,
        'delivery_fee': deliveryFee,
        'total': subtotal + deliveryFee,
      });
      _isSubmitting = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isSubmitting = false;
      notifyListeners();
      return false;
    }
  }
}
