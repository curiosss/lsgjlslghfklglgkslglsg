import 'package:dio/dio.dart';
import 'package:commerce/core/providers/app_provider.dart';

class LanguageInterceptor extends Interceptor {
  final AppProvider _appProvider;

  LanguageInterceptor(this._appProvider);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.queryParameters['lang'] = _appProvider.languageCode;
    handler.next(options);
  }
}
