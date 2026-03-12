import 'package:flutter/material.dart';

abstract class AppColors {
  // Light
  static const ColorScheme lightScheme = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFF000000),
    onPrimary: Color(0xFFFFFFFF),
    secondary: Color(0xFF666666),
    onSecondary: Color(0xFFFFFFFF),
    error: Color(0xFFD32F2F),
    onError: Color(0xFFFFFFFF),
    surface: Color(0xFFF5F5F5),
    onSurface: Color(0xFF1A1A1A),
    surfaceContainerHighest: Color(0xFFEEEEEE),
    outline: Color(0xFFE0E0E0),
    inversePrimary: Color(0xFFFFFFFF),
  );

  // Dark
  static const ColorScheme darkScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFFFFFFFF),
    onPrimary: Color(0xFF000000),
    secondary: Color(0xFF999999),
    onSecondary: Color(0xFF000000),
    error: Color(0xFFEF5350),
    onError: Color(0xFF000000),
    surface: Color(0xFF1A1A1A),
    onSurface: Color(0xFFE0E0E0),
    surfaceContainerHighest: Color(0xFF2A2A2A),
    outline: Color(0xFF333333),
    inversePrimary: Color(0xFF000000),
  );
}
