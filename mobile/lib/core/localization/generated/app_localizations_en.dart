// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get home => 'Home';

  @override
  String get categories => 'Categories';

  @override
  String get cart => 'Cart';

  @override
  String get favorites => 'Favorites';

  @override
  String get orders => 'Orders';

  @override
  String get search => 'Search';

  @override
  String get newArrivals => 'New Arrivals';

  @override
  String get discounts => 'Discounts';

  @override
  String get addToCart => 'Add to Cart';

  @override
  String get pieces => 'pcs';

  @override
  String get brands => 'Brands';

  @override
  String get searchBrand => 'Search';

  @override
  String get emptyCart => 'Your cart is empty';

  @override
  String get emptyCartSubtitle => 'Add items to your cart\nto place an order';

  @override
  String get clearCart => 'Clear cart';

  @override
  String get checkout => 'Checkout';

  @override
  String get emptyFavorites => 'Your favorites list\nis empty';

  @override
  String get emptyFavoritesSubtitle =>
      'Add items to your favorites\nto save them on your device';

  @override
  String get orderHistory => 'Order History';

  @override
  String get delivery => 'Delivery';

  @override
  String get pickup => 'Pickup';

  @override
  String get allOrders => 'All';

  @override
  String get newOrders => 'New';

  @override
  String get confirmed => 'Confirmed';

  @override
  String get shipped => 'Shipped';

  @override
  String get delivered => 'Delivered';

  @override
  String get cancelled => 'Cancelled';

  @override
  String get noResults => 'No results found\nfor your search';

  @override
  String get orderNumber => 'Order';

  @override
  String get items => 'item(s)';

  @override
  String get total => 'Total';

  @override
  String get orderDelivery => 'Order - Delivery';

  @override
  String get orderType => 'Order type';

  @override
  String get fillFields => 'Fill in the fields';

  @override
  String get fullName => 'Full Name';

  @override
  String get phone => 'Phone number';

  @override
  String get address => 'Address';

  @override
  String get note => 'Note';

  @override
  String get cartTotal => 'Cart total:';

  @override
  String get deliveryFee => 'Delivery fee:';

  @override
  String get placeOrder => 'Place Order';

  @override
  String get fieldRequired => 'This field is required';

  @override
  String get phoneFieldRequired => 'Phone number is required';

  @override
  String get nameFieldRequired => 'Full Name is required';

  @override
  String get addressFieldRequired => 'Address is required';

  @override
  String get selectDate => 'Select date';

  @override
  String get selectTimeSlot => 'Select time';

  @override
  String get lowPrice => 'Low prices';

  @override
  String get highPrice => 'High prices';

  @override
  String totalCount(int count) {
    return 'Total:\n$count item(s)';
  }

  @override
  String get barcode => 'Barcode';

  @override
  String get brand => 'Brand';

  @override
  String get relatedProducts => 'Related Products';

  @override
  String get profile => 'Profile';

  @override
  String get theme => 'Theme';

  @override
  String get language => 'Language';

  @override
  String get contactUs => 'Contact Us';

  @override
  String get about => 'About';

  @override
  String get lightTheme => 'Light';

  @override
  String get darkTheme => 'Dark';

  @override
  String get systemTheme => 'System';

  @override
  String get selectLanguage => 'Select language';

  @override
  String get russian => 'Русский';

  @override
  String get turkmen => 'Türkmen';

  @override
  String get appVersion => 'v1.0.0';

  @override
  String get manat => 'm.';

  @override
  String get cancel => 'Cancel';

  @override
  String get confirm => 'Confirm';

  @override
  String get delete => 'Delete';

  @override
  String get clearCartConfirm => 'Clear the cart?';

  @override
  String get orderSuccess => 'Order placed successfully!';

  @override
  String priceFormat(String price) {
    return '$price m.';
  }

  @override
  String itemCount(int count) {
    return '$count pcs';
  }
}
