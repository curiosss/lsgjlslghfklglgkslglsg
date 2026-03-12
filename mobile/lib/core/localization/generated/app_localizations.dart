import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ru.dart';
import 'app_localizations_tk.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ru'),
    Locale('tk'),
  ];

  /// No description provided for @home.
  ///
  /// In ru, this message translates to:
  /// **'Главная'**
  String get home;

  /// No description provided for @categories.
  ///
  /// In ru, this message translates to:
  /// **'Категории'**
  String get categories;

  /// No description provided for @cart.
  ///
  /// In ru, this message translates to:
  /// **'Корзина'**
  String get cart;

  /// No description provided for @favorites.
  ///
  /// In ru, this message translates to:
  /// **'Избранное'**
  String get favorites;

  /// No description provided for @orders.
  ///
  /// In ru, this message translates to:
  /// **'Заказы'**
  String get orders;

  /// No description provided for @search.
  ///
  /// In ru, this message translates to:
  /// **'Поиск'**
  String get search;

  /// No description provided for @newArrivals.
  ///
  /// In ru, this message translates to:
  /// **'Новинки'**
  String get newArrivals;

  /// No description provided for @discounts.
  ///
  /// In ru, this message translates to:
  /// **'Скидки'**
  String get discounts;

  /// No description provided for @addToCart.
  ///
  /// In ru, this message translates to:
  /// **'В корзину'**
  String get addToCart;

  /// No description provided for @pieces.
  ///
  /// In ru, this message translates to:
  /// **'шт'**
  String get pieces;

  /// No description provided for @brands.
  ///
  /// In ru, this message translates to:
  /// **'Бренды'**
  String get brands;

  /// No description provided for @searchBrand.
  ///
  /// In ru, this message translates to:
  /// **'Поиск'**
  String get searchBrand;

  /// No description provided for @emptyCart.
  ///
  /// In ru, this message translates to:
  /// **'Ваша корзина пуста'**
  String get emptyCart;

  /// No description provided for @emptyCartSubtitle.
  ///
  /// In ru, this message translates to:
  /// **'Добавьте товары в корзину\nчтобы сделать заказ'**
  String get emptyCartSubtitle;

  /// No description provided for @clearCart.
  ///
  /// In ru, this message translates to:
  /// **'Очистить корзину'**
  String get clearCart;

  /// No description provided for @checkout.
  ///
  /// In ru, this message translates to:
  /// **'Оформить заказ'**
  String get checkout;

  /// No description provided for @emptyFavorites.
  ///
  /// In ru, this message translates to:
  /// **'Ваш список избранных\nтоваров пуст'**
  String get emptyFavorites;

  /// No description provided for @emptyFavoritesSubtitle.
  ///
  /// In ru, this message translates to:
  /// **'Добавьте товары в список избранных\nчтобы сохранить их на устройстве'**
  String get emptyFavoritesSubtitle;

  /// No description provided for @orderHistory.
  ///
  /// In ru, this message translates to:
  /// **'История заказов'**
  String get orderHistory;

  /// No description provided for @delivery.
  ///
  /// In ru, this message translates to:
  /// **'Доставка'**
  String get delivery;

  /// No description provided for @pickup.
  ///
  /// In ru, this message translates to:
  /// **'Самовывоз'**
  String get pickup;

  /// No description provided for @allOrders.
  ///
  /// In ru, this message translates to:
  /// **'Все'**
  String get allOrders;

  /// No description provided for @newOrders.
  ///
  /// In ru, this message translates to:
  /// **'Новые'**
  String get newOrders;

  /// No description provided for @confirmed.
  ///
  /// In ru, this message translates to:
  /// **'Подтвержден'**
  String get confirmed;

  /// No description provided for @shipped.
  ///
  /// In ru, this message translates to:
  /// **'Отправлен'**
  String get shipped;

  /// No description provided for @delivered.
  ///
  /// In ru, this message translates to:
  /// **'Доставлен'**
  String get delivered;

  /// No description provided for @cancelled.
  ///
  /// In ru, this message translates to:
  /// **'Отменен'**
  String get cancelled;

  /// No description provided for @noResults.
  ///
  /// In ru, this message translates to:
  /// **'По вашему запросу ничего\nне найдено'**
  String get noResults;

  /// No description provided for @orderNumber.
  ///
  /// In ru, this message translates to:
  /// **'Заказ'**
  String get orderNumber;

  /// No description provided for @items.
  ///
  /// In ru, this message translates to:
  /// **'товар(ов)'**
  String get items;

  /// No description provided for @total.
  ///
  /// In ru, this message translates to:
  /// **'Итого'**
  String get total;

  /// No description provided for @orderDelivery.
  ///
  /// In ru, this message translates to:
  /// **'Заказ - доставка'**
  String get orderDelivery;

  /// No description provided for @orderType.
  ///
  /// In ru, this message translates to:
  /// **'Вид заказа'**
  String get orderType;

  /// No description provided for @fillFields.
  ///
  /// In ru, this message translates to:
  /// **'Заполните поля'**
  String get fillFields;

  /// No description provided for @fullName.
  ///
  /// In ru, this message translates to:
  /// **'Полное Имя'**
  String get fullName;

  /// No description provided for @phone.
  ///
  /// In ru, this message translates to:
  /// **'Номер телефона'**
  String get phone;

  /// No description provided for @address.
  ///
  /// In ru, this message translates to:
  /// **'Адрес'**
  String get address;

  /// No description provided for @note.
  ///
  /// In ru, this message translates to:
  /// **'Заметка'**
  String get note;

  /// No description provided for @cartTotal.
  ///
  /// In ru, this message translates to:
  /// **'Сумма корзины:'**
  String get cartTotal;

  /// No description provided for @deliveryFee.
  ///
  /// In ru, this message translates to:
  /// **'Стоимость доставки:'**
  String get deliveryFee;

  /// No description provided for @placeOrder.
  ///
  /// In ru, this message translates to:
  /// **'Заказать'**
  String get placeOrder;

  /// No description provided for @fieldRequired.
  ///
  /// In ru, this message translates to:
  /// **'Поле не должно быть пустым'**
  String get fieldRequired;

  /// No description provided for @phoneFieldRequired.
  ///
  /// In ru, this message translates to:
  /// **'Поле \"Номер телефона\" не должно быть пустым'**
  String get phoneFieldRequired;

  /// No description provided for @nameFieldRequired.
  ///
  /// In ru, this message translates to:
  /// **'Поле \"Полное Имя\" не должно быть пустым'**
  String get nameFieldRequired;

  /// No description provided for @addressFieldRequired.
  ///
  /// In ru, this message translates to:
  /// **'Поле \"Адрес\" не должно быть пустым'**
  String get addressFieldRequired;

  /// No description provided for @selectDate.
  ///
  /// In ru, this message translates to:
  /// **'Выберите дату'**
  String get selectDate;

  /// No description provided for @selectTimeSlot.
  ///
  /// In ru, this message translates to:
  /// **'Выберите время'**
  String get selectTimeSlot;

  /// No description provided for @lowPrice.
  ///
  /// In ru, this message translates to:
  /// **'Низкие цены'**
  String get lowPrice;

  /// No description provided for @highPrice.
  ///
  /// In ru, this message translates to:
  /// **'Высокие цены'**
  String get highPrice;

  /// No description provided for @totalCount.
  ///
  /// In ru, this message translates to:
  /// **'Всего:\n{count} товар(ов)'**
  String totalCount(int count);

  /// No description provided for @barcode.
  ///
  /// In ru, this message translates to:
  /// **'Штрих-код'**
  String get barcode;

  /// No description provided for @brand.
  ///
  /// In ru, this message translates to:
  /// **'Бренд'**
  String get brand;

  /// No description provided for @relatedProducts.
  ///
  /// In ru, this message translates to:
  /// **'Другие товары'**
  String get relatedProducts;

  /// No description provided for @profile.
  ///
  /// In ru, this message translates to:
  /// **'Профиль'**
  String get profile;

  /// No description provided for @theme.
  ///
  /// In ru, this message translates to:
  /// **'Тема оформления'**
  String get theme;

  /// No description provided for @language.
  ///
  /// In ru, this message translates to:
  /// **'Язык / Dil'**
  String get language;

  /// No description provided for @contactUs.
  ///
  /// In ru, this message translates to:
  /// **'Связаться с нами'**
  String get contactUs;

  /// No description provided for @about.
  ///
  /// In ru, this message translates to:
  /// **'О приложении'**
  String get about;

  /// No description provided for @lightTheme.
  ///
  /// In ru, this message translates to:
  /// **'Светлая'**
  String get lightTheme;

  /// No description provided for @darkTheme.
  ///
  /// In ru, this message translates to:
  /// **'Тёмная'**
  String get darkTheme;

  /// No description provided for @systemTheme.
  ///
  /// In ru, this message translates to:
  /// **'Системная'**
  String get systemTheme;

  /// No description provided for @selectLanguage.
  ///
  /// In ru, this message translates to:
  /// **'Выберите язык'**
  String get selectLanguage;

  /// No description provided for @russian.
  ///
  /// In ru, this message translates to:
  /// **'Русский'**
  String get russian;

  /// No description provided for @turkmen.
  ///
  /// In ru, this message translates to:
  /// **'Türkmen'**
  String get turkmen;

  /// No description provided for @appVersion.
  ///
  /// In ru, this message translates to:
  /// **'v1.0.0'**
  String get appVersion;

  /// No description provided for @manat.
  ///
  /// In ru, this message translates to:
  /// **'м.'**
  String get manat;

  /// No description provided for @cancel.
  ///
  /// In ru, this message translates to:
  /// **'Отмена'**
  String get cancel;

  /// No description provided for @confirm.
  ///
  /// In ru, this message translates to:
  /// **'Подтвердить'**
  String get confirm;

  /// No description provided for @delete.
  ///
  /// In ru, this message translates to:
  /// **'Удалить'**
  String get delete;

  /// No description provided for @clearCartConfirm.
  ///
  /// In ru, this message translates to:
  /// **'Очистить корзину?'**
  String get clearCartConfirm;

  /// No description provided for @orderSuccess.
  ///
  /// In ru, this message translates to:
  /// **'Заказ успешно оформлен!'**
  String get orderSuccess;

  /// No description provided for @priceFormat.
  ///
  /// In ru, this message translates to:
  /// **'{price} м.'**
  String priceFormat(String price);

  /// No description provided for @itemCount.
  ///
  /// In ru, this message translates to:
  /// **'{count} шт'**
  String itemCount(int count);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ru', 'tk'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ru':
      return AppLocalizationsRu();
    case 'tk':
      return AppLocalizationsTk();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
