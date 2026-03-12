import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:commerce/core/localization/generated/app_localizations.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/core/providers/app_provider.dart';
import 'package:commerce/core/theme/app_theme.dart';
import 'package:commerce/core/router/app_router.dart';

class CommerceApp extends StatelessWidget {
  const CommerceApp({super.key});

  @override
  Widget build(BuildContext context) {
    final appProvider = getIt<AppProvider>();

    return ListenableBuilder(
      listenable: appProvider,
      builder: (context, _) {
        return MaterialApp.router(
          title: 'Commerce',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.light,
          darkTheme: AppTheme.dark,
          themeMode: appProvider.themeMode,
          locale: Locale(
            appProvider.locale.languageCode == 'tk'
                ? 'tr'
                : appProvider.languageCode,
          ),
          supportedLocales: AppLocalizations.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          routerConfig: goRouter,
        );
      },
    );
  }
}
