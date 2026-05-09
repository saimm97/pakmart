import {
  db,
  brandsTable,
  categoriesTable,
  productsTable,
  testimonialsTable,
  type InsertProduct,
  type InsertCategory,
  type InsertBrand,
  type InsertTestimonial,
} from "@workspace/db";

const categories: InsertCategory[] = [
  // ── Top-level ──────────────────────────────────────────────────────
  { slug: "fashion",         name: "Fashion",            image: "cat-fashion.png",    icon: "Shirt",          parentSlug: null, position: 1 },
  { slug: "mobiles",         name: "Mobiles",            image: "product-phone.png",  icon: "Smartphone",     parentSlug: null, position: 2 },
  { slug: "electronics",     name: "Electronics",        image: "product-ac.png",     icon: "Tv",             parentSlug: null, position: 3 },
  { slug: "grocery",         name: "Grocery",            image: "cat-grocery.png",    icon: "ShoppingBasket", parentSlug: null, position: 4 },
  { slug: "home-lifestyle",  name: "Home & Lifestyle",   image: "promo-band-1.jpg",   icon: "Home",           parentSlug: null, position: 5 },
  { slug: "beauty",          name: "Beauty & Health",    image: "promo-band-2.jpg",   icon: "Sparkles",       parentSlug: null, position: 6 },
  { slug: "mother-baby",     name: "Mother & Baby",      image: "summer-edit.jpg",    icon: "Baby",           parentSlug: null, position: 7 },
  { slug: "sports",          name: "Sports & Outdoor",   image: "cat-fashion.png",    icon: "Dumbbell",       parentSlug: null, position: 8 },
  { slug: "books",           name: "Books & Stationery", image: "promo-band-1.jpg",   icon: "BookOpen",       parentSlug: null, position: 9 },
  { slug: "automotive",      name: "Automotive",         image: "product-ac.png",     icon: "Car",            parentSlug: null, position: 10 },

  // ── Fashion subcategories ─────────────────────────────────────────
  { slug: "womens-clothing", name: "Women's Clothing",   image: "cat-fashion.png",    icon: "Shirt",          parentSlug: "fashion", position: 1 },
  { slug: "mens-clothing",   name: "Men's Clothing",     image: "promo-band-1.jpg",   icon: "Shirt",          parentSlug: "fashion", position: 2 },
  { slug: "footwear",        name: "Footwear",           image: "product-shoes.png",  icon: "Footprints",     parentSlug: "fashion", position: 3 },
  { slug: "accessories",     name: "Accessories",        image: "promo-fashion.png",  icon: "Watch",          parentSlug: "fashion", position: 4 },
  { slug: "eastern-wear",    name: "Eastern Wear",       image: "product-khaadi.png", icon: "Gem",            parentSlug: "fashion", position: 5 },

  // ── Mobiles subcategories ─────────────────────────────────────────
  { slug: "smartphones",       name: "Smartphones",        image: "product-phone.png", icon: "Smartphone",    parentSlug: "mobiles", position: 1 },
  { slug: "tablets",           name: "Tablets",            image: "product-phone.png", icon: "Tablet",        parentSlug: "mobiles", position: 2 },
  { slug: "mobile-accessories",name: "Mobile Accessories", image: "product-phone.png", icon: "Cable",         parentSlug: "mobiles", position: 3 },

  // ── Electronics subcategories ─────────────────────────────────────
  { slug: "televisions",     name: "Televisions",        image: "promo-band-2.jpg",   icon: "Tv",             parentSlug: "electronics", position: 1 },
  { slug: "home-appliances", name: "Home Appliances",    image: "product-ac.png",     icon: "AirVent",        parentSlug: "electronics", position: 2 },
  { slug: "audio",           name: "Audio & Headphones", image: "promo-band-2.jpg",   icon: "Headphones",     parentSlug: "electronics", position: 3 },
  { slug: "cameras",         name: "Cameras",            image: "promo-band-2.jpg",   icon: "Camera",         parentSlug: "electronics", position: 4 },
  { slug: "laptops",         name: "Laptops & PCs",      image: "product-phone.png",  icon: "Laptop",         parentSlug: "electronics", position: 5 },

  // ── Grocery subcategories ─────────────────────────────────────────
  { slug: "spices-masalas",  name: "Spices & Masalas",   image: "product-pickle.png", icon: "Flame",          parentSlug: "grocery", position: 1 },
  { slug: "beverages",       name: "Beverages & Tea",    image: "product-tea.png",    icon: "Coffee",         parentSlug: "grocery", position: 2 },
  { slug: "rice-flour",      name: "Rice & Flour",       image: "cat-grocery.png",    icon: "Wheat",          parentSlug: "grocery", position: 3 },
  { slug: "dairy-eggs",      name: "Dairy & Eggs",       image: "cat-grocery.png",    icon: "Milk",           parentSlug: "grocery", position: 4 },
  { slug: "snacks",          name: "Snacks & Sweets",    image: "product-pickle.png", icon: "Cookie",         parentSlug: "grocery", position: 5 },

  // ── Home subcategories ────────────────────────────────────────────
  { slug: "bedding-bath",    name: "Bedding & Bath",     image: "promo-band-2.jpg",   icon: "Bed",            parentSlug: "home-lifestyle", position: 1 },
  { slug: "home-decor",      name: "Home Decor",         image: "promo-band-1.jpg",   icon: "Palette",        parentSlug: "home-lifestyle", position: 2 },
  { slug: "kitchenware",     name: "Kitchenware",        image: "promo-band-1.jpg",   icon: "CookingPot",     parentSlug: "home-lifestyle", position: 3 },
  { slug: "furniture",       name: "Furniture",          image: "promo-band-1.jpg",   icon: "Sofa",           parentSlug: "home-lifestyle", position: 4 },

  // ── Beauty subcategories ──────────────────────────────────────────
  { slug: "skincare",        name: "Skincare",           image: "promo-band-2.jpg",   icon: "Droplets",       parentSlug: "beauty", position: 1 },
  { slug: "fragrances",      name: "Fragrances",         image: "promo-band-2.jpg",   icon: "Wind",           parentSlug: "beauty", position: 2 },
  { slug: "hair-care",       name: "Hair Care",          image: "promo-band-2.jpg",   icon: "Scissors",       parentSlug: "beauty", position: 3 },
  { slug: "makeup",          name: "Makeup",             image: "promo-band-2.jpg",   icon: "Brush",          parentSlug: "beauty", position: 4 },

  // ── Sports subcategories ──────────────────────────────────────────
  { slug: "cricket",         name: "Cricket",            image: "cat-fashion.png",    icon: "Trophy",         parentSlug: "sports", position: 1 },
  { slug: "fitness",         name: "Fitness & Gym",      image: "cat-fashion.png",    icon: "Dumbbell",       parentSlug: "sports", position: 2 },
  { slug: "outdoor",         name: "Outdoor & Camping",  image: "cat-fashion.png",    icon: "Tent",           parentSlug: "sports", position: 3 },
];

const brands: InsertBrand[] = [
  { slug: "khaadi",       name: "Khaadi",             position: 1 },
  { slug: "gul-ahmed",    name: "Gul Ahmed",          position: 2 },
  { slug: "sapphire",     name: "Sapphire",           position: 3 },
  { slug: "alkaram",      name: "Alkaram Studio",     position: 4 },
  { slug: "samsung",      name: "Samsung",            position: 5 },
  { slug: "infinix",      name: "Infinix",            position: 6 },
  { slug: "xiaomi",       name: "Xiaomi",             position: 7 },
  { slug: "haier",        name: "Haier",              position: 8 },
  { slug: "dawlance",     name: "Dawlance",           position: 9 },
  { slug: "national",     name: "National Foods",     position: 10 },
  { slug: "shan",         name: "Shan Foods",         position: 11 },
  { slug: "tapal",        name: "Tapal",              position: 12 },
  { slug: "service",      name: "Service Shoes",      position: 13 },
  { slug: "borjan",       name: "Borjan",             position: 14 },
  { slug: "chen-one",     name: "Chen One",           position: 15 },
  { slug: "bonanza",      name: "Bonanza Satrangi",   position: 16 },
  { slug: "apple",        name: "Apple",              position: 17 },
  { slug: "oppo",         name: "Oppo",               position: 18 },
  { slug: "tecno",        name: "Tecno",              position: 19 },
  { slug: "dell",         name: "Dell",               position: 20 },
  { slug: "sony",         name: "Sony",               position: 21 },
  { slug: "knorr",        name: "Knorr",              position: 22 },
  { slug: "lays",         name: "Lays",               position: 23 },
  { slug: "nike",         name: "Nike",               position: 24 },
  { slug: "adidas",       name: "Adidas",             position: 25 },
  { slug: "gray-nicolls", name: "Gray-Nicolls",       position: 26 },
];

const products: InsertProduct[] = [
  // ── WOMEN'S CLOTHING ──────────────────────────────────────────────
  {
    slug: "khaadi-printed-lawn-three-piece-summer-2026",
    name: "Printed Lawn Three Piece — Summer Edit 2026",
    brandSlug: "khaadi", categorySlug: "womens-clothing",
    description: "Hand-finished printed lawn three piece with intricate block-print motifs, organza dupatta, and dyed cambric trousers.",
    price: 6490, oldPrice: 8990, image: "product-khaadi.png", images: ["product-khaadi.png", "promo-fashion.png"],
    rating: "4.8", reviewCount: 1284, stock: 42, sold: 3210,
    isFlashDeal: true, isNew: true, isFeatured: true, tags: ["lawn", "summer", "unstitched"],
  },
  {
    slug: "gul-ahmed-embroidered-chiffon-festive",
    name: "Embroidered Chiffon Festive Suit",
    brandSlug: "gul-ahmed", categorySlug: "womens-clothing",
    description: "Three-piece embroidered chiffon with sequinned bodice, raw silk trouser, and pure chiffon dupatta.",
    price: 12990, oldPrice: 15990, image: "promo-fashion.png", images: ["promo-fashion.png"],
    rating: "4.7", reviewCount: 642, stock: 28, sold: 1180,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["festive", "eid", "chiffon"],
  },
  {
    slug: "sapphire-cotton-kurti-tropical",
    name: "Tropical Print Cotton Kurti",
    brandSlug: "sapphire", categorySlug: "womens-clothing",
    description: "Lightweight cotton kurti in a vivid tropical print. Relaxed straight cut with side slits.",
    price: 2990, oldPrice: 3990, image: "summer-edit.jpg", images: ["summer-edit.jpg"],
    rating: "4.6", reviewCount: 520, stock: 86, sold: 2410,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["kurti", "summer", "casual"],
  },
  {
    slug: "bonanza-embroidered-lawn-suit",
    name: "Bonanza Satrangi Embroidered Lawn Suit",
    brandSlug: "bonanza", categorySlug: "womens-clothing",
    description: "Vibrant 3-piece embroidered lawn suit ideal for casual and semi-formal wear.",
    price: 4990, oldPrice: 5990, image: "promo-fashion.png", images: ["promo-fashion.png"],
    rating: "4.5", reviewCount: 380, stock: 55, sold: 890,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["lawn", "embroidered"],
  },
  {
    slug: "chen-one-linen-trouser-suit",
    name: "Chen One Linen Trouser Suit — Charcoal",
    brandSlug: "chen-one", categorySlug: "womens-clothing",
    description: "Sophisticated linen trouser suit in charcoal grey with pearl buttons.",
    price: 7490, oldPrice: 9490, image: "promo-fashion.png", images: ["promo-fashion.png"],
    rating: "4.6", reviewCount: 210, stock: 40, sold: 520,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["linen", "formal"],
  },

  // ── MEN'S CLOTHING ────────────────────────────────────────────────
  {
    slug: "alkaram-mens-lawn-shalwar-kameez",
    name: "Men's Premium Lawn Shalwar Kameez",
    brandSlug: "alkaram", categorySlug: "mens-clothing",
    description: "Premium summer lawn for men in classic ivory. Stitched with hidden placket and self collar.",
    price: 4290, oldPrice: 5490, image: "promo-band-1.jpg", images: ["promo-band-1.jpg"],
    rating: "4.5", reviewCount: 312, stock: 64, sold: 980,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["mens", "lawn", "stitched"],
  },
  {
    slug: "gul-ahmed-mens-kurta-white",
    name: "Gul Ahmed Men's Embroidered Kurta — White",
    brandSlug: "gul-ahmed", categorySlug: "mens-clothing",
    description: "Classic white kurta with tonal embroidery at the neckline and cuffs.",
    price: 3490, oldPrice: 4290, image: "promo-band-1.jpg", images: ["promo-band-1.jpg"],
    rating: "4.7", reviewCount: 480, stock: 72, sold: 1640,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["kurta", "mens", "eid"],
  },
  {
    slug: "bonanza-mens-printed-kameez",
    name: "Bonanza Satrangi Men's Printed Kameez",
    brandSlug: "bonanza", categorySlug: "mens-clothing",
    description: "Trendy printed kameez in soft cotton blend. Perfect for casual outings.",
    price: 2490, oldPrice: 2990, image: "promo-band-1.jpg", images: ["promo-band-1.jpg"],
    rating: "4.3", reviewCount: 195, stock: 120, sold: 560,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["mens", "casual", "printed"],
  },

  // ── FOOTWEAR ──────────────────────────────────────────────────────
  {
    slug: "service-leather-loafers-cognac",
    name: "Hand-Stitched Leather Loafers — Cognac",
    brandSlug: "service", categorySlug: "footwear",
    description: "Full-grain leather loafers, hand-stitched in Lahore. Memory-foam insole and rubber sole.",
    price: 5490, oldPrice: 6990, image: "product-shoes.png", images: ["product-shoes.png"],
    rating: "4.7", reviewCount: 880, stock: 35, sold: 1520,
    isFlashDeal: true, isNew: false, isFeatured: true, tags: ["shoes", "leather", "mens"],
  },
  {
    slug: "borjan-kolhapuri-chappals-tan",
    name: "Kolhapuri Chappals — Tan",
    brandSlug: "borjan", categorySlug: "footwear",
    description: "Traditional kolhapuri chappals in vegetable-tanned tan leather. Open weave, breathable.",
    price: 2490, oldPrice: null, image: "product-shoes.png", images: ["product-shoes.png"],
    rating: "4.4", reviewCount: 226, stock: 110, sold: 640,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["chappals", "traditional"],
  },
  {
    slug: "service-ladies-court-shoes-black",
    name: "Service Ladies Court Shoes — Black",
    brandSlug: "service", categorySlug: "footwear",
    description: "Classic pointed-toe court shoes in genuine leather with block heel.",
    price: 4290, oldPrice: 5290, image: "product-shoes.png", images: ["product-shoes.png"],
    rating: "4.5", reviewCount: 340, stock: 48, sold: 820,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["shoes", "ladies", "formal"],
  },

  // ── ACCESSORIES & EASTERN WEAR ────────────────────────────────────
  {
    slug: "khaadi-silk-dupatta-emerald",
    name: "Khaadi Pure Silk Dupatta — Emerald",
    brandSlug: "khaadi", categorySlug: "accessories",
    description: "Hand-dyed pure silk dupatta in deep emerald with zari border.",
    price: 3490, oldPrice: 4290, image: "promo-fashion.png", images: ["promo-fashion.png"],
    rating: "4.8", reviewCount: 290, stock: 65, sold: 740,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["dupatta", "silk", "accessories"],
  },
  {
    slug: "bonanza-eastern-embroidered-eid-collection",
    name: "Bonanza Eastern Embroidered Eid Collection",
    brandSlug: "bonanza", categorySlug: "eastern-wear",
    description: "Luxurious cotton-net embroidered suit from the Eid collection with zardozi details.",
    price: 8990, oldPrice: 11990, image: "product-khaadi.png", images: ["product-khaadi.png"],
    rating: "4.9", reviewCount: 520, stock: 30, sold: 1120,
    isFlashDeal: true, isNew: true, isFeatured: true, tags: ["eastern", "eid", "embroidered"],
  },

  // ── SMARTPHONES ───────────────────────────────────────────────────
  {
    slug: "samsung-galaxy-a55-5g-256gb",
    name: "Samsung Galaxy A55 5G — 256GB Awesome Navy",
    brandSlug: "samsung", categorySlug: "smartphones",
    description: "50MP OIS camera, 5000mAh battery, 6.6\" Super AMOLED, 5G, PTA approved.",
    price: 99999, oldPrice: 109999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.7", reviewCount: 1420, stock: 32, sold: 2840,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["5g", "samsung", "android"],
  },
  {
    slug: "infinix-hot-40-pro-256gb",
    name: "Infinix Hot 40 Pro — 256GB",
    brandSlug: "infinix", categorySlug: "smartphones",
    description: "6.78\" AMOLED, 108MP camera, 5000mAh, 45W fast-charging. Budget powerhouse.",
    price: 49999, oldPrice: 54999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.4", reviewCount: 680, stock: 60, sold: 2100,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["android", "budget", "infinix"],
  },
  {
    slug: "xiaomi-redmi-note-13-pro-256gb",
    name: "Xiaomi Redmi Note 13 Pro — 256GB",
    brandSlug: "xiaomi", categorySlug: "smartphones",
    description: "200MP camera, 6.67\" AMOLED 120Hz, 5100mAh, 67W turbo charging. PTA approved.",
    price: 79999, oldPrice: 89999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.6", reviewCount: 940, stock: 45, sold: 2560,
    isFlashDeal: true, isNew: false, isFeatured: true, tags: ["xiaomi", "camera", "android"],
  },
  {
    slug: "oppo-reno-11-pro-256gb",
    name: "Oppo Reno 11 Pro — 256GB",
    brandSlug: "oppo", categorySlug: "smartphones",
    description: "50MP triple camera, 6.7\" curved AMOLED, 4600mAh, 80W SuperVOOC. PTA approved.",
    price: 109999, oldPrice: 119999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.6", reviewCount: 510, stock: 28, sold: 980,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["oppo", "flagship", "android"],
  },
  {
    slug: "tecno-spark-20-pro-256gb",
    name: "Tecno Spark 20 Pro — 256GB",
    brandSlug: "tecno", categorySlug: "smartphones",
    description: "108MP camera, 6.78\" display, 5000mAh, slim 7.4mm profile.",
    price: 39999, oldPrice: 44999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.2", reviewCount: 380, stock: 80, sold: 1560,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["budget", "tecno"],
  },
  {
    slug: "apple-iphone-15-128gb-pink",
    name: "Apple iPhone 15 — 128GB Pink",
    brandSlug: "apple", categorySlug: "smartphones",
    description: "A16 Bionic chip, 48MP main camera, Dynamic Island, USB-C. PTA approved.",
    price: 289999, oldPrice: 299999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.9", reviewCount: 2240, stock: 18, sold: 3800,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["iphone", "apple", "ios"],
  },
  {
    slug: "samsung-galaxy-tab-a8-wifi",
    name: "Samsung Galaxy Tab A8 — WiFi 64GB",
    brandSlug: "samsung", categorySlug: "tablets",
    description: "10.5\" TFT display, Unisoc T618, 7040mAh, Dolby Atmos speakers.",
    price: 59999, oldPrice: 69999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.5", reviewCount: 420, stock: 35, sold: 740,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["tablet", "samsung"],
  },
  {
    slug: "xiaomi-fast-charger-67w",
    name: "Xiaomi 67W Turbo Fast Charger",
    brandSlug: "xiaomi", categorySlug: "mobile-accessories",
    description: "67W USB-C charger compatible with Xiaomi, Samsung, Oppo and all PD devices.",
    price: 2990, oldPrice: 3490, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.6", reviewCount: 820, stock: 200, sold: 3400,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["charger", "usb-c"],
  },

  // ── ELECTRONICS ───────────────────────────────────────────────────
  {
    slug: "haier-1-5-ton-inverter-ac",
    name: "Haier 1.5 Ton Inverter AC — White",
    brandSlug: "haier", categorySlug: "home-appliances",
    description: "DC Inverter, turbo cooling, WiFi-enabled, self-cleaning, energy-saver A+++ rated.",
    price: 149999, oldPrice: 169999, image: "product-ac.png", images: ["product-ac.png"],
    rating: "4.7", reviewCount: 528, stock: 18, sold: 760,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["ac", "inverter", "cooling"],
  },
  {
    slug: "dawlance-refrigerator-308l",
    name: "Dawlance Double Door Refrigerator 308L",
    brandSlug: "dawlance", categorySlug: "home-appliances",
    description: "308L capacity, no-frost, inverter compressor, digital display, glass shelves.",
    price: 99999, oldPrice: 114999, image: "product-ac.png", images: ["product-ac.png"],
    rating: "4.6", reviewCount: 340, stock: 22, sold: 580,
    isFlashDeal: true, isNew: false, isFeatured: true, tags: ["refrigerator", "no-frost"],
  },
  {
    slug: "haier-microwave-oven-30l",
    name: "Haier Microwave Oven 30L — Silver",
    brandSlug: "haier", categorySlug: "kitchenware",
    description: "30L solo microwave with 5 power levels, defrost, and 30-minute timer. 900W.",
    price: 19999, oldPrice: 24999, image: "product-ac.png", images: ["product-ac.png"],
    rating: "4.4", reviewCount: 290, stock: 40, sold: 620,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["microwave", "kitchen"],
  },
  {
    slug: "samsung-43-crystal-uhd-4k-tv",
    name: "Samsung 43\" Crystal UHD 4K Smart TV",
    brandSlug: "samsung", categorySlug: "televisions",
    description: "PurColor, HDR, Crystal Processor 4K and Tizen smart hub with YouTube and Netflix.",
    price: 119999, oldPrice: 134999, image: "promo-band-2.jpg", images: ["promo-band-2.jpg"],
    rating: "4.6", reviewCount: 188, stock: 24, sold: 410,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["tv", "4k", "smart"],
  },
  {
    slug: "haier-55-android-tv-4k",
    name: "Haier 55\" Android 4K UHD Smart TV",
    brandSlug: "haier", categorySlug: "televisions",
    description: "55\" 4K UHD, Android 11, Google Assistant, Dolby Audio, 60Hz.",
    price: 139999, oldPrice: 159999, image: "promo-band-2.jpg", images: ["promo-band-2.jpg"],
    rating: "4.5", reviewCount: 260, stock: 14, sold: 320,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["tv", "android", "4k"],
  },
  {
    slug: "sony-wh-1000xm4-headphones",
    name: "Sony WH-1000XM4 Noise-Cancelling Headphones",
    brandSlug: "sony", categorySlug: "audio",
    description: "Industry-leading noise cancellation, 30h battery, LDAC, multipoint connection.",
    price: 84999, oldPrice: 94999, image: "promo-band-2.jpg", images: ["promo-band-2.jpg"],
    rating: "4.9", reviewCount: 1640, stock: 30, sold: 1280,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["headphones", "anc", "sony"],
  },
  {
    slug: "dell-inspiron-15-i5-laptop",
    name: "Dell Inspiron 15 — Intel i5 8GB/512GB SSD",
    brandSlug: "dell", categorySlug: "laptops",
    description: "15.6\" FHD display, Intel Core i5-1235U, 8GB DDR5, 512GB NVMe SSD, Win 11.",
    price: 149999, oldPrice: 169999, image: "product-phone.png", images: ["product-phone.png"],
    rating: "4.6", reviewCount: 480, stock: 20, sold: 640,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["laptop", "dell", "windows"],
  },

  // ── GROCERY ───────────────────────────────────────────────────────
  {
    slug: "national-mango-pickle-1kg",
    name: "Punjabi Mango Pickle (Achar) 1kg",
    brandSlug: "national", categorySlug: "spices-masalas",
    description: "Sun-cured raw mango pickle in mustard oil with traditional Punjabi spices.",
    price: 690, oldPrice: 890, image: "product-pickle.png", images: ["product-pickle.png"],
    rating: "4.8", reviewCount: 1620, stock: 240, sold: 5640,
    isFlashDeal: true, isNew: false, isFeatured: true, tags: ["achar", "pantry"],
  },
  {
    slug: "shan-biryani-masala-bundle-of-6",
    name: "Shan Biryani Masala Bundle (6 packs)",
    brandSlug: "shan", categorySlug: "spices-masalas",
    description: "Six packs of Shan's classic Bombay Biryani masala. Pantry-stock essential.",
    price: 990, oldPrice: 1290, image: "product-pickle.png", images: ["product-pickle.png"],
    rating: "4.9", reviewCount: 2120, stock: 320, sold: 7240,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["biryani", "masala"],
  },
  {
    slug: "national-chaat-masala-200g",
    name: "Chaat Masala 200g",
    brandSlug: "national", categorySlug: "spices-masalas",
    description: "Tangy, spicy chaat masala for fruit chaat, dahi bhalla and street snacks.",
    price: 320, oldPrice: null, image: "product-pickle.png", images: ["product-pickle.png"],
    rating: "4.7", reviewCount: 540, stock: 420, sold: 1860,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["masala", "snacks"],
  },
  {
    slug: "knorr-chicken-cubes-24-pack",
    name: "Knorr Chicken Cubes — Pack of 24",
    brandSlug: "knorr", categorySlug: "spices-masalas",
    description: "Rich chicken stock cubes for gravies, soups and rice. No MSG.",
    price: 420, oldPrice: 490, image: "product-pickle.png", images: ["product-pickle.png"],
    rating: "4.6", reviewCount: 780, stock: 500, sold: 3200,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["stock", "cubes"],
  },
  {
    slug: "tapal-danedar-loose-tea-950g",
    name: "Tapal Danedar Loose Tea 950g",
    brandSlug: "tapal", categorySlug: "beverages",
    description: "Granular black tea blended for that strong, milky doodh-patti.",
    price: 1690, oldPrice: 1990, image: "product-tea.png", images: ["product-tea.png"],
    rating: "4.8", reviewCount: 980, stock: 180, sold: 4320,
    isFlashDeal: true, isNew: false, isFeatured: true, tags: ["chai", "tea"],
  },
  {
    slug: "tapal-family-mixture-450g",
    name: "Tapal Family Mixture Tea 450g",
    brandSlug: "tapal", categorySlug: "beverages",
    description: "Premium blend of CTC and leaf tea for a perfectly balanced cup.",
    price: 890, oldPrice: 1090, image: "product-tea.png", images: ["product-tea.png"],
    rating: "4.7", reviewCount: 640, stock: 220, sold: 2850,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["chai", "tea"],
  },
  {
    slug: "lays-classic-salted-party-pack",
    name: "Lays Classic Salted Party Pack 200g",
    brandSlug: "lays", categorySlug: "snacks",
    description: "Crispy classic salted potato chips in a large party-size pack.",
    price: 290, oldPrice: 350, image: "product-pickle.png", images: ["product-pickle.png"],
    rating: "4.5", reviewCount: 920, stock: 600, sold: 4800,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["chips", "snacks"],
  },

  // ── HOME & LIFESTYLE ──────────────────────────────────────────────
  {
    slug: "handwoven-jute-floor-cushion",
    name: "Handwoven Jute Floor Cushion",
    brandSlug: "khaadi", categorySlug: "home-decor",
    description: "Hand-woven jute floor cushion with cotton-canvas back.",
    price: 4290, oldPrice: 5290, image: "promo-band-1.jpg", images: ["promo-band-1.jpg"],
    rating: "4.6", reviewCount: 142, stock: 30, sold: 220,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["home", "decor"],
  },
  {
    slug: "block-printed-cotton-bedsheet-king",
    name: "Block Printed Cotton Bedsheet — King",
    brandSlug: "sapphire", categorySlug: "bedding-bath",
    description: "King-size cotton bedsheet with hand block-printed indigo motifs and two pillow covers.",
    price: 5990, oldPrice: 7490, image: "promo-band-2.jpg", images: ["promo-band-2.jpg"],
    rating: "4.7", reviewCount: 320, stock: 56, sold: 480,
    isFlashDeal: true, isNew: false, isFeatured: true, tags: ["bedsheet", "home"],
  },
  {
    slug: "chen-one-velvet-cushion-covers-set-of-5",
    name: "Chen One Velvet Cushion Covers — Set of 5",
    brandSlug: "chen-one", categorySlug: "bedding-bath",
    description: "Plush velvet cushion covers in jewel tones. 18×18 inch. Machine washable.",
    price: 2990, oldPrice: 3490, image: "promo-band-1.jpg", images: ["promo-band-1.jpg"],
    rating: "4.5", reviewCount: 195, stock: 80, sold: 620,
    isFlashDeal: false, isNew: true, isFeatured: false, tags: ["cushion", "velvet", "home"],
  },

  // ── BEAUTY & HEALTH ───────────────────────────────────────────────
  {
    slug: "rose-amber-attar-12ml",
    name: "Rose & Amber Attar 12ml",
    brandSlug: "khaadi", categorySlug: "fragrances",
    description: "Alcohol-free attar with Pakistani rose and warm amber.",
    price: 2490, oldPrice: 2990, image: "promo-band-2.jpg", images: ["promo-band-2.jpg"],
    rating: "4.8", reviewCount: 410, stock: 88, sold: 1320,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["attar", "fragrance"],
  },
  {
    slug: "saffron-honey-face-glow-serum",
    name: "Saffron & Honey Glow Serum 30ml",
    brandSlug: "khaadi", categorySlug: "skincare",
    description: "Lightweight serum with Pakistani saffron, raw honey and niacinamide.",
    price: 1890, oldPrice: 2390, image: "promo-band-1.jpg", images: ["promo-band-1.jpg"],
    rating: "4.6", reviewCount: 220, stock: 140, sold: 760,
    isFlashDeal: true, isNew: true, isFeatured: false, tags: ["skincare", "serum"],
  },
  {
    slug: "national-almond-oil-hair-100ml",
    name: "National Pure Almond Hair Oil 100ml",
    brandSlug: "national", categorySlug: "hair-care",
    description: "Cold-pressed almond oil for hair growth and shine.",
    price: 590, oldPrice: 750, image: "promo-band-2.jpg", images: ["promo-band-2.jpg"],
    rating: "4.7", reviewCount: 680, stock: 300, sold: 2400,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["hair", "oil", "almond"],
  },

  // ── MOTHER & BABY ─────────────────────────────────────────────────
  {
    slug: "organic-cotton-baby-jhabla-set-of-3",
    name: "Organic Cotton Baby Jhabla — Set of 3",
    brandSlug: "alkaram", categorySlug: "mother-baby",
    description: "Soft organic-cotton jhablas in newborn-friendly pastel prints.",
    price: 1890, oldPrice: 2390, image: "summer-edit.jpg", images: ["summer-edit.jpg"],
    rating: "4.9", reviewCount: 540, stock: 120, sold: 1450,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["baby", "newborn", "cotton"],
  },
  {
    slug: "muslin-swaddle-blanket-set-of-2",
    name: "Muslin Swaddle Blanket — Set of 2",
    brandSlug: "sapphire", categorySlug: "mother-baby",
    description: "Pre-washed double-layer muslin swaddles. Breathable, light and gets softer with wash.",
    price: 2290, oldPrice: 2790, image: "summer-edit.jpg", images: ["summer-edit.jpg"],
    rating: "4.8", reviewCount: 280, stock: 90, sold: 620,
    isFlashDeal: true, isNew: false, isFeatured: false, tags: ["baby", "muslin"],
  },

  // ── SPORTS ────────────────────────────────────────────────────────
  {
    slug: "nike-revolution-6-running-shoes",
    name: "Nike Revolution 6 Running Shoes",
    brandSlug: "nike", categorySlug: "fitness",
    description: "Lightweight foam midsole for cushioned runs. Mesh upper for breathability.",
    price: 12990, oldPrice: 14990, image: "product-shoes.png", images: ["product-shoes.png"],
    rating: "4.6", reviewCount: 740, stock: 45, sold: 1280,
    isFlashDeal: false, isNew: false, isFeatured: true, tags: ["running", "nike", "shoes"],
  },
  {
    slug: "gray-nicolls-cricket-bat-english-willow",
    name: "Gray-Nicolls English Willow Cricket Bat",
    brandSlug: "gray-nicolls", categorySlug: "cricket",
    description: "Grade 2 English willow, 2.7lb, pre-oiled, ideal for club and academy play.",
    price: 18990, oldPrice: 22990, image: "product-shoes.png", images: ["product-shoes.png"],
    rating: "4.8", reviewCount: 320, stock: 25, sold: 480,
    isFlashDeal: false, isNew: true, isFeatured: true, tags: ["cricket", "bat", "willow"],
  },
  {
    slug: "adidas-tango-football-size-5",
    name: "Adidas Tango Football — Size 5",
    brandSlug: "adidas", categorySlug: "outdoor",
    description: "Synthetic leather football with butyl bladder for consistent shape and rebound.",
    price: 3490, oldPrice: 3990, image: "product-shoes.png", images: ["product-shoes.png"],
    rating: "4.4", reviewCount: 420, stock: 80, sold: 1100,
    isFlashDeal: false, isNew: false, isFeatured: false, tags: ["football", "sports"],
  },
];

const testimonials: InsertTestimonial[] = [
  { name: "Ayesha Tariq", city: "Lahore", rating: 5, comment: "Finally a Pakistani site that doesn't look like a 2008 spreadsheet. My Khaadi suit reached DHA in less than 48 hours, packed beautifully.", initials: "AT", position: 1 },
  { name: "Bilal Hussain", city: "Karachi", rating: 5, comment: "Ordered the Haier inverter AC at flash-deal price — installation was free in Clifton and the unit is genuinely silent. PakMart became my default.", initials: "BH", position: 2 },
  { name: "Sana Mehmood", city: "Islamabad", rating: 5, comment: "I do all my monthly grocery here now. Tapal Danedar, Shan masalas, achar — every single thing original and at better prices than my local store.", initials: "SM", position: 3 },
  { name: "Hamza Khan", city: "Rawalpindi", rating: 4, comment: "The Samsung A55 came sealed, PTA approved, with the imported charger. Cash on delivery worked smoothly with the rider.", initials: "HK", position: 4 },
  { name: "Fariha Iqbal", city: "Faisalabad", rating: 5, comment: "I bought my baby's organic jhabla set and it's the softest cotton I have touched. Stitching is clean, sizes run true. Will reorder.", initials: "FI", position: 5 },
  { name: "Usman Akhtar", city: "Multan", rating: 5, comment: "Finally somewhere I trust to ship Borjan chappals and Service loafers without a fake-stock surprise. Returns were painless.", initials: "UA", position: 6 },
];

async function seed(): Promise<void> {
  await db.delete(productsTable);
  await db.delete(brandsTable);
  await db.delete(categoriesTable);
  await db.delete(testimonialsTable);

  await db.insert(categoriesTable).values(categories);
  await db.insert(brandsTable).values(brands);
  await db.insert(productsTable).values(products);
  await db.insert(testimonialsTable).values(testimonials);

  console.log(
    `Seeded ${categories.length} categories (${categories.filter(c => c.parentSlug).length} sub), ${brands.length} brands, ${products.length} products, ${testimonials.length} testimonials.`,
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
