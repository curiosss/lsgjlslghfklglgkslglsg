import 'package:dio/dio.dart';
import 'package:commerce/core/network/models/api_error.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final apiError = ApiError.fromDioException(err);
    handler.reject(DioException(
      requestOptions: err.requestOptions,
      error: apiError,
      type: err.type,
      response: err.response,
    ));
  }
}
