import React, { createContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LanguageContext = createContext();

const translations = {
  en: {
    app_name: "Rajowalia",
    app_tagline: "Pakistan's Premium Store",
    home: "Home",
    electronics: "Electronics",
    dresses: "Dresses",
    karyania: "Karyania",
    deals: "Deals",
    search: "Search...",
    sign_in: "Sign In",
    sign_out: "Sign Out",
    wishlist: "Wishlist",
    my_orders: "My Orders",
    categories: "Categories",
    browse_by: "Browse By",
    see_all: "See All →",
    items: "items",
    hot_picks: "Hot Picks",
    trending_now: "Trending Now",
    all_items: "All Items",
    sugar: "Sugar",
    brown_sugar: "Brown Sugar",
    gurr: "Gurr",
    add_to_cart: "Add to Cart",
    sold_out: "Sold Out",
    added: "Added!",
    new_season: "New Season 2026 Collection",
    shop_the_future: "SHOP THE",
    future: "FUTURE",
    today: "TODAY",
    hero_sub: "Electronics, fashion, groceries & lifestyle — all in one electrifying store. Fast delivery across Pakistan.",
    explore_store: "Explore Store →",
    view_deals: "View Deals",
    products: "Products",
    customers: "Customers",
    rating: "Rating",
    trending: "Trending",
    sold_today: "+4,200 sold today",
    free_delivery: "Free Delivery",
    min_order: "On orders above PKR 2,000",
    flash_sale: "Flash Sale",
    mega_deals: "Today's Mega Deals — Up to 70% Off",
    limited_time: "Limited time · Limited stock · Hurry up!",
    hours: "HRS",
    mins: "MIN",
    secs: "SEC",
    get_deals: "GET EXCLUSIVE DEALS 🔥",
    subscribe_sub: "Subscribe and be first to know about flash sales, new arrivals & more.",
    subscribe_thank_you: "Thank you for subscribing! Check your inbox for updates.",
    email_placeholder: "your@email.com",
    subscribe_btn: "Subscribe",
    subscribing_btn: "Subscribing...",
    footer_tagline: "Pakistan's most exciting multi-category store. Shop electronics, fashion, groceries & more.",
    shop: "Shop",
    help: "Help",
    company: "Company",
    returns: "Returns",
    faqs: "FAQs",
    contact_us: "Contact Us",
    about_us: "About Us",
    careers: "Careers",
    blog: "Blog",
    sellers: "Sellers",
    all_rights: "All rights reserved.",
    enter_prompt_title: "Move Mouse Cursor Here to Enter",
    enter_prompt_sub: "NO CLICK REQUIRED",
    welcome_explore: "OUR DEPARTMENTS",
    electronics_sub: "Premium Devices",
    dresses_sub: "Luxury Wear",
    karyania_sub: "Sugar & Sweeteners",
    
    // UI strings for Cart, Wishlist, Orders
    shopping_cart: "Shopping Cart",
    empty_cart: "Your cart is empty",
    sync_cart_msg: "Sign in to sync your cart and place orders",
    sign_in_now: "Sign In Now",
    total_amount: "Total Amount:",
    payment_method: "Payment Method",
    cod_label: "Cash on Delivery (COD)",
    place_order: "PLACE ORDER",
    processing_order: "PROCESSING ORDER...",
    order_success: "ORDER PLACED SUCCESSFULLY!",
    order_success_msg: "Your order has been registered in the database. Thank you for shopping with us!",
    continue_shopping: "Continue Shopping",
    wishlist_empty: "Your wishlist is empty.",
    cart_add: "+ Cart",
    remove_btn: "Remove",
    orders_title: "My Invoices & Orders",
    no_orders: "No orders found.",
    items_label: "Items:",
    method_label: "Method:",
    order_placed_status: "Order Placed",
    dispatched_status: "Dispatched via TCS",
    completed_status: "Completed & Signed",
    
    // Features Section
    feat_delivery_t: "Free Delivery",
    feat_delivery_d: "On orders above PKR 2,000 across Pakistan",
    feat_payment_t: "Secure Payment",
    feat_payment_d: "100% safe & encrypted checkout always",
    feat_returns_t: "Easy Returns",
    feat_returns_d: "3-day return policy (Electronics & Dresses only)",
    feat_support_t: "24/7 Support",
    feat_support_d: "Live chat & call support round the clock"
  },
  ur: {
    app_name: "راجویلیہ",
    app_tagline: "پاکستان کا پریمیم اسٹور",
    home: "ہوم",
    electronics: "الیکٹرانکس",
    dresses: "خواتین کے لباس",
    karyania: "کریانہ",
    deals: "ڈیلز",
    search: "تلاش کریں...",
    sign_in: "سائن ان",
    sign_out: "سائن آؤٹ",
    wishlist: "پسندیدہ",
    my_orders: "میرے آرڈرز",
    categories: "اقسام",
    browse_by: "اقسام کے لحاظ سے",
    see_all: "سب دیکھیں ←",
    items: "اشیاء",
    hot_picks: "گرم ترین انتخاب",
    trending_now: "آج کل مقبول",
    all_items: "تمام اشیاء",
    sugar: "چینی",
    brown_sugar: "شکر",
    gurr: "گڑ",
    add_to_cart: "کارٹ میں شامل کریں",
    sold_out: "ختم شدہ",
    added: "شامل ہو گیا!",
    new_season: "نیا سیزن 2026 کلیکشن",
    shop_the_future: "خریداری کریں",
    future: "جدید ترین",
    today: "آج ہی",
    hero_sub: "الیکٹرانکس، فیشن، کریانہ اور لائف اسٹائل — سب کچھ ایک ہی جگہ۔ پورے پاکستان میں تیز ترین ڈیلیوری۔",
    explore_store: "اسٹور دیکھیں ←",
    view_deals: "ڈیلز دیکھیں",
    products: "پروڈکٹس",
    customers: "گاہک",
    rating: "ریٹنگ",
    trending: "مقبول",
    sold_today: "+4,200 آج فروخت ہوئے",
    free_delivery: "مفت ڈیلیوری",
    min_order: "2,000 روپے سے زائد کے آرڈرز پر",
    flash_sale: "فلیش سیل",
    mega_deals: "آج کی میگا ڈیلز — 70٪ تک رعایت",
    limited_time: "محدود وقت · محدود اسٹاک · جلدی کریں!",
    hours: "گھنٹے",
    mins: "منٹ",
    secs: "سیکنڈ",
    get_deals: "خصوصی ڈیلز حاصل کریں 🔥",
    subscribe_sub: "سبسکرائب کریں اور فلیش سیلز اور نئے آنے والے مال کے بارے میں سب سے پہلے جانیں۔",
    subscribe_thank_you: "سبسکرائب کرنے کا شکریہ! اپ ڈیٹس کے لیے اپنا ان باکس چیک کریں۔",
    email_placeholder: "آپ کا ای میل",
    subscribe_btn: "سبسکرائب کریں",
    subscribing_btn: "سبسکرائب ہو رہا ہے...",
    footer_tagline: "پاکستان کا سب سے مقبول ملٹی کیٹیگری اسٹور۔ الیکٹرانکس، فیشن، کریانہ اور بہت کچھ خریدیں۔",
    shop: "شاپ",
    help: "مدد",
    company: "کمپنی",
    returns: "واپسی",
    faqs: "سوالات",
    contact_us: "ہم سے رابطہ کریں",
    about_us: "ہمارے بارے میں",
    careers: "ملازمتیں",
    blog: "بلاگ",
    sellers: "فروشندگان",
    all_rights: "جملہ حقوق محفوظ ہیں۔",
    enter_prompt_title: "داخل ہونے کے لیے ماؤس یہاں لائیں",
    enter_prompt_sub: "کلک کرنے کی ضرورت نہیں ہے",
    welcome_explore: "ہمارے شعبہ جات",
    electronics_sub: "جدید ڈیوائسز",
    dresses_sub: "پرتعیش ملبوسات",
    karyania_sub: "چینی اور شکر",

    // UI strings for Cart, Wishlist, Orders
    shopping_cart: "خریداری کارٹ",
    empty_cart: "آپ کی کارٹ خالی ہے",
    sync_cart_msg: "اپنی کارٹ کو مطابقت پذیر بنانے اور آرڈرز دینے کے لیے سائن ان کریں",
    sign_in_now: "ابھی سائن ان کریں",
    total_amount: "کل رقم:",
    payment_method: "طریقہ ادائیگی",
    cod_label: "نقد ادائیگی پر ڈیلیوری (COD)",
    place_order: "آرڈر دیں",
    processing_order: "آرڈر پر کارروائی ہو رہی ہے...",
    order_success: "آرڈر کامیابی سے دے دیا گیا ہے!",
    order_success_msg: "آپ کا آرڈر ڈیٹا بیس میں درج ہو چکا ہے۔ ہمارے ساتھ خریداری کرنے کا شکریہ!",
    continue_shopping: "خریداری جاری رکھیں",
    wishlist_empty: "پسندیدہ اشیاء کی فہرست خالی ہے۔",
    cart_add: "+ کارٹ",
    remove_btn: "حذف کریں",
    orders_title: "میرے انوائسز اور آرڈرز",
    no_orders: "کوئی آرڈر نہیں ملا۔",
    items_label: "اشیاء:",
    method_label: "طریقہ:",
    order_placed_status: "آرڈر دے دیا گیا",
    dispatched_status: "ٹی سی ایس کے ذریعے روانہ کر دیا گیا",
    completed_status: "مکمل اور موصول شدہ",

  

    // Product Names translations
    'Galaxy S24 Ultra 5G': 'گلیکسی S24 الٹرا 5G',
    'MacBook Air M3 2024': 'مک بک ایئر M3 2024',
    'Apple Watch Series 10': 'ایپل واچ سیریز 10',
    'Floral Summer Dress': 'فلورل سمر ڈریس',
    'Silk Maxi Evening Gown': 'سلک میکسی ایوننگ گاؤن',
    'Luxury Printed Lawn Suit': 'لگزری پرنٹڈ لان سوٹ',
    'Fine White Sugar 1kg': 'عمدہ سفید چینی 1 کلو',
    'Premium Brown Sugar 1kg': 'پریمیم شکر 1 کلو',
    'Pure Organic Gurr 1kg': 'خالص آرگینک گڑ 1 کلو',

    // Category translations
    'Electronics': 'الیکٹرانکس',
    'Dresses': 'خواتین کے لباس',
    'Karyania': 'کریانہ',
    'Karyania - Sugar': 'کریانہ - چینی',
    'Karyania - Brown Sugar': 'کریانہ - شکر',
    'Karyania - Gurr': 'کریانہ - گڑ',

    // Features Section
    feat_delivery_t: "مفت ڈیلیوری",
    feat_delivery_d: "پورے پاکستان میں 2,000 روپے سے زائد کے آرڈرز پر",
    feat_payment_t: "محفوظ ادائیگی",
    feat_payment_d: "ہمیشہ 100٪ محفوظ اور انکرپٹڈ ادائیگی",
    feat_returns_t: "آسان واپسی",
    feat_returns_d: "3 دن کی واپسی کی پالیسی (صرف الیکٹرانکس اور ملبوسات کے لیے)",
    feat_support_t: "24/7 سپورٹ",
    feat_support_d: "ہر وقت لائیو چیٹ اور کال سپورٹ"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translations.en },
      ur: { translation: translations.ur }
    },
    lng: localStorage.getItem('luxeLang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(i18n.language);

  useEffect(() => {
    const savedLang = localStorage.getItem('luxeLang');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setLanguageState(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('luxeLang', lang);
  };

  const t = (key) => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
