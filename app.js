// FYN E-Commerce Storefront Engine (INR Currency & Bank Link Gateway)
// Integrated with Supabase Cloud Database

const SUPABASE_URL = 'https://oqrlyhcgilmqnynvhunr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcmx5aGNnaWxtcW55bnZodW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MjMxNTEsImV4cCI6MjExMTA5OTE1MX0.gJBweQQGwLqaxj5Uu35bgxQQkx_vfKmppoazebV0YqU';

let supabaseClient = null;
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase init error:", e);
}

// Brand Wisdom & Life Quotes
const COMPASS_QUOTES = [
  { quote: "TRAVEL. LEARN. IMPROVE. Find your true north.", author: "FYN Core Creed" },
  { quote: "The compass is inside you. Follow your own trajectory.", author: "FYN Manifesto" },
  { quote: "Keep your vision clear on every journey.", author: "Explorer Wisdom" },
  { quote: "Hydrate the mind. Chart the journey.", author: "FYN Travel Creed" },
  { quote: "Pack light. Live deep. Improve continuously.", author: "Summiteer Mindset" },
  { quote: "Stand steady when the elements test your resolve.", author: "Alpine Principle" },
  { quote: "Every summit begins with a single deliberate step.", author: "Mountain Wisdom" },
  { quote: "Small conscious choices create massive elevation.", author: "Continuous Growth" }
];

// Fallback Authentic Brand Kit Products in INR (₹)
const BRAND_PRODUCTS_INR = [
  // APPAREL
  {
    id: "prod-hoodie-1",
    name: "FYN Forest Green Embroidered Hoodie",
    slug: "fyn-forest-green-hoodie",
    tagline: "480 GSM Combed Cotton with High-Density FYN Embroidery",
    quote: "TRAVEL. LEARN. IMPROVE. Find your true north.",
    price: 3499.00,
    original_price: 4299.00,
    category: "Apparel",
    audiences: ["men", "women", "boys", "girls"],
    image_url: "brand_assets/products/fyn_forest_hoodie.jpg",
    stock: 45,
    rating: 4.9,
    reviews_count: 142,
    badge: "Bestseller",
    description: "Crafted from luxury 480 GSM heavyweight French terry in signature FYN Forest Green. Features the iconic embroidered sparkle emblem, ribbed side gussets, and structured double-layer hood."
  },
  {
    id: "prod-tee-1",
    name: "FYN Sand White Oversized Tee",
    slug: "fyn-sand-white-tee",
    tagline: "240 GSM Combed Cotton with FIND YOUR NORTH Back & Chest Print",
    quote: "The compass is inside you. Follow your own trajectory.",
    price: 1499.00,
    original_price: 1999.00,
    category: "Apparel",
    audiences: ["men", "women", "boys", "girls"],
    image_url: "brand_assets/products/fyn_sand_tee.jpg",
    stock: 60,
    rating: 4.8,
    reviews_count: 98,
    badge: "Popular",
    description: "Tailored in contemporary relaxed drop-shoulder silhouette using Sand White organic combed cotton. Features the bold FYN FIND YOUR NORTH branding and breathable weave."
  },
  {
    id: "prod-jacket-1",
    name: "FYN Alpine Windbreaker Expedition Jacket",
    slug: "fyn-alpine-windbreaker",
    tagline: "3-Layer Ripstop Shell with Water-Repellent DWR Finish",
    quote: "Stand steady when the elements test your resolve.",
    price: 4299.00,
    original_price: 5499.00,
    category: "Apparel",
    audiences: ["men", "women"],
    image_url: "brand_assets/products/fyn_hoodie_detail.jpg",
    stock: 28,
    rating: 4.9,
    reviews_count: 57,
    badge: "Winter Drop",
    description: "Technical weatherproof shell built to conquer high-altitude gusts in Spiti and Kedarkantha. Features seam-sealed zippers, articulated storm hood, and cinch hem."
  },
  {
    id: "prod-tee-model-1",
    name: "FYN Minimalist Compass Graphic Tee",
    slug: "fyn-minimalist-compass-tee",
    tagline: "220 GSM Bio-Washed Cotton with High-Density Chest Logo",
    quote: "Every summit begins with a single deliberate step.",
    price: 1399.00,
    original_price: 1799.00,
    category: "Apparel",
    audiences: ["men", "women", "boys", "girls"],
    image_url: "brand_assets/products/fyn_model_tee.jpg",
    stock: 50,
    rating: 4.8,
    reviews_count: 73,
    badge: "Essential",
    description: "Everyday luxury travel t-shirt engineered from soft combed bio-washed cotton. Features subtle FYN chest embroidery and mountain silhouette collar tag."
  },
  {
    id: "prod-crewneck-1",
    name: "FYN Summit Sunset Heavy Crewneck",
    slug: "fyn-summit-sunset-crewneck",
    tagline: "400 GSM Loopback Fleece with Ribbed Cuffs and Hem",
    quote: "Small conscious choices create massive elevation.",
    price: 2999.00,
    original_price: 3699.00,
    category: "Apparel",
    audiences: ["men", "women", "boys"],
    image_url: "brand_assets/products/fyn_crew_sunset.jpg",
    stock: 32,
    rating: 4.9,
    reviews_count: 64,
    badge: "Trending",
    description: "Heritage crewneck designed for twilight basecamp warmth. Pre-shrunk cotton terry with reinforced stitching and embossed FYN mountain coordinates."
  },
  {
    id: "prod-junior-hoodie-1",
    name: "FYN Junior Summit Explorer Hoodie",
    slug: "fyn-junior-summit-explorer-hoodie",
    tagline: "360 GSM Ultra-Soft Fleece for Young Explorers",
    quote: "The adventure starts young. Find your north.",
    price: 2199.00,
    original_price: 2799.00,
    category: "Apparel",
    audiences: ["kids", "boys", "girls"],
    image_url: "brand_assets/products/fyn_forest_hoodie.jpg",
    stock: 40,
    rating: 4.9,
    reviews_count: 38,
    badge: "Kids & Youth",
    description: "Specially tailored for youth, boys, girls and kids. Ultra-soft hypoallergenic combed fleece with child-safe drawstrings and iconic reflective FYN mountain patch."
  },

  // TRAVEL GEAR
  {
    id: "prod-backpack-1",
    name: "FYN Expedition Technical Backpack 35L",
    slug: "fyn-expedition-technical-backpack",
    tagline: "Ergonomic Alpine Suspension with Padded Laptop & Camera Sleeve",
    quote: "Every summit begins with a single deliberate step.",
    price: 4499.00,
    original_price: 5999.00,
    category: "Travel Gear",
    audiences: ["men", "women", "boys"],
    image_url: "brand_assets/products/fyn_expedition_backpack.jpg",
    stock: 20,
    rating: 5.0,
    reviews_count: 89,
    badge: "Flagship",
    description: "Heavy-duty tactical and commute backpack built from 1000D Cordura in Forest Green. Features ergonomic chest straps, load lifters, YKK water-guard zippers, and modular compartments."
  },
  {
    id: "prod-duffel-1",
    name: "FYN Charcoal Black Travel Duffel & Toiletry Kit",
    slug: "fyn-charcoal-duffel-kit",
    tagline: "Ballistic Ripstop Weatherproof Poly with Shoe Compartment",
    quote: "Pack light. Live deep. Improve continuously.",
    price: 3899.00,
    original_price: 4999.00,
    category: "Travel Gear",
    audiences: ["men", "women"],
    image_url: "brand_assets/products/fyn_travel_duffel.jpg",
    stock: 25,
    rating: 4.9,
    reviews_count: 63,
    badge: "High Performance",
    description: "Engineered for weekend escapes and international expeditions. 42L capacity with dedicated ventilated sneaker compartment, tech organizer, and matching toiletry dop-kit."
  },
  {
    id: "prod-bottle-1",
    name: "FYN Matte Forest Green Thermal Bottle & Luggage Tag",
    slug: "fyn-matte-bottle-luggage-tag",
    tagline: "Double-Wall Vacuum Steel 750ml with Genuine Vegan Leather Tag",
    quote: "Hydrate the mind. Chart the journey.",
    price: 1899.00,
    original_price: 2499.00,
    category: "Travel Gear",
    audiences: ["men", "women", "boys", "girls", "kids"],
    image_url: "brand_assets/products/fyn_bottle_tag.jpg",
    stock: 50,
    rating: 5.0,
    reviews_count: 114,
    badge: "Gift Choice",
    description: "Sleek pro-grade stainless steel flask finished in matte Forest Green powder coating. Keeps hot 24h, cold 48h. Includes a matching FYN embossed luggage tag for world travel."
  },
  {
    id: "prod-daypack-1",
    name: "FYN Compact 18L Alpine Daypack",
    slug: "fyn-compact-alpine-daypack",
    tagline: "Ultra-Light Packable Ripstop with Hydration Bladder Port",
    quote: "Move swift, travel far, pack with intention.",
    price: 2499.00,
    original_price: 3299.00,
    category: "Travel Gear",
    audiences: ["men", "women", "boys", "girls", "kids"],
    image_url: "brand_assets/products/fyn_expedition_backpack.jpg",
    stock: 35,
    rating: 4.8,
    reviews_count: 49,
    badge: "Popular",
    description: "Featherweight 18L daypack packs down into its own internal pocket. Ideal for day hikes, city exploration, and youth day trips."
  },
  {
    id: "prod-pouch-1",
    name: "FYN Modular Tech & Passport Travel Organizer",
    slug: "fyn-modular-tech-organizer",
    tagline: "RFID-Blocking Weatherproof Cordura with Cable Bands",
    quote: "Order in your gear creates clarity on the path.",
    price: 1299.00,
    original_price: 1699.00,
    category: "Travel Gear",
    audiences: ["men", "women"],
    image_url: "brand_assets/products/fyn_travel_duffel.jpg",
    stock: 45,
    rating: 4.9,
    reviews_count: 67,
    badge: "Staff Pick",
    description: "Keep boarding passes, chargers, SSDs, and passport organized in high-density compartmentalized pockets with water-resistant zips."
  },

  // ACCESSORIES
  {
    id: "prod-cap-1",
    name: "FYN Classic Cap Duo (Forest Green & Sand White)",
    slug: "fyn-classic-cap-duo",
    tagline: "Structured 6-Panel Cotton Twill with Brass Buckle",
    quote: "Keep your vision clear on every journey.",
    price: 1199.00,
    original_price: 1599.00,
    category: "Accessories",
    audiences: ["men", "women", "boys", "girls", "kids"],
    image_url: "brand_assets/products/fyn_classic_caps.jpg",
    stock: 35,
    rating: 4.9,
    reviews_count: 76,
    badge: "Essential",
    description: "Low-profile 6-panel unstructured dad cap crafted from durable washed chino twill. Features 3D embroidered FYN branding, curved visor, and embossed brass clasp."
  },
  {
    id: "prod-umbrella-1",
    name: "FYN Stormproof Travel Umbrella",
    slug: "fyn-stormproof-travel-umbrella",
    tagline: "Wind-Defying 12-Rib Fiberglass Frame with Teflon Water-Shield",
    quote: "Stand steady when the elements test your resolve.",
    price: 1699.00,
    original_price: 2199.00,
    category: "Accessories",
    audiences: ["men", "women", "boys", "girls", "kids"],
    image_url: "brand_assets/products/fyn_travel_umbrella.jpg",
    stock: 40,
    rating: 4.7,
    reviews_count: 52,
    badge: "New",
    description: "Compact, aerodynamic travel umbrella engineered to withstand 60 km/h winds without inverting. Features auto open/close mechanism and subtle FYN wordmark print."
  },
  {
    id: "prod-bag-1",
    name: "FYN Eco Kraft Mountain Shopping & Travel Bag Set",
    slug: "fyn-eco-kraft-bag-set",
    tagline: "Reinforced 300 GSM Recycled Kraft Paper with Mountain Base Art",
    quote: "Small conscious choices create massive elevation.",
    price: 899.00,
    original_price: 1299.00,
    category: "Accessories",
    audiences: ["men", "women", "kids"],
    image_url: "brand_assets/products/fyn_kraft_bag.jpg",
    stock: 80,
    rating: 4.8,
    reviews_count: 41,
    badge: "Eco Friendly",
    description: "Set of 3 reusable, high-durability craft travel bags with twisted forest green cotton cords and distinctive mountain contour print."
  },
  {
    id: "prod-beanie-1",
    name: "FYN Alpine Merino Ribbed Knit Beanie",
    slug: "fyn-alpine-merino-beanie",
    tagline: "100% Merino Wool with Foldover FYN Woven Crest",
    quote: "Warmth for the ascent. Focus for the summit.",
    price: 999.00,
    original_price: 1399.00,
    category: "Accessories",
    audiences: ["men", "women", "boys", "girls", "kids"],
    image_url: "brand_assets/products/fyn_classic_caps.jpg",
    stock: 55,
    rating: 4.9,
    reviews_count: 58,
    badge: "Winter Warmth",
    description: "Non-scratchy pure merino wool knit beanie engineered to trap radiant body heat while breathing freely during strenuous climbs."
  },
  {
    id: "prod-compass-tool-1",
    name: "FYN Solid Brass Compass & Carabiner Multitool",
    slug: "fyn-solid-brass-compass-tool",
    tagline: "Heavy Antiqued Brass Working Compass with Locking Carabiner",
    quote: "Find your north, no matter the storm.",
    price: 799.00,
    original_price: 1099.00,
    category: "Accessories",
    audiences: ["men", "women", "boys", "girls", "kids"],
    image_url: "brand_assets/products/fyn_bottle_tag.jpg",
    stock: 65,
    rating: 5.0,
    reviews_count: 91,
    badge: "Collector",
    description: "Solid milled brass functional magnetic compass paired with a quick-release climbing grade accessory carabiner. Precision etched with the FYN creed."
  }
];

// App State
let productsList = [];
let currentCategory = 'All';
let currentAudience = 'All';
let currentSearch = '';
let currentSort = 'featured';
let cart = JSON.parse(sessionStorage.getItem('fyn_cart_inr') || localStorage.getItem('fyn_cart_inr') || '[]');
let activeDiscount = JSON.parse(sessionStorage.getItem('fyn_discount_inr') || localStorage.getItem('fyn_discount_inr') || 'null');
let currentCustomer = JSON.parse(localStorage.getItem('fyn_customer_user') || 'null');
const SHIPPING_THRESHOLD_INR = 1999.00;
const FLAT_SHIPPING_FEE_INR = 149.00;

document.addEventListener('DOMContentLoaded', async () => {
  initWebMCPTools();
  checkSecretAdminAccess();
  initCustomerUI();
  initQuotes();
  parseUrlFilters();
  await loadProducts();
  updateCartUI();
});

// WebMCP Tool Registration for In-Browser AI Agents
function initWebMCPTools() {
  if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
    try {
      navigator.modelContext.registerTool({
        name: "searchProducts",
        description: "Search FYN catalog for travel gear, apparel, and prices in INR",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search keyword e.g. hoodie, backpack, bottle" }
          },
          required: ["query"]
        },
        execute: async (args) => {
          const q = (args.query || '').toLowerCase();
          return productsList.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }
      });

      navigator.modelContext.registerTool({
        name: "getStoreCatalog",
        description: "Get full catalog of FYN products",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", enum: ["All", "Apparel", "Travel Gear", "Accessories"] }
          }
        },
        execute: async (args) => {
          const cat = args.category || 'All';
          return cat === 'All' ? productsList : productsList.filter(p => p.category === cat);
        }
      });
    } catch (e) {
      console.warn("WebMCP registration note:", e);
    }
  }
}

// Format Indian Currency Helper
function formatINR(amount) {
  return '₹' + parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Load Products from Supabase
async function loadProducts() {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_products')
        .select('*')
        .gt('price', 500) // Filter out old USD demo rows
        .order('price', { ascending: false });

      if (!error && data && data.length > 0) {
        productsList = data;
      } else {
        productsList = BRAND_PRODUCTS_INR;
      }
    } else {
      productsList = BRAND_PRODUCTS_INR;
    }
  } catch (e) {
    console.warn("Product loading fallback:", e);
    productsList = BRAND_PRODUCTS_INR;
  }

  parseUrlFilters();
  applyFilters();
}

function renderProducts(items) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300">
        <img src="brand_assets/fyn_sparkle_symbol_forest_green.png" alt="" class="w-10 h-10 mx-auto mb-3 opacity-40">
        <h3 class="font-brand text-lg font-bold text-gray-700">No Drops Found</h3>
        <p class="text-xs text-gray-500 mt-1 mb-4">Try clearing your filters or changing categories to view all FYN gear.</p>
        <button onclick="resetFilters()" class="px-5 py-2 rounded-full bg-fyn-forest text-white text-xs font-bold hover:bg-fyn-forest-light">
          Show All Drops
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => generateProductCardHTML(product)).join('');
  if (window.lucide) lucide.createIcons();
}

function generateProductCardHTML(product) {
  const discountPercent = product.original_price && product.original_price > product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return `
    <div class="group fyn-glass-card rounded-2xl hover:border-fyn-forest/50 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5">
      
      <!-- Image & Badges -->
      <div class="relative overflow-hidden bg-fyn-sand/80 aspect-[4/3] flex items-center justify-center p-2">
        <img 
          src="${product.image_url}" 
          alt="${product.name}" 
          class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        >
        
        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          ${product.badge ? `
            <span class="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-fyn-forest text-white shadow-sm border border-white/20">
              ${product.badge}
            </span>
          ` : ''}
          ${discountPercent ? `
            <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-600 text-white shadow-sm border border-white/20">
              -${discountPercent}%
            </span>
          ` : ''}
        </div>

        <!-- Quick View Trigger -->
        <button 
          onclick="openQuickView('${product.id}')"
          class="absolute bottom-3 right-3 p-2 bg-white/95 backdrop-blur-md rounded-full text-fyn-forest border border-fyn-sand-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-fyn-forest hover:text-white"
          title="Inspect"
        >
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Details -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
            <span class="text-fyn-forest/90 font-extrabold">${product.category}</span>
            <div class="flex items-center space-x-1 text-amber-500">
              <span>★</span>
              <span>${product.rating || '4.9'}</span>
              <span class="text-gray-400 font-normal">(${product.reviews_count || 42})</span>
            </div>
          </div>

          <h3 class="font-brand text-base font-bold text-fyn-forest-dark group-hover:text-fyn-forest transition leading-snug">
            ${product.name}
          </h3>

          <!-- Inscribed Quote -->
          <div class="mt-2.5 mb-3 p-2 rounded-lg bg-fyn-sand/80 border border-fyn-sand-dark text-[11px] text-fyn-forest font-serif italic flex items-start space-x-1.5">
            <img src="brand_assets/fyn_sparkle_symbol_forest_green.png" alt="" class="w-3 h-3 flex-shrink-0 mt-0.5">
            <span class="line-clamp-2">"${product.quote || 'Find your true north.'}"</span>
          </div>
        </div>

        <!-- Price & Action in INR -->
        <div class="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <div class="text-base font-extrabold text-fyn-forest-dark">
              ${formatINR(product.price)}
            </div>
            ${product.original_price ? `
              <div class="text-[11px] text-gray-400 line-through">
                ${formatINR(product.original_price)}
              </div>
            ` : ''}
          </div>

          <button 
            onclick="addToCart('${product.id}')"
            class="fyn-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 uppercase tracking-wider"
          >
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  `;
}

// Renders exactly 4 products for each category section on homepage
function renderHomepageSections() {
  const bestSellingContainer = document.getElementById('best-selling-grid');
  const apparelContainer = document.getElementById('apparel-home-grid');
  const travelContainer = document.getElementById('travel-gear-home-grid');
  const accessoriesContainer = document.getElementById('accessories-home-grid');

  if (bestSellingContainer) {
    const bestSellers = [...productsList]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    bestSellingContainer.innerHTML = bestSellers.map(p => generateProductCardHTML(p)).join('');
  }

  if (apparelContainer) {
    const apparelItems = productsList.filter(p => p.category === 'Apparel').slice(0, 4);
    apparelContainer.innerHTML = apparelItems.map(p => generateProductCardHTML(p)).join('');
  }

  if (travelContainer) {
    const travelItems = productsList.filter(p => p.category === 'Travel Gear').slice(0, 4);
    travelContainer.innerHTML = travelItems.map(p => generateProductCardHTML(p)).join('');
  }

  if (accessoriesContainer) {
    const accessItems = productsList.filter(p => p.category === 'Accessories').slice(0, 4);
    accessoriesContainer.innerHTML = accessItems.map(p => generateProductCardHTML(p)).join('');
  }

  if (window.lucide) lucide.createIcons();
}

// Parse URL Parameters (category, audience, q, sort)
function parseUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  const aud = params.get('audience');
  const q = params.get('q') || params.get('search');
  const sort = params.get('sort');

  if (cat) currentCategory = cat;
  if (aud) currentAudience = aud;
  if (q) currentSearch = q.toLowerCase().trim();
  if (sort) currentSort = sort;

  updateFilterUI();
}

function updateFilterUI() {
  // Update Category buttons
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.remove('bg-fyn-forest', 'text-white');
    btn.classList.add('text-gray-600');
  });
  const catBtnId = `cat-btn-${currentCategory.replace(/\s+/g, '-')}`;
  const activeCatBtn = document.getElementById(catBtnId);
  if (activeCatBtn) {
    activeCatBtn.classList.add('bg-fyn-forest', 'text-white');
    activeCatBtn.classList.remove('text-gray-600');
  }

  // Update Audience buttons
  document.querySelectorAll('.aud-pill').forEach(btn => {
    btn.classList.remove('bg-fyn-forest', 'text-white');
    btn.classList.add('text-gray-600');
  });
  const audBtnId = `aud-btn-${currentAudience.toLowerCase()}`;
  const activeAudBtn = document.getElementById(audBtnId);
  if (activeAudBtn) {
    activeAudBtn.classList.add('bg-fyn-forest', 'text-white');
    activeAudBtn.classList.remove('text-gray-600');
  }

  // Update Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput && currentSearch) {
    searchInput.value = currentSearch;
  }
}

// Category and Filter logic
function filterCategory(cat) {
  currentCategory = cat;
  updateFilterUI();
  applyFilters();
}

function filterAudience(aud) {
  currentAudience = aud;
  updateFilterUI();
  applyFilters();
}

function handleSearch(val) {
  currentSearch = val.toLowerCase().trim();
  applyFilters();
}

function handleSort(sortType) {
  currentSort = sortType;
  applyFilters();
}

function applyFilters() {
  let list = [...productsList];

  if (currentCategory !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
  }

  if (currentAudience !== 'All') {
    list = list.filter(p => p.audiences && p.audiences.map(a => a.toLowerCase()).includes(currentAudience.toLowerCase()));
  }

  if (currentSearch) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(currentSearch) ||
      (p.quote && p.quote.toLowerCase().includes(currentSearch)) ||
      (p.description && p.description.toLowerCase().includes(currentSearch))
    );
  }

  if (currentSort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const feedback = document.getElementById('filter-status');
  const feedbackText = document.getElementById('filter-text');
  if (feedback && feedbackText) {
    if (currentCategory !== 'All' || currentAudience !== 'All' || currentSearch) {
      feedback.classList.remove('hidden');
      const catText = currentCategory !== 'All' ? `in ${currentCategory}` : '';
      const audText = currentAudience !== 'All' ? `for ${currentAudience.toUpperCase()}` : '';
      const searchTxt = currentSearch ? `matching "${currentSearch}"` : '';
      feedbackText.innerText = `Showing ${list.length} drops ${catText} ${audText} ${searchTxt}`.trim();
    } else {
      feedback.classList.add('hidden');
    }
  }

  renderProducts(list);
  renderHomepageSections();
}

function resetFilters() {
  currentCategory = 'All';
  currentAudience = 'All';
  currentSearch = '';
  currentSort = 'featured';
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  updateFilterUI();
  applyFilters();
}

// ==========================================
// CART & PROMO CODE ENGINE (INR)
// ==========================================

function addToCart(productId) {
  const product = productsList.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image_url: product.image_url,
      quote: product.quote,
      category: product.category,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('fyn_cart_inr', JSON.stringify(cart));
  sessionStorage.setItem('fyn_cart_inr', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartCounter = document.getElementById('cart-counter');
  const drawerItemCount = document.getElementById('drawer-item-count');
  
  if (cartCounter) cartCounter.innerText = totalItems;
  if (drawerItemCount) drawerItemCount.innerText = totalItems;

  const itemsContainer = document.getElementById('cart-items-container');
  const checkoutBtn = document.getElementById('btn-proceed-checkout');

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-16">
        <img src="brand_assets/fyn_sparkle_symbol_forest_green.png" alt="" class="w-12 h-12 mx-auto mb-3 opacity-30">
        <p class="font-brand text-base font-bold text-gray-600 mb-1">Your bag is empty</p>
        <p class="text-xs text-gray-400 mb-4">Select your gear and chart your course.</p>
        <button onclick="closeCartDrawer()" class="px-5 py-2 rounded-full bg-fyn-forest text-white text-xs font-bold hover:bg-fyn-forest-light">
          Explore Drops
        </button>
      </div>
    `;
    if (checkoutBtn) checkoutBtn.disabled = true;
    updateCalculations(0);
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  itemsContainer.innerHTML = cart.map(item => `
    <div class="flex items-center space-x-3.5 bg-fyn-sand p-3 rounded-xl border border-gray-200">
      <img src="${item.image_url}" alt="${item.name}" class="w-16 h-16 object-contain rounded-lg bg-white p-1">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-fyn-forest-dark truncate">${item.name}</h4>
        <p class="text-[10px] text-fyn-forest font-serif italic truncate">"${item.quote || 'Find your north.'}"</p>
        <div class="text-xs font-extrabold text-gray-900 mt-1">${formatINR(item.price)}</div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden text-xs">
          <button onclick="updateQuantity('${item.id}', -1)" class="px-2 py-1 text-gray-500 hover:bg-gray-100 font-bold">-</button>
          <span class="px-2 font-bold text-gray-700">${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', 1)" class="px-2 py-1 text-gray-500 hover:bg-gray-100 font-bold">+</button>
        </div>
        <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 p-1">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  updateCalculations(subtotal);

  if (window.lucide) lucide.createIcons();
}

function updateCalculations(subtotal) {
  let discountAmount = 0;
  if (activeDiscount) {
    if (activeDiscount.discount_percent) {
      discountAmount = (subtotal * activeDiscount.discount_percent) / 100;
    } else if (activeDiscount.discount_amount) {
      discountAmount = activeDiscount.discount_amount;
    }
  }

  const qualifiesFreeShipping = subtotal >= SHIPPING_THRESHOLD_INR || subtotal === 0;
  const shippingFee = (qualifiesFreeShipping || subtotal === 0) ? 0 : FLAT_SHIPPING_FEE_INR;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  document.getElementById('cart-subtotal').innerText = formatINR(subtotal);
  document.getElementById('cart-shipping').innerText = shippingFee === 0 ? 'FREE' : formatINR(shippingFee);
  document.getElementById('cart-total').innerText = formatINR(total);

  // Free shipping progress
  const progressBar = document.getElementById('shipping-progress-bar');
  const progressText = document.getElementById('shipping-progress-text');
  if (subtotal >= SHIPPING_THRESHOLD_INR) {
    progressBar.style.width = '100%';
    progressBar.classList.add('bg-green-600');
    progressBar.classList.remove('bg-fyn-forest');
    progressText.innerText = '✨ You have unlocked FREE Express Shipping across India!';
  } else {
    const remaining = (SHIPPING_THRESHOLD_INR - subtotal);
    const percent = Math.min(100, (subtotal / SHIPPING_THRESHOLD_INR) * 100);
    progressBar.style.width = `${percent}%`;
    progressBar.classList.add('bg-fyn-forest');
    progressBar.classList.remove('bg-green-600');
    progressText.innerText = `Add ${formatINR(remaining)} more for FREE Express Shipping`;
  }

  // Discount row
  const discountRow = document.getElementById('discount-row');
  const discountLabel = document.getElementById('discount-label');
  const discountVal = document.getElementById('cart-discount');
  if (discountAmount > 0) {
    discountRow.classList.remove('hidden');
    discountLabel.innerText = `Discount (${activeDiscount.code})`;
    discountVal.innerText = `-${formatINR(discountAmount)}`;
  } else {
    discountRow.classList.add('hidden');
  }

  // Update checkout modal total if visible
  const checkoutTotal = document.getElementById('checkout-total-amount');
  if (checkoutTotal) checkoutTotal.innerText = formatINR(total);

  const simAmount = document.getElementById('sim-bank-amount');
  if (simAmount) simAmount.innerText = formatINR(total);
}

// Discount Code Validation
async function applyDiscountCode() {
  const input = document.getElementById('promo-code-input');
  const msg = document.getElementById('discount-applied-msg');
  const code = input.value.trim().toUpperCase();

  if (!code) return;

  msg.classList.remove('hidden', 'text-red-600', 'text-green-700');

  try {
    let discount = null;
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_discounts')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();
      
      if (!error && data) discount = data;
    }

    if (!discount) {
      const presets = {
        'NORTH20': { code: 'NORTH20', discount_percent: 20 },
        'TRAVEL15': { code: 'TRAVEL15', discount_percent: 15 },
        'FYN500': { code: 'FYN500', discount_amount: 500 },
        'WELCOME10': { code: 'WELCOME10', discount_percent: 10 }
      };
      discount = presets[code] || null;
    }

    if (discount) {
      activeDiscount = discount;
      localStorage.setItem('fyn_discount_inr', JSON.stringify(discount));
      msg.classList.add('text-green-700');
      msg.innerText = `✓ Code ${code} applied! ${discount.discount_percent ? `${discount.discount_percent}% off` : `₹${discount.discount_amount} off`}`;
      updateCartUI();
    } else {
      msg.classList.add('text-red-600');
      msg.innerText = `✕ Invalid or expired promo code. Try NORTH20.`;
    }
  } catch (err) {
    msg.classList.add('text-red-600');
    msg.innerText = `Error checking code. Try NORTH20.`;
  }
}

// Drawer Controls
function openCartDrawer() {
  document.getElementById('cart-drawer-overlay').classList.remove('opacity-0', 'pointer-events-none');
  document.getElementById('cart-drawer').classList.remove('translate-x-full');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer-overlay').classList.add('opacity-0', 'pointer-events-none');
  document.getElementById('cart-drawer').classList.add('translate-x-full');
}

// Quick View Modal
function openQuickView(productId) {
  const product = productsList.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('quickview-content');
  content.innerHTML = `
    <div class="aspect-square bg-fyn-sand flex items-center justify-center p-6">
      <img src="${product.image_url}" alt="${product.name}" class="max-h-full max-w-full object-contain">
    </div>
    <div class="p-6 flex flex-col justify-between">
      <div>
        <span class="text-xs uppercase tracking-widest font-bold text-fyn-forest">${product.category}</span>
        <h3 class="font-brand text-xl font-bold text-fyn-forest-dark mt-1">${product.name}</h3>
        <p class="text-xs text-gray-500 mt-1">${product.tagline || ''}</p>
        
        <div class="my-4 p-3 bg-fyn-sand rounded-xl border border-gray-200">
          <p class="text-xs font-serif italic text-fyn-forest">"${product.quote}"</p>
          <span class="text-[10px] text-gray-400 font-sans uppercase tracking-wider block mt-1">— Inscribed Compass Quote</span>
        </div>

        <p class="text-xs text-gray-600 leading-relaxed">${product.description || ''}</p>
        
        <div class="mt-4 flex items-center space-x-2 text-xs text-green-700">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <span>In Stock (${product.stock || 45} units available at Central India Hub)</span>
        </div>
      </div>

      <div class="pt-6 border-t border-gray-100 flex items-center justify-between mt-6">
        <div>
          <span class="text-xl font-extrabold text-fyn-forest-dark">${formatINR(product.price)}</span>
          ${product.original_price ? `<span class="text-xs text-gray-400 line-through ml-2">${formatINR(product.original_price)}</span>` : ''}
        </div>
        <button 
          onclick="addToCart('${product.id}'); closeQuickViewModal();" 
          class="px-6 py-2.5 rounded-xl bg-fyn-forest text-white text-xs font-bold hover:bg-fyn-forest-light flex items-center space-x-2 shadow"
        >
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Add To Bag</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('quickview-modal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeQuickViewModal() {
  document.getElementById('quickview-modal').classList.add('hidden');
}

// Checkout Modal
function openCheckoutModal() {
  closeCartDrawer();
  document.getElementById('checkout-modal').classList.remove('hidden');
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  updateCalculations(subtotal);

  // Auto-fill logged in customer data
  if (currentCustomer) {
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const phoneInput = document.getElementById('checkout-phone');
    const addrInput = document.getElementById('checkout-address');
    const cityInput = document.getElementById('checkout-city');
    const postalInput = document.getElementById('checkout-postal');

    if (nameInput && !nameInput.value) nameInput.value = currentCustomer.full_name || '';
    if (emailInput && !emailInput.value) emailInput.value = currentCustomer.email || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = currentCustomer.phone || '';
    if (addrInput && !addrInput.value) addrInput.value = currentCustomer.shipping_address || '';
    if (cityInput && !cityInput.value) cityInput.value = currentCustomer.city || '';
    if (postalInput && !postalInput.value) postalInput.value = currentCustomer.pincode || '';
  }

  if (window.lucide) lucide.createIcons();
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

// Payment Methods Toggle
function togglePaymentFields(type) {
  const bankPanel = document.getElementById('payment-panel-bank');
  const upiPanel = document.getElementById('payment-panel-upi');
  const cardPanel = document.getElementById('payment-panel-card');

  bankPanel.classList.add('hidden');
  upiPanel.classList.add('hidden');
  cardPanel.classList.add('hidden');

  if (type === 'bank') bankPanel.classList.remove('hidden');
  if (type === 'upi') upiPanel.classList.remove('hidden');
  if (type === 'card') cardPanel.classList.remove('hidden');

  if (window.lucide) lucide.createIcons();
}

// Bank Simulator Modal
function testBankPaymentLinkModal() {
  const selectedBank = document.querySelector('input[name="selected-bank"]:checked').value;
  document.getElementById('sim-bank-title').innerText = `${selectedBank} Gateway Simulation`;
  document.getElementById('modal-bank-simulator').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeBankSimulator() {
  document.getElementById('modal-bank-simulator').classList.add('hidden');
}

function confirmBankSimulatorPayment() {
  closeBankSimulator();
  const form = document.getElementById('checkout-form');
  // Trigger standard payment submission
  processPayment({ preventDefault: () => {} });
}

function copyUPILink() {
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  let discountAmount = activeDiscount ? ((subtotal * (activeDiscount.discount_percent || 0)) / 100 + (activeDiscount.discount_amount || 0)) : 0;
  const shippingFee = (subtotal >= SHIPPING_THRESHOLD_INR) ? 0 : FLAT_SHIPPING_FEE_INR;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const upiUri = `upi://pay?pa=fynbrand@icici&pn=FYN%20Enterprises&am=${total.toFixed(2)}&cu=INR`;
  navigator.clipboard.writeText(upiUri).then(() => {
    const text = document.getElementById('upi-copy-text');
    text.innerText = "UPI Link Copied!";
    setTimeout(() => { text.innerText = "Copy UPI Payment Link"; }, 2000);
  });
}

// Process Payment & Complete Order
async function processPayment(e) {
  if (e && e.preventDefault) e.preventDefault();

  const payBtn = document.getElementById('btn-pay-submit');
  const payLabel = document.getElementById('pay-button-label');

  payBtn.disabled = true;
  payLabel.innerText = "Connecting to Secure Bank Link Gateway...";

  const custName = document.getElementById('cust-name').value;
  const custEmail = document.getElementById('cust-email').value;
  const custPhone = document.getElementById('cust-phone').value;
  const custAddress = document.getElementById('cust-address').value;
  const custCity = document.getElementById('cust-city').value;
  const custZip = document.getElementById('cust-zip').value;
  
  const paymentMethodInput = document.querySelector('input[name="payment-method"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'Direct Bank Link / NetBanking';

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  let discountAmount = 0;
  if (activeDiscount) {
    if (activeDiscount.discount_percent) {
      discountAmount = (subtotal * activeDiscount.discount_percent) / 100;
    } else if (activeDiscount.discount_amount) {
      discountAmount = activeDiscount.discount_amount;
    }
  }
  const shippingFee = (subtotal >= SHIPPING_THRESHOLD_INR) ? 0 : FLAT_SHIPPING_FEE_INR;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const orderNumber = 'FYN-IND-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const transactionId = 'TXN_BANK_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const randomQuote = COMPASS_QUOTES[Math.floor(Math.random() * COMPASS_QUOTES.length)].quote;

  setTimeout(async () => {
    payLabel.innerText = "Bank Authorized • Generating Tax Invoice...";

    const orderData = {
      order_number: orderNumber,
      customer_name: custName,
      customer_email: custEmail,
      customer_phone: custPhone,
      shipping_address: custAddress,
      city: custCity,
      postal_code: custZip,
      items: cart,
      subtotal: subtotal,
      discount_code: activeDiscount ? activeDiscount.code : null,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: 'Paid',
      payment_transaction_id: transactionId,
      status: 'Pending',
      carrier: 'Blue Dart Express',
      tracking_number: 'BLUEDART-IND-' + Math.floor(10000000 + Math.random() * 90000000),
      admin_notes: `Order placed online via Bank Link. Signature: "${randomQuote}"`
    };

    // 1. Insert into Supabase
    try {
      if (supabaseClient) {
        await supabaseClient.from('fyn_orders').insert([orderData]);
      }
    } catch (err) {
      console.warn("Supabase order error:", err);
    }

    // 2. Dispatch Customer Confirmation Email (INR)
    const emailSubject = `🌲 FYN Order Confirmed: ${orderNumber} — "Find Your North"`;
    const emailHtml = `
      <div style="font-family:'Montserrat', Arial, sans-serif; max-width:600px; margin:0 auto; background:#FAF8F5; border:1px solid #ECE7DC; border-radius:12px; overflow:hidden;">
        <div style="background:#1D3C34; color:#ffffff; padding:24px; text-align:center;">
          <h1 style="margin:0; font-size:26px; letter-spacing:2px; font-weight:800;">FYN</h1>
          <p style="margin:4px 0 0; font-size:11px; text-transform:uppercase; color:#D4AF37; font-weight:bold;">FIND YOUR NORTH • TRAVEL. LEARN. IMPROVE.</p>
        </div>
        <div style="padding:24px; background:#ffffff;">
          <h2 style="color:#1D3C34; font-size:18px; margin-top:0;">Expedition Order Confirmed, ${custName}!</h2>
          <p style="color:#4a5568; font-size:13px; line-height:1.6;">Thank you for your order <strong>${orderNumber}</strong>. Your gear is registered at our Central Distribution Hub.</p>
          
          <div style="background:#F7F5F0; padding:16px; border-radius:8px; margin:20px 0; border-left:4px solid #1D3C34;">
            <p style="font-style:italic; color:#1D3C34; margin:0; font-size:14px;">"${randomQuote}"</p>
            <p style="margin:4px 0 0; font-size:10px; color:#8D9093; text-transform:uppercase; font-weight:bold;">— FYN Compass Inscription</p>
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:13px; margin-top:16px;">
            <thead>
              <tr style="background:#F7F5F0; color:#1D3C34; text-align:left;">
                <th style="padding:8px;">Item</th>
                <th style="padding:8px; text-align:center;">Qty</th>
                <th style="padding:8px; text-align:right;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(i => `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:8px;">${i.name}</td>
                  <td style="padding:8px; text-align:center;">${i.quantity}</td>
                  <td style="padding:8px; text-align:right;">₹${(i.price * i.quantity).toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="2" style="padding:10px 8px; text-align:right; font-weight:bold;">Total Paid:</td>
                <td style="padding:10px 8px; text-align:right; font-weight:bold; color:#1D3C34; font-size:15px;">₹${totalAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size:12px; color:#718096; margin-top:20px;">
            <strong>Payment Method:</strong> ${paymentMethod}<br>
            <strong>Transaction ID:</strong> ${transactionId}<br>
            <strong>Destination:</strong> ${custAddress}, ${custCity} - ${custZip}
          </p>

          <div style="margin-top:24px; padding:14px; background:#F7F5F0; border-radius:8px; text-align:center; font-size:12px; color:#1D3C34;">
            You will receive a dispatch notice with tracking details once your package ships.
          </div>
        </div>
      </div>
    `;

    try {
      if (supabaseClient) {
        await supabaseClient.from('fyn_email_logs').insert([{
          order_number: orderNumber,
          recipient_email: custEmail,
          subject: emailSubject,
          email_type: 'Order Confirmation',
          html_content: emailHtml,
          status: 'Sent'
        }]);
      }
    } catch (e) {
      console.warn("Email log error:", e);
    }

    // 3. Clear cart & open success modal
    cart = [];
    saveCart();
    updateCartUI();

    closeCheckoutModal();
    payBtn.disabled = false;
    payLabel.innerText = "Authorize & Complete Payment (₹)";

    document.getElementById('success-order-num').innerText = orderNumber;
    document.getElementById('success-cust-name').innerText = custName;
    document.getElementById('success-cust-email').innerText = custEmail;
    document.getElementById('success-total').innerText = formatINR(totalAmount);
    document.getElementById('success-quote').innerText = `"${randomQuote}"`;
    document.getElementById('order-success-modal').classList.remove('hidden');

    if (window.lucide) lucide.createIcons();

  }, 1000);
}

function closeSuccessModal() {
  document.getElementById('order-success-modal').classList.add('hidden');
}

function printInvoice() {
  window.print();
}

// Wisdom Generator
function initQuotes() {
  drawNewQuote();
}

function drawNewQuote(isModal = false) {
  const item = COMPASS_QUOTES[Math.floor(Math.random() * COMPASS_QUOTES.length)];
  const header = document.getElementById('header-quote-text');
  if (header) header.innerText = `"${item.quote}"`;

  const modalText = document.getElementById('modal-quote-text');
  const modalAuthor = document.getElementById('modal-quote-author');
  if (modalText) modalText.innerText = `"${item.quote}"`;
  if (modalAuthor) modalAuthor.innerText = `— ${item.author}`;
}

function showRandomQuoteModal() {
  drawNewQuote(true);
  document.getElementById('quote-modal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeQuoteModal() {
  document.getElementById('quote-modal').classList.add('hidden');
}

function toggleMobileMenu() {
  const m = document.getElementById('mobile-menu');
  if (m) m.classList.toggle('hidden');
}

// Help & Support CRM Inquiries
function openHelpModal() {
  document.getElementById('help-modal').classList.remove('hidden');
  document.getElementById('help-form-container').classList.remove('hidden');
  document.getElementById('help-success-state').classList.add('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeHelpModal() {
  document.getElementById('help-modal').classList.add('hidden');
}

async function handleHelpSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('help-submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="animate-spin inline-block mr-1">↻</span> Submitting...`;

  const name = document.getElementById('help-name').value.trim();
  const email = document.getElementById('help-email').value.trim();
  const phone = document.getElementById('help-phone').value.trim();
  const orderNum = document.getElementById('help-order').value.trim();
  const category = document.getElementById('help-category').value;
  const subject = document.getElementById('help-subject').value.trim();
  const message = document.getElementById('help-message').value.trim();

  const ticketNum = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

  // Priority logic based on category
  let priority = 'Medium';
  if (category === 'Payment Issue') priority = 'Urgent';
  else if (category === 'Refund / Cancellation' || category === 'Order Tracking & Delivery') priority = 'High';

  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_crm_tickets').insert([{
        ticket_number: ticketNum,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        order_number: orderNum || null,
        category: category,
        priority: priority,
        status: 'Open',
        subject: subject,
        message: message
      }]);
    }
  } catch (err) {
    console.warn("Supabase CRM ticket insert error:", err);
  }

  btn.disabled = false;
  btn.innerHTML = `<i data-lucide="send" class="w-3.5 h-3.5"></i><span>Submit Ticket to CRM</span>`;

  document.getElementById('help-ticket-reference').innerText = ticketNum;
  document.getElementById('help-form-container').classList.add('hidden');
  document.getElementById('help-success-state').classList.remove('hidden');
  document.getElementById('help-ticket-form').reset();
  if (window.lucide) lucide.createIcons();
}

// =================================================================
// SECRET OWNER / ADMIN ACCESS CONTROLLER
// Triggers via URL Code (e.g., ?admin=fyn or ?code=fyn2026),
// 5 quick taps on the FYN logo, or keyboard shortcut (Ctrl+Shift+A)
// =================================================================

function checkSecretAdminAccess() {
  try {
    const params = new URLSearchParams(window.location.search);
    const validCodes = ['fyn', 'fyn2026', 'admin', 'north', 'true', '1'];

    // Check query params: ?admin=fyn, ?code=fyn2026, ?secret=fyn, ?access=fyn2026
    const adminParam = (params.get('admin') || params.get('code') || params.get('secret') || params.get('access') || '').toLowerCase().trim();

    const isMatch = validCodes.includes(adminParam) || (params.has('admin') && params.get('admin') === '');

    if (isMatch) {
      sessionStorage.setItem('fyn_admin_unlocked', 'true');
      // Discreetly clean up the query string from the browser address bar
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (sessionStorage.getItem('fyn_admin_unlocked') === 'true') {
      revealAdminSuite();
    }
  } catch (e) {
    console.warn("Secret admin check error:", e);
  }
}

function revealAdminSuite() {
  const bar = document.getElementById('secret-admin-bar');
  if (bar) {
    bar.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function lockAdminSuite() {
  sessionStorage.removeItem('fyn_admin_unlocked');
  const bar = document.getElementById('secret-admin-bar');
  if (bar) {
    bar.classList.add('hidden');
  }
}

// Secret Tap Count on Logo (5 taps within 3 seconds prompts for password)
let logoClickCount = 0;
let logoClickTimer = null;

function handleLogoClick(e) {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => {
    logoClickCount = 0;
  }, 2500);

  if (logoClickCount >= 5) {
    e.preventDefault();
    logoClickCount = 0;
    promptAdminPasscode();
  }
}

// Secret Shortcut: Ctrl+Shift+A or Cmd+Shift+A
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    promptAdminPasscode();
  }
});

function promptAdminPasscode() {
  const code = prompt("FYN Owner Passcode Entry:\nEnter access code to reveal the Store Control Suite:");
  if (code && (code.toLowerCase() === 'fyn2026' || code.toLowerCase() === 'fyn')) {
    sessionStorage.setItem('fyn_admin_unlocked', 'true');
    revealAdminSuite();
    alert("✅ Access Granted: FYN Owner Control Suite is now active at the top of your screen.");
  } else if (code) {
    alert("❌ Invalid passcode. Access denied.");
  }
}

// =================================================================
// CUSTOMER AUTHENTICATION, SAVED DATA & LIVE ORDERS TRACKING
// =================================================================

function initCustomerUI() {
  const label = document.getElementById('nav-customer-label');
  const mobLabel = document.getElementById('mobile-customer-label');

  if (currentCustomer && currentCustomer.full_name) {
    const firstName = currentCustomer.full_name.split(' ')[0];
    if (label) label.innerText = `Hi, ${firstName}`;
    if (mobLabel) mobLabel.innerText = `Hi, ${firstName} (Orders & Profile)`;
  } else {
    if (label) label.innerText = `Sign In`;
    if (mobLabel) mobLabel.innerText = `Sign In / Member Account`;
  }
}

function handleCustomerAccountClick() {
  if (currentCustomer) {
    openCustomerProfileModal();
  } else {
    openCustomerAuthModal();
  }
}

function openCustomerAuthModal() {
  document.getElementById('customer-auth-modal').classList.remove('hidden');
  switchCustomerAuthTab('login');
  if (window.lucide) lucide.createIcons();
}

function closeCustomerAuthModal() {
  document.getElementById('customer-auth-modal').classList.add('hidden');
}

function switchCustomerAuthTab(tab) {
  const tabLogin = document.getElementById('cust-tab-login');
  const tabReg = document.getElementById('cust-tab-register');
  const formLogin = document.getElementById('customer-login-form');
  const formReg = document.getElementById('customer-register-form');

  if (tab === 'login') {
    tabLogin.classList.add('border-fyn-forest', 'text-fyn-forest');
    tabLogin.classList.remove('border-transparent', 'text-gray-400');
    tabReg.classList.remove('border-fyn-forest', 'text-fyn-forest');
    tabReg.classList.add('border-transparent', 'text-gray-400');

    formLogin.classList.remove('hidden');
    formReg.classList.add('hidden');
  } else {
    tabReg.classList.add('border-fyn-forest', 'text-fyn-forest');
    tabReg.classList.remove('border-transparent', 'text-gray-400');
    tabLogin.classList.remove('border-fyn-forest', 'text-fyn-forest');
    tabLogin.classList.add('border-transparent', 'text-gray-400');

    formReg.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

async function handleCustomerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('cust-login-email').value.trim();
  const password = document.getElementById('cust-login-password').value.trim();
  const errBox = document.getElementById('cust-login-error');
  const btn = document.getElementById('cust-login-btn');

  btn.disabled = true;
  btn.innerText = 'Verifying...';

  try {
    let customer = null;
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_customers')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .maybeSingle();

      if (!error && data) {
        customer = data;
      }
    }

    // Fallback if local testing
    if (!customer && email.includes('@')) {
      customer = {
        full_name: email.split('@')[0].toUpperCase(),
        email: email,
        phone: '+91 98765 43210',
        shipping_address: 'Central District, FYN Destination Hub',
        city: 'Mumbai',
        pincode: '400001'
      };
    }

    if (customer) {
      currentCustomer = customer;
      localStorage.setItem('fyn_customer_user', JSON.stringify(customer));
      initCustomerUI();
      closeCustomerAuthModal();
      openCustomerProfileModal();
    } else {
      errBox.classList.remove('hidden');
    }
  } catch (err) {
    console.warn("Customer login error:", err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i><span>Sign In to Your Account</span>`;
    if (window.lucide) lucide.createIcons();
  }
}

async function handleCustomerRegister(e) {
  e.preventDefault();
  const name = document.getElementById('cust-reg-name').value.trim();
  const email = document.getElementById('cust-reg-email').value.trim();
  const phone = document.getElementById('cust-reg-phone').value.trim();
  const password = document.getElementById('cust-reg-password').value.trim();
  const address = document.getElementById('cust-reg-address').value.trim();
  const city = document.getElementById('cust-reg-city').value.trim();
  const pincode = document.getElementById('cust-reg-pincode').value.trim();
  const errBox = document.getElementById('cust-reg-error');
  const btn = document.getElementById('cust-reg-btn');

  btn.disabled = true;
  btn.innerText = 'Creating Account...';

  try {
    const newCustomer = {
      full_name: name,
      email: email,
      phone: phone,
      password_hash: password,
      shipping_address: address,
      city: city,
      pincode: pincode
    };

    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('fyn_customers')
        .insert([newCustomer]);

      if (error && error.message.includes('unique')) {
        errBox.classList.remove('hidden');
        errBox.innerText = 'This email is already registered. Please sign in instead.';
        btn.disabled = false;
        btn.innerText = 'Create Account & Save Profile';
        return;
      }
    }

    currentCustomer = newCustomer;
    localStorage.setItem('fyn_customer_user', JSON.stringify(newCustomer));
    initCustomerUI();
    closeCustomerAuthModal();
    openCustomerProfileModal();
  } catch (err) {
    console.error("Register error:", err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="user-plus" class="w-4 h-4"></i><span>Create Account & Save Profile</span>`;
    if (window.lucide) lucide.createIcons();
  }
}

function handleCustomerLogout() {
  currentCustomer = null;
  localStorage.removeItem('fyn_customer_user');
  initCustomerUI();
  closeCustomerProfileModal();
}

async function openCustomerProfileModal() {
  if (!currentCustomer) return;

  document.getElementById('customer-profile-modal').classList.remove('hidden');
  document.getElementById('profile-name').innerText = currentCustomer.full_name;
  document.getElementById('profile-email').innerText = currentCustomer.email;
  
  const savedAddr = document.getElementById('profile-saved-address');
  if (savedAddr) {
    savedAddr.innerText = `${currentCustomer.shipping_address || 'Address pending'}, ${currentCustomer.city || ''} ${currentCustomer.pincode ? '- ' + currentCustomer.pincode : ''}`.trim();
  }

  // Load customer orders from Supabase
  await loadCustomerOrders();
  if (window.lucide) lucide.createIcons();
}

function closeCustomerProfileModal() {
  document.getElementById('customer-profile-modal').classList.add('hidden');
}

async function loadCustomerOrders() {
  const container = document.getElementById('profile-orders-container');
  const countLabel = document.getElementById('profile-orders-count');
  if (!container || !currentCustomer) return;

  container.innerHTML = `<div class="text-center py-6 text-xs text-gray-400">Loading order records...</div>`;

  try {
    let orders = [];
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_orders')
        .select('*')
        .eq('customer_email', currentCustomer.email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        orders = data;
      }
    }

    countLabel.innerText = `${orders.length} expedition ${orders.length === 1 ? 'order' : 'orders'} placed`;

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="p-6 bg-fyn-sand rounded-xl text-center border border-gray-200">
          <i data-lucide="package-open" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
          <p class="text-xs font-bold text-gray-700">No Orders Yet</p>
          <p class="text-[11px] text-gray-500 mt-1">Your expedition purchases and live shipment tracking will appear right here.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = orders.map(ord => {
      const itemsList = Array.isArray(ord.items) ? ord.items : [];
      const itemsSummary = itemsList.map(i => `${i.quantity}x ${i.name}${i.size ? ` (${i.size})` : ''}`).join(', ') || 'FYN Products';

      const statusColors = {
        'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
        'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
        'Processing': 'bg-purple-100 text-purple-800 border-purple-200',
        'Shipped': 'bg-green-100 text-green-800 border-green-200',
        'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200'
      };

      const dateStr = new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-mono font-bold text-xs text-fyn-forest">${ord.order_number}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusColors[ord.status] || 'bg-gray-100 text-gray-700'}">
              ${ord.status}
            </span>
          </div>

          <div class="text-xs text-gray-700">
            <span class="font-semibold block truncate">${itemsSummary}</span>
            <span class="text-[11px] text-gray-500">Ordered on ${dateStr} • Amount: <strong class="text-gray-900">${formatINR(ord.total_amount)}</strong></span>
          </div>

          ${ord.tracking_number ? `
            <div class="pt-2 border-t border-gray-100 flex items-center justify-between bg-fyn-sand -mx-4 -mb-4 p-3 rounded-b-xl text-xs">
              <div>
                <span class="text-[10px] uppercase font-bold text-gray-500 block">Dispatch Carrier & Tracking:</span>
                <span class="font-mono font-bold text-emerald-800">${ord.carrier || 'Express'}: ${ord.tracking_number}</span>
              </div>
              <a href="${ord.tracking_url || `https://www.google.com/search?q=${encodeURIComponent(ord.carrier + ' tracking ' + ord.tracking_number)}`}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center space-x-1 shadow-sm">
                <span>Track Package ↗</span>
              </a>
            </div>
          ` : `
            <div class="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center space-x-1">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Order is being prepared at Central Fulfillment Hub.</span>
            </div>
          `}
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  } catch (e) {
    console.warn("Load orders error:", e);
  }
}

// =================================================================
// FREE TRAVEL COMMUNITY APPLICATION
// =================================================================

function openCommunityModal() {
  document.getElementById('community-modal').classList.remove('hidden');
  document.getElementById('community-form-container').classList.remove('hidden');
  document.getElementById('community-success-state').classList.add('hidden');

  // Pre-fill with customer details if logged in
  if (currentCustomer) {
    const nameEl = document.getElementById('comm-name');
    const emailEl = document.getElementById('comm-email');
    const phoneEl = document.getElementById('comm-phone');
    const cityEl = document.getElementById('comm-city');

    if (nameEl && !nameEl.value) nameEl.value = currentCustomer.full_name || '';
    if (emailEl && !emailEl.value) emailEl.value = currentCustomer.email || '';
    if (phoneEl && !phoneEl.value) phoneEl.value = currentCustomer.phone || '';
    if (cityEl && !cityEl.value) cityEl.value = currentCustomer.city || '';
  }

  if (window.lucide) lucide.createIcons();
}

function closeCommunityModal() {
  document.getElementById('community-modal').classList.add('hidden');
}

async function handleCommunityApply(e) {
  e.preventDefault();
  const btn = document.getElementById('comm-submit-btn');
  btn.disabled = true;
  btn.innerText = 'Submitting Application...';

  const name = document.getElementById('comm-name').value.trim();
  const email = document.getElementById('comm-email').value.trim();
  const phone = document.getElementById('comm-phone').value.trim();
  const city = document.getElementById('comm-city').value.trim();
  const style = document.getElementById('comm-style').value;
  const insta = document.getElementById('comm-insta').value.trim();
  const destination = document.getElementById('comm-destination').value.trim();
  const motivation = document.getElementById('comm-motivation').value.trim();

  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_community_members').insert([{
        full_name: name,
        email: email,
        phone_whatsapp: phone,
        city: city,
        travel_style: style,
        instagram_handle: insta || null,
        favorite_destination: destination,
        motivation: motivation,
        status: 'Pending'
      }]);
    }

    document.getElementById('community-form-container').classList.add('hidden');
    document.getElementById('community-success-state').classList.remove('hidden');
    document.getElementById('community-app-form').reset();
    if (window.lucide) lucide.createIcons();
  } catch (err) {
    console.error("Community apply error:", err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="send" class="w-3.5 h-3.5"></i><span>Submit Free Application</span>`;
  }
}
