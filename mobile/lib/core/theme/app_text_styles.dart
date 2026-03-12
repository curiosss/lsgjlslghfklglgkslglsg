import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

abstract class AppTextStyles {
  static TextTheme get textTheme => TextTheme(
        headlineLarge: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w700),
        headlineMedium: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700),
        titleLarge: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        titleMedium: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
        bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400),
        bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400),
        bodySmall: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400),
        labelLarge: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600),
        labelMedium: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500),
        labelSmall: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w500),
      );
}
