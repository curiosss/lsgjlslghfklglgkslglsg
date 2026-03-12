import 'package:dio/dio.dart';

class ApiError {
  final String message;
  final int? statusCode;

  ApiError({required this.message, this.statusCode});

  factory ApiError.fromDioException(DioException e) {
    String message;
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        message = 'Connection timeout';
      case DioExceptionType.badResponse:
        final data = e.response?.data;
        if (data is Map && data.containsKey('message')) {
          message = data['message'].toString();
        } else {
          message = 'Server error: ${e.response?.statusCode}';
        }
      case DioExceptionType.cancel:
        message = 'Request cancelled';
      default:
        message = 'Network error';
    }
    return ApiError(message: message, statusCode: e.response?.statusCode);
  }

  @override
  String toString() => message;
}
