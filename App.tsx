
import React, { useState, useCallback, useEffect, useRef } from 'react';
// FIX: Replaced 'Bank' icon with 'Landmark' as 'Bank' is not an exported member of 'lucide-react'.
// Added Facebook, Instagram, Link icons
import { Heart, Shield, Leaf, Droplets, Utensils, X, Plus, Minus, CheckCircle, Flag, Ban, Phone, ChevronDown, Hexagon, Sprout, ChevronLeft, ChevronRight, Globe, MessageCircle, Send, Bot, Loader, CreditCard, Smartphone, Landmark, Facebook, Instagram, Link as LinkIcon, Mail, MapPin, UtensilsCrossed, LeafyGreen } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { useInView } from 'react-intersection-observer';

// --- IMAGE PATHS ---
const productImage1 = 'https://i.ibb.co/9vjXpQp/shifaa-premium-product-1.png';
const productImage2 = 'https://i.ibb.co/M6WJv4r/shifaa-premium-product-2.png';
const lifestyleImage = 'https://i.ibb.co/qYtP9Mh/shifaa-premium-lifestyle-1.png';
const bkashLogo = 'https://cdn.sslcommerz.com/public/image/bkash_logo.png';
const sslLogo = 'https://cdn.sslcommerz.com/public/image/sslcommerz_logo.png';


// --- TRANSLATIONS ---
const translations = {
  en: {
    // Hero
    brandName: "Fit Nutters",
    brandSlogan: "Fuel for a healthy life",
    heroTitle: "Shifaa: Nature's Defense.",
    heroSubtitle: "Honey, Garlic, Black Seed & Olive Oil.",
    orderNow: "Order Now",
    madeInBD: "Made in Bangladesh",
    noArtificial: "No artificial colors, flavors, or preservatives",
    // Ingredients
    ingredientsTitle: "Four Pillars of Wellness",
    ingredientsSubtitle: "Crafted from 100% natural and premium ingredients, each chosen for its potent health benefits.",
    honeyTitle: "Pure Honey",
    honeyDesc: "A natural energy booster, rich in antioxidants and soothing properties.",
    oliveOilTitle: "Extra Virgin Olive Oil",
    oliveOilDesc: "Heart-healthy monounsaturated fats that support cardiovascular function.",
    garlicTitle: "Fresh Garlic Cloves",
    garlicDesc: "Known for its immune-boosting and cholesterol-lowering effects.",
    blackSeedTitle: "Premium Black Seed",
    blackSeedDesc: "A powerful anti-inflammatory and immune system supporter.",
    // Benefits
    benefitsTitle: "Unlock a Healthier You",
    heartHealthTitle: "Heart Health",
    heartHealthDesc: "Helps in controlling cholesterol and maintaining healthy blood sugar levels.",
    immunityBoostTitle: "Immunity Boost",
    immunityBoostDesc: "Provides a total wellness boost for your body's vital systems.",
    naturalBeautyTitle: "Natural Beauty",
    naturalBeautyDesc: "Excellent for achieving a natural skin glow and supporting joint health.",
    benefitsImageAlt: "Woman enjoying Shifaa honey blend on toast",
    // Video
    videoTitle: "Discover the Power of Shifaa",
    videoSubtitle: "Watch our short video to learn more about the ancient ingredients and modern benefits of our wellness blend.",
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Is this product safe for everyone?",
    faq1A: "Shifaa is made from 100% natural ingredients. However, if you are pregnant, nursing, or have any pre-existing health conditions, we recommend consulting with your doctor before use. It is not recommended for children under 2 years of age.",
    faq2Q: "How should I store the jar?",
    faq2A: "Store it in a cool, dry place away from direct sunlight. There is no need to refrigerate it. Ensure the lid is tightly closed after each use to maintain freshness.",
    faq3Q: "What is the net weight of the product?",
    faq3A: "Each jar of Shifaa contains a net weight of 450g of our premium wellness blend.",
    faq4Q: "When will I receive my order?",
    faq4A: "Orders within Dhaka are typically delivered within 2-3 business days. For orders outside Dhaka, it may take 3-5 business days. You will receive a confirmation call from us before dispatch.",
    // Usage
    usageTitle: "Simple Ways to Enjoy Shifaa",
    usageDesc1Title: "Daily Wellness Dose",
    usageDesc1: "Eat 2 to 3 garlic cloves with a tablespoon of the oil.",
    usageDesc2Title: "Healthy Salad Dressing",
    usageDesc2: "Drizzle over your favorite salads as a nutritious dressing.",
    // Checkout Section
    checkoutTitle: "Ready to Boost Your Health?",
    checkoutSubtitle: "Experience the power of Shifaa's all-natural blend. Your journey to wellness starts now.",
    checkoutCta: "Order Now & Pay on Delivery",
    // Mobile Bar & Modal
    priceLabel: "Price",
    buyNow: "Buy Now",
    modalTitle: "Complete Your Order",
    quantity: "Quantity",
    subtotal: "Subtotal",
    shippingCost: "Shipping Cost",
    grandTotal: "Grand Total",
    namePlaceholder: "Your Full Name",
    phonePlaceholder: "Phone Number",
    phoneError: "Must be a valid 11-digit BD number (e.g., 01... or +8801...).",
    districtPlaceholder: "Select Your District",
    addressPlaceholder: "Your Full Address (e.g., House, Road, Area)",
    paymentMethod: "Payment Method",
    cod: "Cash on Delivery (COD)",
    bkash: "bKash Payment",
    onlinePayment: "Online Payment (Card/Mobile Banking)",
    confirmOrder: "Confirm Order",
    orderSuccess: "Order Placed! We will call you at {phone} to confirm.",
    fillFieldsError: "Please fill all fields correctly.",
    // bKash Simulation
    bkashConnecting: "Connecting to bKash Secure Gateway...",
    bkashTitle: "bKash Payment",
    bkashMerchant: "Merchant: Fit Nutters",
    bkashEnterPin: "Enter your bKash PIN to confirm payment",
    bkashPinPlaceholder: "bKash PIN",
    bkashConfirmPayment: "Confirm Payment",
    bkashProcessing: "Processing payment...",
    bkashSuccess: "Payment Successful!",
    bkashOrderConfirmed: "Your order is confirmed. You will receive a call shortly.",
    // SSLCommerz Simulation
    sslConnecting: "Redirecting to Secure Payment Gateway...",
    sslTitle: "Secure Payment",
    sslPayWith: "Pay With",
    sslCard: "Card",
    sslMobileBanking: "Mobile Banking",
    sslNetBanking: "Net Banking",
    sslCardNumber: "Card Number",
    sslExpiry: "Expiry (MM/YY)",
    sslCvv: "CVV",
    sslPayNow: "Pay Now",
    sslDisclaimer: "This is a simulated payment form. Do not enter real card details.",
    // Chatbot
    chatWithUs: "Chat with Us",
    chatWelcome: "Hello! I'm Shifaa's AI assistant. How can I help you today?",
    chatInputPlaceholder: "Ask about Shifaa...",
    chatHeader: "Shifaa Assistant",
    chatError: "Sorry, something went wrong. Please try again later.",
    // Footer
    followUs: "Follow Us",
    quickLinks: "Quick Links",
    ingredients: "Ingredients",
    benefits: "Benefits",
    howToUse: "How to Use",
    faq: "FAQ",
    contactUs: "Contact Us",
    addressLine1: "Lake Circus, Kolabagan",
    addressLine2: "Dhaka 1205, Bangladesh",
    copyright: `© ${new Date().getFullYear()} Fit Nutters. All Rights Reserved.`,
    paymentMethods: "We Accept",
  },
  bn: {
    // Hero
    brandName: "ফিট নাটার্স",
    brandSlogan: "স্বাস্থ্যকর জীবনের জন্য জ্বালানি",
    heroTitle: "শিফা: প্রকৃতির প্রতিরক্ষা।",
    heroSubtitle: "মধু, রসুন, কালোজিরা এবং জলপাই তেল।",
    orderNow: "এখনই অর্ডার করুন",
    madeInBD: "বাংলাদেশে তৈরি",
    noArtificial: "কোন কৃত্রিম রং, ফ্লেভার বা প্রিজারভেটিভ নেই",
    // Ingredients
    ingredientsTitle: "সুস্থতার চারটি স্তম্ভ",
    ingredientsSubtitle: "১০০% প্রাকৃতিক এবং প্রিমিয়াম উপাদান দিয়ে তৈরি, যার প্রতিটি তার শক্তিশালী স্বাস্থ্য সুবিধার জন্য নির্বাচিত।",
    honeyTitle: "খাঁটি মধু",
    honeyDesc: "অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ এবং প্রশান্তিদায়ক বৈশিষ্ট্যযুক্ত একটি প্রাকৃতিক শক্তি বুস্টার।",
    oliveOilTitle: "এক্সট্রা ভার্জিন অলিভ অয়েল",
    oliveOilDesc: "হার্টের জন্য স্বাস্থ্যকর মনোআনস্যাচুরেটেড ফ্যাট যা কার্ডিওভাসকুলার ফাংশন সমর্থন করে।",
    garlicTitle: "তাজা রসুনের কোয়া",
    garlicDesc: "এর রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিকারী এবং কোলেস্টেরল কমানোর প্রভাবের জন্য পরিচিত।",
    blackSeedTitle: "প্রিমিয়াম কালোজিরা",
    blackSeedDesc: "একটি শক্তিশালী অ্যান্টি-ইনফ্ল্যামেটরি এবং ইমিউন সিস্টেম সমর্থনকারী।",
    // Benefits
    benefitsTitle: "একটি স্বাস্থ্যকর জীবন আনলক করুন",
    heartHealthTitle: "হার্টের স্বাস্থ্য",
    heartHealthDesc: "কোলেস্টেরল নিয়ন্ত্রণে এবং স্বাস্থ্যকর রক্তে শর্করার মাত্রা বজায় রাখতে সহায়তা করে।",
    immunityBoostTitle: "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি",
    immunityBoostDesc: "আপনার শরীরের অত্যাবশ্যক সিস্টেমের জন্য একটি সম্পূর্ণ সুস্থতা বুস্ট প্রদান করে।",
    naturalBeautyTitle: "প্রাকৃতিক সৌন্দর্য",
    naturalBeautyDesc: "ত্বকের প্রাকৃতিক উজ্জ্বলতা অর্জন এবং জয়েন্টের স্বাস্থ্যকে সমর্থন করার জন্য চমৎকার।",
    benefitsImageAlt: "মহিলা টোস্টের উপর শিফা মধু মিশ্রণ উপভোগ করছেন",
    // Video
    videoTitle: "শিফার শক্তি আবিষ্কার করুন",
    videoSubtitle: "আমাদের সংক্ষিপ্ত ভিডিওটি দেখুন এবং আমাদের ওয়েলনেস ব্লেন্ডের প্রাচীন উপাদান এবং আধুনিক উপকারিতা সম্পর্কে আরও জানুন।",
    // FAQ
    faqTitle: "সাধারণ জিজ্ঞাসা",
    faq1Q: "এই পণ্যটি কি সবার জন্য নিরাপদ?",
    faq1A: "শিফা ১০০% প্রাকৃতিক উপাদান দিয়ে তৈরি। তবে, আপনি যদি গর্ভবতী হন, নার্সিং করেন বা আপনার কোনো পূর্ব-বিদ্যমান স্বাস্থ্য পরিস্থিতি থাকে, আমরা ব্যবহারের আগে আপনার ডাক্তারের সাথে পরামর্শ করার সুপারিশ করি। এটি ২ বছরের কম বয়সী শিশুদের জন্য সুপারিশ করা হয় না।",
    faq2Q: "আমি বয়ামটি কিভাবে সংরক্ষণ করব?",
    faq2A: "এটি সরাসরি সূর্যালোক থেকে দূরে একটি শীতল, শুষ্ক জায়গায় সংরক্ষণ করুন। এটি ফ্রিজে রাখার প্রয়োজন নেই। সতেজতা বজায় রাখতে প্রতিটি ব্যবহারের পরে ঢাকনা بإحكام বন্ধ করা নিশ্চিত করুন।",
    faq3Q: "পণ্যের মোট ওজন কত?",
    faq3A: "শিফার প্রতিটি বয়ামে আমাদের প্রিমিয়াম ওয়েলনেস ব্লেন্ডের ৪৫০ গ্রাম নেট ওজন রয়েছে।",
    faq4Q: "আমি কখন আমার অর্ডার পাব?",
    faq4A: "ঢাকার মধ্যে অর্ডার সাধারণত ২-৩ কার্যদিবসের মধ্যে ডেলিভারি করা হয়। ঢাকার বাইরের অর্ডারের জন্য, এটি ৩-৫ কার্যদিবস সময় নিতে পারে। প্রেরণের আগে আপনি আমাদের কাছ থেকে একটি কনফার্মেশন কল পাবেন।",
    // Usage
    usageTitle: "শিফা উপভোগ করার সহজ উপায়",
    usageDesc1Title: "দৈনিক সুস্থতার ডোজ",
    usageDesc1: "এক টেবিল চামচ তেলের সাথে ২ থেকে ৩টি রসুনের কোয়া খান।",
    usageDesc2Title: "স্বাস্থ্যকর সালাদ ড্রেসিং",
    usageDesc2: "পুষ্টিকর ড্রেসিং হিসাবে আপনার প্রিয় সালাদের উপর ছিটিয়ে দিন।",
    // Checkout Section
    checkoutTitle: "আপনার স্বাস্থ্য উন্নত করতে প্রস্তুত?",
    checkoutSubtitle: "শিফার সম্পূর্ণ প্রাকৃতিক মিশ্রণের শক্তি অনুভব করুন। সুস্থতার দিকে আপনার যাত্রা এখন শুরু।",
    checkoutCta: "অর্ডার করুন এবং ডেলিভারির সময় মূল্য দিন",
    // Mobile Bar & Modal
    priceLabel: "মূল্য",
    buyNow: "এখনই কিনুন",
    modalTitle: "আপনার অর্ডার সম্পূর্ণ করুন",
    quantity: "পরিমাণ",
    subtotal: "সাবটোটাল",
    shippingCost: "শিপিং খরচ",
    grandTotal: "সর্বমোট",
    namePlaceholder: "আপনার পুরো নাম",
    phonePlaceholder: "ফোন নম্বর",
    phoneError: "একটি বৈধ ১১-সংখ্যার বাংলাদেশী নম্বর হতে হবে (যেমন, ০১... বা +৮৮০১...)।",
    districtPlaceholder: "আপনার জেলা নির্বাচন করুন",
    addressPlaceholder: "আপনার সম্পূর্ণ ঠিকানা (যেমন, বাড়ি, রাস্তা, এলাকা)",
    paymentMethod: "মূল্য পরিশোধের পদ্ধতি",
    cod: "ক্যাশ অন ডেলিভারি (COD)",
    bkash: "বিকাশ পেমেন্ট",
    onlinePayment: "অনলাইন পেমেন্ট (কার্ড/মোবাইল ব্যাংকিং)",
    confirmOrder: "অর্ডার নিশ্চিত করুন",
    orderSuccess: "অর্ডার সম্পন্ন হয়েছে! আমরা আপনাকে {phone} নম্বরে ফোন করে অর্ডারটি নিশ্চিত করব।",
    fillFieldsError: "অনুগ্রহ করে সমস্ত তথ্য সঠিকভাবে পূরণ করুন।",
    // bKash Simulation
    bkashConnecting: "বিকাশ সুরক্ষিত গেটওয়েতে সংযোগ করা হচ্ছে...",
    bkashTitle: "বিকাশ পেমেন্ট",
    bkashMerchant: "মার্চেন্ট: ফিট নাটার্স",
    bkashEnterPin: "পেমেন্ট নিশ্চিত করতে আপনার বিকাশ পিন দিন",
    bkashPinPlaceholder: "বিকাশ পিন",
    bkashConfirmPayment: "পেমেন্ট নিশ্চিত করুন",
    bkashProcessing: "পেমেন্ট প্রসেস করা হচ্ছে...",
    bkashSuccess: "পেমেন্ট সফল হয়েছে!",
    bkashOrderConfirmed: "আপনার অর্ডার নিশ্চিত হয়েছে। শীঘ্রই আপনাকে ফোন করা হবে।",
    // SSLCommerz Simulation
    sslConnecting: "সুরক্ষিত পেমেন্ট গেটওয়েতে আপনাকে পাঠানো হচ্ছে...",
    sslTitle: "সুরক্ষিত পেমেন্ট",
    sslPayWith: "এর মাধ্যমে পেমেন্ট করুন",
    sslCard: "কার্ড",
    sslMobileBanking: "মোবাইল ব্যাংকিং",
    sslNetBanking: "নেট ব্যাংকিং",
    sslCardNumber: "কার্ড নম্বর",
    sslExpiry: "মেয়াদ (MM/YY)",
    sslCvv: "CVV",
    sslPayNow: "এখনই পেমেন্ট করুন",
    sslDisclaimer: "এটি একটি সিমুলেটেড পেমেন্ট ফর্ম। আসল কার্ডের বিবরণ প্রবেশ করাবেন না।",
    // Chatbot
    chatWithUs: "চ্যাট করুন",
    chatWelcome: "নমস্কার! আমি শিফার AI সহকারী। আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?",
    chatInputPlaceholder: "শিফা সম্পর্কে জিজ্ঞাসা করুন...",
    chatHeader: "শিফা সহকারী",
    chatError: "দুঃখিত, কিছু একটা ভুল হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    // Footer
    followUs: "আমাদের অনুসরণ করুন",
    quickLinks: "দ্রুত লিঙ্ক",
    ingredients: "উপাদান",
    benefits: "উপকারিতা",
    howToUse: "ব্যবহারবিধি",
    faq: "সাধারণ জিজ্ঞাসা",
    contactUs: "যোগাযোগ করুন",
    addressLine1: "লেক সার্কাস, কলাবাগান",
    addressLine2: "ঢাকা ১২০৫, বাংলাদেশ",
    copyright: `© ${new Date().getFullYear()} ফিট নাটার্স। সর্বস্বত্ব সংরক্ষিত।`,
    paymentMethods: "আমরা গ্রহণ করি",
  }
};

// --- CONFIGURATION ---
const PRODUCT_WEIGHT_KG = 0.5; // 500g per jar including packaging
const benefitsImage = lifestyleImage;
const carouselImages = [productImage1, productImage2];

const bangladeshDistricts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra",
  "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga",
  "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni",
  "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
  "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna",
  "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat",
  "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
  "Munshijganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj",
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali",
  "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari",
  "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur",
  "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

// --- TYPE DEFINITIONS ---
type Language = 'en' | 'bn';
type PaymentMethod = 'cod' | 'bkash' | 'sslcommerz';
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

interface OrderDetails {
  product: string;
  quantity: number;
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    district: string;
  };
  paymentMethod: PaymentMethod;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  lang: Language;
  onCodSubmit: (orderData: OrderDetails) => void;
  onBkashSubmit: (orderData: OrderDetails) => void;
  onSslCommerzSubmit: (orderData: OrderDetails) => void;
}

interface BkashSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orderInfo: OrderDetails | null;
  onPaymentSuccess: () => void;
}

interface SslCommerzSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orderInfo: OrderDetails | null;
  onPaymentSuccess: () => void;
}

// --- SUB-COMPONENTS (Defined outside App to prevent re-renders) ---

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-in-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)),
      4000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto h-80 md:h-96 lg:h-[480px] overflow-hidden rounded-lg group shadow-2xl ring-1 ring-white/10">
      <div className="whitespace-nowrap transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Slide ${index + 1}`} className="inline-block w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]" />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button onClick={goToPrevious} className="p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <button onClick={goToNext} className="p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 active:scale-95">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, slideIndex) => (
          <button key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`w-3 h-3 rounded-full transition-all duration-300 active:scale-95 ${currentIndex === slideIndex ? 'bg-honey-gold' : 'bg-white/50'}`}></button>
        ))}
      </div>
    </div>
  );
};


const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onToggle: () => void; }> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-t border-gray-200 py-5">
      <button
        className="w-full flex justify-between items-center text-left text-deep-dark transition-transform duration-150 active:scale-[0.99]"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg">{question}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          color="#F59E0B"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 mt-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-700 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const IngredientCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
    <div className="w-20 h-20 flex items-center justify-center rounded-full mb-4 bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
        {icon}
    </div>
    <h3 className="text-lg font-semibold text-deep-dark mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const BenefitItem: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full p-3 mt-1">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-bold text-deep-dark">{title}</h4>
      <p className="text-gray-700 mt-1">{text}</p>
    </div>
  </div>
);

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, price, lang, onCodSubmit, onBkashSubmit, onSslCommerzSubmit }) => {
  const t = translations[lang];
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(0);

  const subtotal = price * quantity;
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    if (!district) {
        setShippingCost(0);
        return;
    }

    const totalWeight = quantity * PRODUCT_WEIGHT_KG;
    const isInsideDhaka = district === "Dhaka";
    const baseRate = isInsideDhaka ? 80 : 130;
    const additionalRate = 10;

    let cost = baseRate;
    if (totalWeight > 1) {
        const additionalWeight = Math.ceil(totalWeight - 1);
        cost += additionalWeight * additionalRate;
    }
    setShippingCost(cost);
  }, [quantity, district]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!newPhone || phoneRegex.test(newPhone)) {
      setPhoneError(null);
    } else {
      setPhoneError(t.phoneError);
    }
  };

  const resetForm = () => {
    setQuantity(1);
    setName('');
    setPhone('');
    setAddress('');
    setDistrict('');
    setPaymentMethod('cod');
    setPhoneError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError || !name || !phone || !address || !district) {
      alert(t.fillFieldsError);
      return;
    }

    const orderData: OrderDetails = {
      product: "Shifaa - Heart & Immune Defense",
      quantity,
      subtotal,
      shippingCost,
      grandTotal,
      customer: {
        name,
        phone,
        address,
        district,
      },
      paymentMethod,
    };

    if (paymentMethod === 'cod') {
      onCodSubmit(orderData);
    } else if (paymentMethod === 'bkash') {
      onBkashSubmit(orderData);
    } else if (paymentMethod === 'sslcommerz') {
      onSslCommerzSubmit(orderData);
    }
    
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-transform duration-150 active:scale-95">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-center text-deep-dark mb-6">{t.modalTitle}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.quantity}</label>
              <div className="flex items-center justify-center border border-gray-300 rounded-md p-2">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-honey-gold hover:text-amber-700 disabled:opacity-50 transition-transform duration-150 active:scale-95" disabled={quantity <= 1}>
                  <Minus size={20} />
                </button>
                <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)} className="text-honey-gold hover:text-amber-700 transition-transform duration-150 active:scale-95">
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Customer Details */}
            <div className="space-y-4">
              <input type="text" placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-honey-gold focus:border-honey-gold" />
              <div>
                <input type="tel" placeholder={t.phonePlaceholder} value={phone} onChange={handlePhoneChange} required className={`w-full px-4 py-2 border rounded-md focus:ring-honey-gold focus:border-honey-gold ${phoneError ? 'border-red-500' : 'border-gray-300'}`} autoFocus />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>
              <select 
                value={district} 
                onChange={e => setDistrict(e.target.value)} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-honey-gold focus:border-honey-gold bg-white"
              >
                <option value="" disabled>{t.districtPlaceholder}</option>
                {bangladeshDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <textarea placeholder={t.addressPlaceholder} value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-honey-gold focus:border-honey-gold" />
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t border-b border-gray-200 py-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>{t.subtotal}:</span>
                <span className="font-medium">৳{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>{t.shippingCost}:</span>
                <span className="font-medium">৳{shippingCost}</span>
              </div>
              <div className="flex justify-between items-center text-deep-dark font-bold text-lg">
                <span>{t.grandTotal}:</span>
                <span>৳{grandTotal}</span>
              </div>
            </div>

            {/* Payment Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">{t.paymentMethod}</h3>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all duration-150 active:scale-95 ${paymentMethod === 'cod' ? 'border-honey-gold bg-amber-50 ring-2 ring-honey-gold' : 'border-gray-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  <span className="font-semibold text-deep-dark">{t.cod}</span>
                </label>
                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all duration-150 active:scale-95 ${paymentMethod === 'bkash' ? 'border-honey-gold bg-amber-50 ring-2 ring-honey-gold' : 'border-gray-300'}`}>
                  <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="hidden" />
                  <img src={bkashLogo} alt="bKash Logo" className="w-12 h-auto mr-3"/>
                  <span className="font-semibold text-deep-dark">{t.bkash}</span>
                </label>
                 <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all duration-150 active:scale-95 ${paymentMethod === 'sslcommerz' ? 'border-honey-gold bg-amber-50 ring-2 ring-honey-gold' : 'border-gray-300'}`}>
                  <input type="radio" name="payment" value="sslcommerz" checked={paymentMethod === 'sslcommerz'} onChange={() => setPaymentMethod('sslcommerz')} className="hidden" />
                  <img src={sslLogo} alt="SSLCommerz Logo" className="w-12 h-auto mr-3"/>
                  <span className="font-semibold text-deep-dark">{t.onlinePayment}</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300 active:scale-95">
              {t.confirmOrder} (৳{grandTotal})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const BkashSimulationModal: React.FC<BkashSimulationModalProps> = ({ isOpen, onClose, lang, orderInfo, onPaymentSuccess }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'connecting' | 'pin_entry' | 'processing' | 'success'>('connecting');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('connecting');
      setPin('');
      const timer = setTimeout(() => {
        setStep('pin_entry');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
    }, 2000);
  };

  if (!isOpen || !orderInfo) return null;

  const renderContent = () => {
    switch (step) {
      case 'connecting':
        return (
          <div className="text-center flex flex-col items-center">
            <Loader size={48} className="text-pink-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700">{t.bkashConnecting}</p>
          </div>
        );
      case 'pin_entry':
        return (
          <form onSubmit={handleConfirmPin}>
            <h3 className="text-xl font-bold text-center mb-2">{t.bkashTitle}</h3>
            <p className="text-center text-gray-600 mb-1">{t.bkashMerchant}</p>
            <p className="text-center text-3xl font-bold text-pink-600 mb-6">৳{orderInfo.grandTotal}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.bkashEnterPin}</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t.bkashPinPlaceholder}
              maxLength={5}
              className="w-full px-4 py-2 text-center tracking-widest text-xl border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 mb-4"
              required
              autoFocus
            />
            <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition-all active:scale-95">
              {t.bkashConfirmPayment}
            </button>
          </form>
        );
      case 'processing':
        return (
          <div className="text-center flex flex-col items-center">
            <Loader size={48} className="text-pink-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700">{t.bkashProcessing}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">{t.bkashSuccess}</h3>
            <p className="text-gray-700">{t.bkashOrderConfirmed}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
        <div className="p-8 relative">
          <div className="flex justify-center mb-4">
             <img src={bkashLogo} alt="bKash Logo" className="h-10"/>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const SslCommerzSimulationModal: React.FC<SslCommerzSimulationModalProps> = ({ isOpen, onClose, lang, orderInfo, onPaymentSuccess }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'redirecting' | 'payment_form' | 'processing' | 'success'>('redirecting');
  const [activeTab, setActiveTab] = useState<'card' | 'mobile' | 'net'>('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    if (isOpen) {
      setStep('redirecting');
      setCard({ number: '', expiry: '', cvv: '' });
      const timer = setTimeout(() => {
        setStep('payment_form');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (card.number.length < 16 || card.expiry.length < 4 || card.cvv.length < 3) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
    }, 2000);
  };
  
  if (!isOpen || !orderInfo) return null;

  const renderContent = () => {
    switch(step) {
      case 'redirecting':
        return (
          <div className="text-center flex flex-col items-center p-8">
            <Loader size={48} className="text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700">{t.sslConnecting}</p>
          </div>
        );
      case 'payment_form':
        return (
          <div className="p-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">{t.bkashMerchant}</p>
              <p className="text-3xl font-bold text-blue-800">৳{orderInfo.grandTotal}</p>
            </div>
            <div className="bg-gray-100 rounded-t-lg p-1 flex justify-around">
              <button onClick={() => setActiveTab('card')} className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${activeTab === 'card' ? 'bg-white shadow' : ''}`}>
                <CreditCard size={20} className="mr-2 text-blue-700"/> {t.sslCard}
              </button>
               <button onClick={() => setActiveTab('mobile')} className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${activeTab === 'mobile' ? 'bg-white shadow' : ''}`}>
                <Smartphone size={20} className="mr-2 text-pink-600"/> {t.sslMobileBanking}
              </button>
               {/* FIX: Replaced 'Bank' icon with 'Landmark' as 'Bank' is not an exported member of 'lucide-react'. */}
               <button onClick={() => setActiveTab('net')} className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${activeTab === 'net' ? 'bg-white shadow' : ''}`}>
                <Landmark size={20} className="mr-2 text-green-700"/> {t.sslNetBanking}
              </button>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-b-lg">
              {activeTab === 'card' ? (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4">
                    <input type="text" placeholder={t.sslCardNumber} value={card.number} onChange={e => setCard({...card, number: e.target.value})} maxLength={16} required className="w-full px-3 py-2 border rounded-md" />
                    <div className="flex space-x-4">
                      <input type="text" placeholder={t.sslExpiry} value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} maxLength={5} required className="w-1/2 px-3 py-2 border rounded-md" />
                      <input type="text" placeholder={t.sslCvv} value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} maxLength={3} required className="w-1/2 px-3 py-2 border rounded-md" />
                    </div>
                  </div>
                   <p className="text-xs text-gray-500 text-center my-4">{t.sslDisclaimer}</p>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all active:scale-95">{t.sslPayNow}</button>
                </form>
              ) : (
                <p className="text-center text-gray-500 py-8">This payment method is for demonstration only.</p>
              )}
            </div>
          </div>
        );
      case 'processing':
         return (
          <div className="text-center flex flex-col items-center p-8">
            <Loader size={48} className="text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700">{t.bkashProcessing}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center flex flex-col items-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">{t.bkashSuccess}</h3>
            <p className="text-gray-700">{t.bkashOrderConfirmed}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-md">
        <header className="p-4 border-b text-center">
          <img src={sslLogo} alt="SSLCommerz Logo" className="h-8 mx-auto"/>
        </header>
        {renderContent()}
      </div>
    </div>
  );
};


const Chatbot: React.FC<{ isOpen: boolean; onClose: () => void; lang: Language }> = ({ isOpen, onClose, lang }) => {
    const t = translations[lang];
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: t.chatWelcome, sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const systemInstruction = `You are a friendly and helpful customer service chatbot for 'Fit Nutters'. Your sole purpose is to answer questions about a specific product called 'Shifaa: The Ancient Healing Blend'.
                Product details: Shifaa is a premium wellness blend of Pure Honey, Extra Virgin Olive Oil, Fresh Garlic Cloves, and Premium Black Seed.
                Key benefits: It supports heart health (controls cholesterol & blood sugar), boosts immunity, and improves skin glow & joint health.
                Usage: Eat 2-3 garlic cloves with a tablespoon of the oil daily, or use as a salad dressing.
                Price: ৳850.
                Important: Politely refuse to answer any questions not related to the Shifaa product, its ingredients, benefits, or usage. Do not invent information. Keep your answers concise and easy to understand.`;
                
                chatSessionRef.current = ai.chats.create({
                    model: 'gemini-3-pro-preview',
                    config: { systemInstruction },
                });
            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setMessages(prev => [...prev, {id: Date.now(), text: t.chatError, sender: 'bot'}]);
            }
        };
        initChat();
    }, [t.chatError]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !chatSessionRef.current) return;

        const userMessage: Message = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const result = await chatSessionRef.current.sendMessage({ message: inputValue });
            const botResponse: Message = { id: Date.now() + 1, text: result.text ?? t.chatError, sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { id: Date.now() + 1, text: t.chatError, sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-4 w-80 md:w-96 h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50">
            <header className="bg-deep-dark text-white p-4 flex justify-between items-center rounded-t-lg">
                <h3 className="font-bold text-lg">{t.chatHeader}</h3>
                <button onClick={onClose} className="hover:text-gray-300 transition-transform duration-150 active:scale-95">
                    <X size={20} />
                </button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-honey-gold text-white' : 'bg-gray-200 text-deep-dark'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-gray-200 text-deep-dark p-3 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                     <div ref={messagesEndRef} />
                </div>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t.chatInputPlaceholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-honey-gold focus:border-honey-gold"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-honey-gold text-white p-3 rounded-full hover:bg-amber-600 disabled:bg-gray-400 transition-transform duration-150 active:scale-95" disabled={isLoading || !inputValue.trim()}>
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [isSslModalOpen, setIsSslModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [price, setPrice] = useState(850);
  const [language, setLanguage] = useState<Language>('en');
  const [isLangSwitcherOpen, setIsLangSwitcherOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const t = translations[language];
  
  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const showSuccessAlert = (phone: string) => {
      alert(t.orderSuccess.replace('{phone}', phone));
  };
  
  const handleCodSubmit = (orderData: OrderDetails) => {
      console.log("COD Order Data:", JSON.stringify(orderData, null, 2));
      showSuccessAlert(orderData.customer.phone);
  };

  const handleBkashSubmit = (orderData: OrderDetails) => {
      console.log("bKash Order Data:", JSON.stringify(orderData, null, 2));
      setCurrentOrder(orderData);
      setIsBkashModalOpen(true);
  };

  const handleSslCommerzSubmit = (orderData: OrderDetails) => {
      console.log("SSLCommerz Order Data:", JSON.stringify(orderData, null, 2));
      setCurrentOrder(orderData);
      setIsSslModalOpen(true);
  };
  
  const handlePaymentSuccess = () => {
    if (currentOrder) {
      showSuccessAlert(currentOrder.customer.phone);
    }
    setCurrentOrder(null);
  };

  const honeycombBg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'>
      <path fill-rule='evenodd' fill='rgba(245, 158, 11, 0.05)' d='M14 0l14 8v16.5L14 33 0 24.5V8zM14 15l14 8v16.5L14 48 0 39.5V23z'/>
    </svg>
  `;
  const honeycombBgUrl = `url("data:image/svg+xml,${encodeURIComponent(honeycombBg)}")`;
  
  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
  ];
  
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handlePolicyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      alert('This is a demo link for a real policy page.');
  };

  return (
    <div className="bg-soft-cream font-sans text-deep-dark">
      <main className="pb-24 md:pb-0">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-rich-brown overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: honeycombBgUrl, opacity: 0.5 }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-rich-brown via-rich-brown/80 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left text-white">
                 <div className="mb-4">
                    <span className="text-honey-gold font-bold text-lg">{t.brandName}</span>
                    <p className="text-sm text-gray-300">{t.brandSlogan}</p>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4">{t.heroTitle}</h1>
                <p className="text-lg lg:text-2xl max-w-xl mx-auto md:mx-0 text-gray-200 mb-8">{t.heroSubtitle}</p>
                <button onClick={handleOpenModal} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-4 px-10 rounded-full text-xl transition-all transform hover:brightness-110 duration-300 animate-pulse active:scale-95">
                  {t.orderNow}
                </button>
                <div className="mt-8 flex justify-center md:justify-start items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Flag size={16} />
                    <span>{t.madeInBD}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Ban size={16} />
                    <span>{t.noArtificial}</span>
                  </div>
                </div>
                 <div className="mt-8 flex justify-center md:justify-start items-center space-x-6">
                    <a href="https://facebook.com/fitnutters" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="text-white hover:text-honey-gold transition-colors">
                        <Facebook size={24} />
                    </a>
                    <a href="https://instagram.com/fitnutters" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-white hover:text-honey-gold transition-colors">
                        <Instagram size={24} />
                    </a>
                    <a href="https://fitnutters.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Website" className="text-white hover:text-honey-gold transition-colors">
                        <LinkIcon size={24} />
                    </a>
                    <a href="tel:+8801735560183" aria-label="Call Us" className="text-white hover:text-honey-gold transition-colors">
                        <Phone size={24} />
                    </a>
                 </div>
              </div>
              <div className="flex justify-center">
                <ImageCarousel images={carouselImages} />
              </div>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <section id="ingredients" className="py-16 bg-white" style={{ backgroundImage: honeycombBgUrl }}>
          <AnimatedSection>
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-2">{t.ingredientsTitle}</h2>
              <p className="text-gray-600 mb-12 max-w-2xl mx-auto">{t.ingredientsSubtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <IngredientCard icon={<Hexagon size={40} />} title={t.honeyTitle} description={t.honeyDesc} />
                <IngredientCard icon={<Droplets size={40} />} title={t.oliveOilTitle} description={t.oliveOilDesc} />
                <IngredientCard icon={<Sprout size={40} />} title={t.garlicTitle} description={t.garlicDesc} />
                <IngredientCard icon={<Leaf size={40} />} title={t.blackSeedTitle} description={t.blackSeedDesc} />
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Health Benefits Section */}
        <section id="benefits" className="py-16 bg-soft-cream">
          <AnimatedSection>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold">{t.benefitsTitle}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img src={benefitsImage} alt={t.benefitsImageAlt} className="rounded-lg shadow-xl" />
                </div>
                <div className="space-y-8">
                  <BenefitItem icon={<Heart size={24} />} title={t.heartHealthTitle} text={t.heartHealthDesc} />
                  <BenefitItem icon={<Shield size={24} />} title={t.immunityBoostTitle} text={t.immunityBoostDesc} />
                  <BenefitItem icon={<Leaf size={24} />} title={t.naturalBeautyTitle} text={t.naturalBeautyDesc} />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* YouTube Video Section */}
        <section className="py-16 bg-white">
          <AnimatedSection>
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-2">{t.videoTitle}</h2>
              <p className="text-gray-600 mb-12 max-w-2xl mx-auto">{t.videoSubtitle}</p>
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-lg shadow-2xl overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/rokGy0huYEA"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-soft-cream">
          <AnimatedSection>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">{t.faqTitle}</h2>
                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                      <FaqItem
                        key={index}
                        question={faq.q}
                        answer={faq.a}
                        isOpen={openFaqIndex === index}
                        onToggle={() => handleFaqToggle(index)}
                      />
                    ))}
                </div>
            </div>
          </AnimatedSection>
        </section>
        
        {/* Usage Instructions Section */}
        <section id="how-to-use" className="py-16 bg-rich-brown text-white">
          <AnimatedSection>
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-10">{t.usageTitle}</h2>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-8 rounded-lg text-center flex flex-col items-center border border-white/10">
                    <UtensilsCrossed size={40} className="text-honey-gold mb-4"/>
                    <h3 className="text-xl font-semibold mb-2">{t.usageDesc1Title}</h3>
                    <p className="text-gray-300">{t.usageDesc1}</p>
                </div>
                 <div className="bg-white/5 p-8 rounded-lg text-center flex flex-col items-center border border-white/10">
                    <LeafyGreen size={40} className="text-honey-gold mb-4"/>
                    <h3 className="text-xl font-semibold mb-2">{t.usageDesc2Title}</h3>
                    <p className="text-gray-300">{t.usageDesc2}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Final Checkout Section */}
        <section className="py-20 bg-gradient-to-b from-soft-cream to-amber-100/20">
          <AnimatedSection>
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden md:grid md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12 order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-deep-dark mb-3">{t.checkoutTitle}</h2>
                        <p className="text-gray-600 mb-6">{t.checkoutSubtitle}</p>
                        <div className="text-4xl font-extrabold text-deep-dark mb-6">
                            ৳{price}
                        </div>
                        <button onClick={handleOpenModal} className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all transform hover:brightness-110 duration-300 active:scale-95">
                            {t.checkoutCta}
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                         <img src={productImage1} alt="Shifaa Product Jar" className="w-full h-64 md:h-full object-cover" />
                    </div>
                </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* Comprehensive Footer */}
        <footer className="bg-rich-brown text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
                    {/* Column 1: Brand Info */}
                    <div>
                        <h3 className="text-honey-gold font-bold text-lg mb-4">{t.brandName}</h3>
                        <p className="text-sm mb-6">{t.brandSlogan}</p>
                        <div className="flex justify-center md:justify-start items-center space-x-6">
                           <a href="https://facebook.com/fitnutters" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-honey-gold transition-transform duration-200 hover:scale-110"><Facebook size={24} /></a>
                           <a href="https://instagram.com/fitnutters" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-honey-gold transition-transform duration-200 hover:scale-110"><Instagram size={24} /></a>
                           <a href="https://fitnutters.com" target="_blank" rel="noopener noreferrer" aria-label="Website" className="hover:text-honey-gold transition-transform duration-200 hover:scale-110"><LinkIcon size={24} /></a>
                        </div>
                    </div>
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white text-lg mb-4">{t.quickLinks}</h3>
                        <ul className="space-y-3">
                            <li><button onClick={() => handleScrollTo('ingredients')} className="hover:text-honey-gold transition-colors">{t.ingredients}</button></li>
                            <li><button onClick={() => handleScrollTo('benefits')} className="hover:text-honey-gold transition-colors">{t.benefits}</button></li>
                            <li><button onClick={() => handleScrollTo('how-to-use')} className="hover:text-honey-gold transition-colors">{t.howToUse}</button></li>
                            <li><button onClick={() => handleScrollTo('faq')} className="hover:text-honey-gold transition-colors">{t.faq}</button></li>
                        </ul>
                    </div>
                    {/* Column 3: Contact Us */}
                    <div>
                         <h3 className="font-semibold text-white text-lg mb-4">{t.contactUs}</h3>
                         <ul className="space-y-3">
                            <li className="flex items-center justify-center md:justify-start space-x-2">
                                <Phone size={16} className="text-honey-gold"/>
                                <a href="tel:+8801735560183" className="hover:text-honey-gold transition-colors">+8801735560183</a>
                            </li>
                             <li className="flex items-center justify-center md:justify-start space-x-2">
                                <Mail size={16} className="text-honey-gold"/>
                                <a href="mailto:fitnutters@gmail.com" className="hover:text-honey-gold transition-colors">fitnutters@gmail.com</a>
                            </li>
                             <li className="flex items-start justify-center md:justify-start space-x-2">
                                <MapPin size={16} className="text-honey-gold mt-1 flex-shrink-0"/>
                                <p>{t.addressLine1},<br/>{t.addressLine2}</p>
                            </li>
                         </ul>
                    </div>
                </div>
                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-center text-sm">
                    <p className="mb-4 md:mb-0">{t.copyright}</p>
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold">{t.paymentMethods}:</span>
                        <img src={bkashLogo} alt="bKash" className="h-6 bg-white rounded p-1"/>
                        <img src={sslLogo} alt="SSLCommerz" className="h-6 bg-white rounded p-1"/>
                    </div>
                </div>
            </div>
        </footer>

      {/* Sticky Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-lg z-40">
        <div className="text-xl font-bold text-deep-dark">
          {t.priceLabel}: <span className="text-honey-gold">৳{price}</span>
        </div>
        <button onClick={handleOpenModal} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:brightness-110 transition-transform duration-150 active:scale-95">
          {t.buyNow}
        </button>
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-3">
         {isLangSwitcherOpen && (
             <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col items-start space-y-1">
                 <button onClick={() => { setLanguage('en'); setIsLangSwitcherOpen(false); }} className={`w-full text-left px-3 py-1 rounded transition-transform duration-150 active:scale-95 ${language === 'en' ? 'bg-honey-gold text-white' : 'hover:bg-gray-100'}`}>English</button>
                 <button onClick={() => { setLanguage('bn'); setIsLangSwitcherOpen(false); }} className={`w-full text-left px-3 py-1 rounded transition-transform duration-150 active:scale-95 ${language === 'bn' ? 'bg-honey-gold text-white' : 'hover:bg-gray-100'}`}>বাংলা</button>
             </div>
         )}
         <button 
            onClick={() => setIsLangSwitcherOpen(!isLangSwitcherOpen)} 
            className="bg-deep-dark text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition-transform duration-150 active:scale-95"
            aria-label="Change Language"
          >
             <Globe size={24} />
         </button>
         <button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-honey-gold text-white rounded-full p-3 shadow-lg hover:bg-amber-600 transition-transform duration-150 active:scale-95"
            aria-label="Chat with us"
          >
             <MessageCircle size={24} />
         </button>
      </div>


      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        price={price} 
        lang={language}
        onCodSubmit={handleCodSubmit}
        onBkashSubmit={handleBkashSubmit}
        onSslCommerzSubmit={handleSslCommerzSubmit}
      />
      <BkashSimulationModal
        isOpen={isBkashModalOpen}
        onClose={() => setIsBkashModalOpen(false)}
        lang={language}
        orderInfo={currentOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <SslCommerzSimulationModal
        isOpen={isSslModalOpen}
        onClose={() => setIsSslModalOpen(false)}
        lang={language}
        orderInfo={currentOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lang={language} />
    </div>
  );
}
