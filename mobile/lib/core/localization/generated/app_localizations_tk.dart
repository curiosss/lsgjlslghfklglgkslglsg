// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Turkmen (`tk`).
class AppLocalizationsTk extends AppLocalizations {
  AppLocalizationsTk([String locale = 'tk']) : super(locale);

  @override
  String get home => 'Baş sahypa';

  @override
  String get categories => 'Kategoriýalar';

  @override
  String get cart => 'Sebet';

  @override
  String get favorites => 'Halanlarym';

  @override
  String get orders => 'Sargytlar';

  @override
  String get search => 'Gözleg';

  @override
  String get newArrivals => 'Täzeler';

  @override
  String get discounts => 'Arzanladyşlar';

  @override
  String get addToCart => 'Sebede goş';

  @override
  String get pieces => 'sany';

  @override
  String get brands => 'Brendler';

  @override
  String get searchBrand => 'Gözleg';

  @override
  String get emptyCart => 'Sebediňiz boş';

  @override
  String get emptyCartSubtitle => 'Sargyt etmek üçin\nharytlary sebede goşuň';

  @override
  String get clearCart => 'Sebedi arassala';

  @override
  String get checkout => 'Sargyt et';

  @override
  String get emptyFavorites => 'Halanlaryňyzyň sanawy boş';

  @override
  String get emptyFavoritesSubtitle =>
      'Enjamda saklamak üçin\nharytlary halanlara goşuň';

  @override
  String get orderHistory => 'Sargytlar taryhy';

  @override
  String get delivery => 'Eltip bermek';

  @override
  String get pickup => 'Özüň almak';

  @override
  String get allOrders => 'Hemmesi';

  @override
  String get newOrders => 'Täze';

  @override
  String get confirmed => 'Tassyklanan';

  @override
  String get shipped => 'Ugradylan';

  @override
  String get delivered => 'Gowşurylan';

  @override
  String get cancelled => 'Ýatyrylan';

  @override
  String get noResults => 'Siziň islegiňiz boýunça\nhiç zat tapylmady';

  @override
  String get orderNumber => 'Sargyt';

  @override
  String get items => 'haryt';

  @override
  String get total => 'Jemi';

  @override
  String get orderDelivery => 'Sargyt - eltip bermek';

  @override
  String get orderType => 'Sargyt görnüşi';

  @override
  String get fillFields => 'Meýdanlary dolduryň';

  @override
  String get fullName => 'Doly ady';

  @override
  String get phone => 'Telefon belgisi';

  @override
  String get address => 'Salgy';

  @override
  String get note => 'Bellik';

  @override
  String get cartTotal => 'Sebet bahasy:';

  @override
  String get deliveryFee => 'Eltip bermek bahasy:';

  @override
  String get placeOrder => 'Sargyt et';

  @override
  String get fieldRequired => 'Meýdan boş bolmaly däl';

  @override
  String get phoneFieldRequired =>
      '\"Telefon belgisi\" meýdany boş bolmaly däl';

  @override
  String get nameFieldRequired => '\"Doly ady\" meýdany boş bolmaly däl';

  @override
  String get addressFieldRequired => '\"Salgy\" meýdany boş bolmaly däl';

  @override
  String get selectDate => 'Senäni saýlaň';

  @override
  String get selectTimeSlot => 'Wagty saýlaň';

  @override
  String get lowPrice => 'Arzan bahalar';

  @override
  String get highPrice => 'Gymmat bahalar';

  @override
  String totalCount(int count) {
    return 'Jemi:\n$count haryt';
  }

  @override
  String get barcode => 'Ştrix-kod';

  @override
  String get brand => 'Brend';

  @override
  String get relatedProducts => 'Beýleki harytlar';

  @override
  String get profile => 'Profil';

  @override
  String get theme => 'Bezeg temasy';

  @override
  String get language => 'Dil / Язык';

  @override
  String get contactUs => 'Habarlaşmak';

  @override
  String get about => 'Programma barada';

  @override
  String get lightTheme => 'Açyk';

  @override
  String get darkTheme => 'Garaňky';

  @override
  String get systemTheme => 'Ulgam';

  @override
  String get selectLanguage => 'Dil saýlaň';

  @override
  String get russian => 'Русский';

  @override
  String get turkmen => 'Türkmen';

  @override
  String get appVersion => 'v1.0.0';

  @override
  String get manat => 'м.';

  @override
  String get cancel => 'Ýatyr';

  @override
  String get confirm => 'Tassykla';

  @override
  String get delete => 'Poz';

  @override
  String get clearCartConfirm => 'Sebedi arassalamalymy?';

  @override
  String get orderSuccess => 'Sargyt üstünlikli iberildi!';

  @override
  String priceFormat(String price) {
    return '$price м.';
  }

  @override
  String itemCount(int count) {
    return '$count sany';
  }
}
