// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get home => 'Главная';

  @override
  String get categories => 'Категории';

  @override
  String get cart => 'Корзина';

  @override
  String get favorites => 'Избранное';

  @override
  String get orders => 'Заказы';

  @override
  String get search => 'Поиск';

  @override
  String get newArrivals => 'Новинки';

  @override
  String get discounts => 'Скидки';

  @override
  String get addToCart => 'В корзину';

  @override
  String get pieces => 'шт';

  @override
  String get brands => 'Бренды';

  @override
  String get searchBrand => 'Поиск';

  @override
  String get emptyCart => 'Ваша корзина пуста';

  @override
  String get emptyCartSubtitle =>
      'Добавьте товары в корзину\nчтобы сделать заказ';

  @override
  String get clearCart => 'Очистить корзину';

  @override
  String get checkout => 'Оформить заказ';

  @override
  String get emptyFavorites => 'Ваш список избранных\nтоваров пуст';

  @override
  String get emptyFavoritesSubtitle =>
      'Добавьте товары в список избранных\nчтобы сохранить их на устройстве';

  @override
  String get orderHistory => 'История заказов';

  @override
  String get delivery => 'Доставка';

  @override
  String get pickup => 'Самовывоз';

  @override
  String get allOrders => 'Все';

  @override
  String get newOrders => 'Новые';

  @override
  String get confirmed => 'Подтвержден';

  @override
  String get shipped => 'Отправлен';

  @override
  String get delivered => 'Доставлен';

  @override
  String get cancelled => 'Отменен';

  @override
  String get noResults => 'По вашему запросу ничего\nне найдено';

  @override
  String get orderNumber => 'Заказ';

  @override
  String get items => 'товар(ов)';

  @override
  String get total => 'Итого';

  @override
  String get orderDelivery => 'Заказ - доставка';

  @override
  String get orderType => 'Вид заказа';

  @override
  String get fillFields => 'Заполните поля';

  @override
  String get fullName => 'Полное Имя';

  @override
  String get phone => 'Номер телефона';

  @override
  String get address => 'Адрес';

  @override
  String get note => 'Заметка';

  @override
  String get cartTotal => 'Сумма корзины:';

  @override
  String get deliveryFee => 'Стоимость доставки:';

  @override
  String get placeOrder => 'Заказать';

  @override
  String get fieldRequired => 'Поле не должно быть пустым';

  @override
  String get phoneFieldRequired =>
      'Поле \"Номер телефона\" не должно быть пустым';

  @override
  String get nameFieldRequired => 'Поле \"Полное Имя\" не должно быть пустым';

  @override
  String get addressFieldRequired => 'Поле \"Адрес\" не должно быть пустым';

  @override
  String get selectDate => 'Выберите дату';

  @override
  String get selectTimeSlot => 'Выберите время';

  @override
  String get lowPrice => 'Низкие цены';

  @override
  String get highPrice => 'Высокие цены';

  @override
  String totalCount(int count) {
    return 'Всего:\n$count товар(ов)';
  }

  @override
  String get barcode => 'Штрих-код';

  @override
  String get brand => 'Бренд';

  @override
  String get relatedProducts => 'Другие товары';

  @override
  String get profile => 'Профиль';

  @override
  String get theme => 'Тема оформления';

  @override
  String get language => 'Язык / Dil';

  @override
  String get contactUs => 'Связаться с нами';

  @override
  String get about => 'О приложении';

  @override
  String get lightTheme => 'Светлая';

  @override
  String get darkTheme => 'Тёмная';

  @override
  String get systemTheme => 'Системная';

  @override
  String get selectLanguage => 'Выберите язык';

  @override
  String get russian => 'Русский';

  @override
  String get turkmen => 'Türkmen';

  @override
  String get appVersion => 'v1.0.0';

  @override
  String get manat => 'м.';

  @override
  String get cancel => 'Отмена';

  @override
  String get confirm => 'Подтвердить';

  @override
  String get delete => 'Удалить';

  @override
  String get clearCartConfirm => 'Очистить корзину?';

  @override
  String get orderSuccess => 'Заказ успешно оформлен!';

  @override
  String priceFormat(String price) {
    return '$price м.';
  }

  @override
  String itemCount(int count) {
    return '$count шт';
  }
}
