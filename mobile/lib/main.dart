import 'package:flutter/material.dart';
import 'package:commerce/core/di/injection.dart';
import 'package:commerce/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureDependencies();
  runApp(const CommerceApp());
}
