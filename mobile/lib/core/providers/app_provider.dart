import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:commerce/core/constants/storage_keys.dart';

class AppProvider extends ChangeNotifier {
  final SharedPreferences _prefs;

  // Theme
  ThemeMode _themeMode = ThemeMode.system;
  ThemeMode get themeMode => _themeMode;

  // Locale
  Locale _locale = const Locale('ru');
  Locale get locale => _locale;

  AppProvider(this._prefs) {
    _loadSettings();
  }

  void _loadSettings() {
    // Load theme
    final themeValue = _prefs.getString(StorageKeys.themeMode) ?? 'system';
    _themeMode = ThemeMode.values.firstWhere(
      (e) => e.name == themeValue,
      orElse: () => ThemeMode.system,
    );

    // Load locale
    final localeCode = _prefs.getString(StorageKeys.locale) ?? 'ru';
    _locale = Locale(localeCode);
  }

  Future<void> setTheme(ThemeMode mode) async {
    _themeMode = mode;
    await _prefs.setString(StorageKeys.themeMode, mode.name);
    notifyListeners();
  }

  Future<void> setLocale(String languageCode) async {
    _locale = Locale(languageCode);
    await _prefs.setString(StorageKeys.locale, languageCode);
    notifyListeners();
  }

  String get languageCode => _locale.languageCode;
  bool get isRussian => _locale.languageCode == 'ru';
  bool get isTurkmen => _locale.languageCode == 'tk';
  bool get isEnglish => _locale.languageCode == 'en';
}
