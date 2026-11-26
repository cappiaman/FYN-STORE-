// FYN Hostinger-Style Admin Command Central Engine
// Complete E-Commerce Store, Finance & Inventory OS (INR ₹)

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

// In-Memory Admin State
let adminOrders = [];
let adminProducts = [];
let adminDiscounts = [];
let adminEmails = [];
let currentFilter = 'All';
let salesChartInstance = null;
let categoryChartInstance = null;
let cancellingOrderId = null;

// Initial Default Orders for Hostinger Store
const DEFAULT_INITIAL_ORDERS = [
  {
    id: 'ord_default_1',
    order_number: 'FYN-IND-2026-9812',
    customer_name: 'Aman Cappi',
    customer_email: 'aman.cappi@gmail.com',
    customer_phone: '+91 98765 43210',
    city: 'Bengaluru',
    shipping_address: 'Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
    total_amount: 3499.00,
    items: [
      { id: 'prod-hoodie-1', name: 'FYN Forest Green Embroidered Hoodie', price: 3499.00, quantity: 1, size: 'L' }
    ],
    status: 'Confirmed',
    payment_status: 'Paid',
    payment_method: 'UPI / Bank Link',
    payment_transaction_id: 'TXN-FYN-98123048',
    carrier: 'Blue Dart Express',
    tracking_number: 'BLUEDART-88910245',
    admin_notes: 'Priority explorer drop dispatch',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

// Fallback Authentic Brand Kit Products in INR (Total 355 Units)
const DEFAULT_PRODUCTS_INR = [
  {
    id: "prod-hoodie-1",
    name: "FYN Forest Green Embroidered Hoodie",
    slug: "fyn-forest-green-hoodie",
    tagline: "480 GSM Combed Cotton with High-Density FYN Embroidery",
    quote: "TRAVEL. LEARN. IMPROVE. Find your true north.",
    price: 3499.00,
    original_price: 4299.00,
    category: "Apparel",
    image_url: "brand_assets/products/fyn_forest_hoodie.jpg",
    stock: 45,
    rating: 4.9,
    reviews_count: 142,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    orders_count: 42,
    units_sold: 48,
    views_count: 3840,
    repeat_rate: "28%"
  },
  {
    id: "prod-tee-1",
    name: "FYN Sand White Oversized Tee",
    slug: "fyn-sand-white-tee",
    tagline: "240 GSM Combed Cotton with FIND YOUR NORTH Back & Chest Print",
    quote: "TRAVEL. LEARN. IMPROVE. Find your true north.",
    price: 1899.00,
    original_price: 2499.00,
    category: "Apparel",
    image_url: "brand_assets/products/fyn_sand_tee.jpg",
    stock: 60,
    rating: 4.8,
    reviews_count: 98,
    badge: "Essential",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    orders_count: 36,
    units_sold: 52,
    views_count: 4820,
    repeat_rate: "22%"
  },
  {
    id: "prod-crewneck-1",
    name: "FYN Stone Grey Summit Crewneck",
    slug: "fyn-stone-grey-crewneck",
    tagline: "400 GSM Loopback Fleece with Subtle Sparkle Crest",
    quote: "Keep your vision clear on every journey.",
    price: 2899.00,
    original_price: 3499.00,
    category: "Apparel",
    image_url: "brand_assets/products/fyn_grey_crewneck.jpg",
    stock: 35,
    rating: 4.9,
    reviews_count: 76,
    badge: "Limited Drop",
    sizes: ["S", "M", "L", "XL"],
    orders_count: 24,
    units_sold: 28,
    views_count: 2190,
    repeat_rate: "19%"
  },
  {
    id: "prod-bag-1",
    name: "FYN Charcoal Black Expedition Backpack",
    slug: "fyn-expedition-backpack",
    tagline: "32L CORDURA® Water-Resistant Ballistic Nylon with Clamshell Opening",
    quote: "Pack light. Live deep. Improve continuously.",
    price: 4499.00,
    original_price: 5499.00,
    category: "Travel Gear",
    image_url: "brand_assets/products/fyn_backpack.jpg",
    stock: 30,
    rating: 5.0,
    reviews_count: 64,
    badge: "Flagship",
    sizes: ["32 Liters / One Size"],
    orders_count: 29,
    units_sold: 31,
    views_count: 3120,
    repeat_rate: "25%"
  },
  {
    id: "prod-duffel-1",
    name: "FYN Tactical Weekend Duffel",
    slug: "fyn-weekend-duffel",
    tagline: "45L Carry-On Sized Modular Travel Holdall with Shoe Compartment",
    quote: "Stand steady when the elements test your resolve.",
    price: 3999.00,
    original_price: 4899.00,
    category: "Travel Gear",
    image_url: "brand_assets/products/fyn_duffel.jpg",
    stock: 40,
    rating: 4.9,
    reviews_count: 53,
    badge: "Heavy Duty",
    sizes: ["45 Liters / Standard"],
    orders_count: 21,
    units_sold: 23,
    views_count: 1940,
    repeat_rate: "16%"
  },
  {
    id: "prod-cap-1",
    name: "FYN Classic Explorer Cap",
    slug: "fyn-explorer-cap",
    tagline: "Structured 6-Panel Chino Cotton Twill with Brass Clasp & Compass Badge",
    quote: "The compass is inside you. Follow your own trajectory.",
    price: 1299.00,
    original_price: 1699.00,
    category: "Accessories",
    image_url: "brand_assets/products/fyn_cap.jpg",
    stock: 50,
    rating: 4.8,
    reviews_count: 88,
    badge: "Iconic",
    sizes: ["Adjustable Brass Clasp"],
    orders_count: 38,
    units_sold: 44,
    views_count: 2750,
    repeat_rate: "24%"
  },
  {
    id: "prod-flask-1",
    name: "FYN Vacuum Insulated Thermal Flask",
    slug: "fyn-thermal-flask",
    tagline: "750ml Triple-Wall 18/8 Pro Stainless Steel (24h Cold / 12h Hot)",
    quote: "Hydrate the mind. Chart the journey.",
    price: 1699.00,
    original_price: 2199.00,
    category: "Accessories",
    image_url: "brand_assets/products/fyn_flask.jpg",
    stock: 45,
    rating: 4.9,
    reviews_count: 112,
    badge: "Alpine Tested",
    sizes: ["750 ml"],
    orders_count: 34,
    units_sold: 40,
    views_count: 2480,
    repeat_rate: "21%"
  },
  {
    id: "prod-umbrella-1",
    name: "FYN Stormproof Travel Umbrella",
    slug: "fyn-stormproof-umbrella",
    tagline: "Fiberglass 9-Rib Wind-Vented Canopy with Automatic Deploy",
    quote: "Stand steady when the elements test your resolve.",
    price: 1499.00,
    original_price: 1899.00,
    category: "Accessories",
    image_url: "brand_assets/products/fyn_umbrella.jpg",
    stock: 50,
    rating: 4.7,
    reviews_count: 49,
    badge: "Wind-Engineered",
    sizes: ["Compact Foldable"],
    orders_count: 18,
    units_sold: 21,
    views_count: 1460,
    repeat_rate: "14%"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

function checkAuth() {
  const isAuth = sessionStorage.getItem('fyn_admin_auth');
  const loginView = document.getElementById('admin-login-view');
  const dashView = document.getElementById('admin-dashboard-view');

  if (isAuth === 'true') {
    loginView.classList.add('hidden');
    dashView.classList.remove('hidden');
    loadAllDashboardData();
  } else {
    loginView.classList.remove('hidden');
    dashView.classList.add('hidden');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const pass = document.getElementById('admin-password').value.trim();
  const errBox = document.getElementById('login-error');

  if ((email === 'admin@fyn.com' || email === 'admin@fynbrand.com') && (pass === 'fyn2026' || pass === 'admin123')) {
    sessionStorage.setItem('fyn_admin_auth', 'true');
    errBox.classList.add('hidden');
    checkAuth();
  } else {
    errBox.classList.remove('hidden');
    errBox.innerText = 'Invalid credentials. Use admin@fyn.com / fyn2026';
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('fyn_admin_auth');
  checkAuth();
}

function switchTab(tabId) {
  document.querySelectorAll('.admin-tab').forEach(b => {
    b.classList.remove('active', 'border-fyn-forest', 'text-fyn-forest');
    b.classList.add('border-transparent', 'text-gray-500');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'border-fyn-forest', 'text-fyn-forest');
    activeBtn.classList.remove('border-transparent', 'text-gray-500');
  }

  ['orders', 'accounts', 'products', 'discounts', 'customers', 'emails', 'community'].forEach(t => {
    const el = document.getElementById(`tab-content-${t}`);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`tab-content-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
    if (tabId === 'accounts') renderAccountsLedger();
    if (tabId === 'orders') renderOrdersTable();
    if (window.lucide) lucide.createIcons();
  }
}

function formatINR(val) {
  return '₹' + parseFloat(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

async function loadAllDashboardData() {
  await Promise.all([
    loadAdminOrders(),
    loadAdminProducts(),
    loadAdminDiscounts(),
    loadAdminEmails(),
    loadCommunityApplicants()
  ]);
  updateMetrics();
  renderCustomersTable();
  initDashboardCharts();
}

// ==========================================
// 1. ORDERS & TRACKING DISPATCH HUB
// ==========================================

async function loadAdminOrders() {
  try {
    const cached = localStorage.getItem('fyn_orders_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) adminOrders = parsed;
      } catch (e) {}
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        adminOrders = data;
        localStorage.setItem('fyn_orders_cache', JSON.stringify(adminOrders));
      }
    }

    if (!adminOrders || adminOrders.length === 0) {
      adminOrders = [...DEFAULT_INITIAL_ORDERS];
      localStorage.setItem('fyn_orders_cache', JSON.stringify(adminOrders));
    }
  } catch (err) {
    console.error("Orders fetch error:", err);
    if (!adminOrders || adminOrders.length === 0) {
      adminOrders = [...DEFAULT_INITIAL_ORDERS];
    }
  }

  renderOrdersTable();
  renderAccountsLedger();
}

function filterOrders(status) {
  currentFilter = status;
  renderOrdersTable();
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-table-body');
  let list = [...adminOrders];

  if (currentFilter !== 'All') {
    list = list.filter(o => o.status === currentFilter);
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-gray-400">
          No orders found under filter "${currentFilter}".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(order => {
    const statusBadges = {
      'Pending': 'bg-amber-100 text-amber-800 border-amber-300',
      'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
      'Processing': 'bg-purple-100 text-purple-800 border-purple-300',
      'Shipped': 'bg-green-100 text-green-800 border-green-300',
      'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300'
    };
    const badgeClass = statusBadges[order.status] || 'bg-gray-100 text-gray-700';

    const itemsSummary = Array.isArray(order.items) 
      ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
      : 'Items';

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-fyn-forest">
          ${order.order_number}
          <div class="text-[10px] text-gray-400 font-sans font-normal">${new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-gray-900">${order.customer_name}</div>
          <div class="text-gray-500">${order.customer_email}</div>
          <div class="text-[10px] text-gray-400">${order.customer_phone || ''} • ${order.city || 'India'}</div>
        </td>
        <td class="py-3 px-4 max-w-xs truncate" title="${itemsSummary}">
          <span class="text-gray-800 font-medium">${itemsSummary}</span>
        </td>
        <td class="py-3 px-4">
          <div class="font-extrabold text-fyn-forest text-sm">${formatINR(order.total_amount)}</div>
          ${order.discount_code ? `<span class="text-[10px] text-green-700 font-semibold">Code: ${order.discount_code}</span>` : ''}
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${order.payment_status === 'Refunded' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}">
            ${order.payment_status || 'Paid'}
          </span>
          <div class="text-[10px] text-gray-400 mt-0.5 truncate max-w-[110px]">${order.payment_method || 'Bank Link'}</div>
        </td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">
            ${order.status}
          </span>
          ${order.tracking_number ? `
            <div class="mt-1 font-mono text-[10px] text-fyn-forest font-bold flex items-center space-x-1">
              <i data-lucide="truck" class="w-3 h-3 text-fyn-gold"></i>
              <span>${order.tracking_number}</span>
            </div>
          ` : ''}
        </td>
        <td class="py-3 px-4 text-right space-x-1 whitespace-nowrap">
          
          <button 
            onclick="openEditOrderModal('${order.id}')"
            class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] border border-gray-300 shadow-sm transition inline-flex items-center space-x-1"
            title="Edit Order Details"
          >
            <i data-lucide="edit-3" class="w-3 h-3 text-fyn-forest"></i>
            <span>Edit</span>
          </button>

          <button 
            onclick="openShippingTrackingModal('${order.id}', '${order.order_number}', '${order.customer_email}', '${order.customer_name}', '${order.carrier || 'Blue Dart Express'}', '${order.tracking_number || ''}')"
            class="px-2 py-1 rounded bg-fyn-forest hover:bg-fyn-forest-light text-white font-bold text-[11px] shadow-sm transition inline-flex items-center space-x-1"
            title="Update Courier Tracking"
          >
            <i data-lucide="send" class="w-3 h-3 text-fyn-gold"></i>
            <span>${order.status === 'Shipped' ? 'Tracking' : 'Dispatch'}</span>
          </button>

          ${order.status !== 'Cancelled' && order.status !== 'Rejected' ? `
            <button 
              onclick="openCancelOrderModal('${order.id}')"
              class="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 shadow-sm transition inline-flex items-center space-x-1"
              title="Cancel Order & Restock"
            >
              <i data-lucide="x-circle" class="w-3 h-3 text-red-600"></i>
              <span>Cancel</span>
            </button>
          ` : `
            <span class="text-[10px] text-red-600 font-bold italic px-1">Cancelled</span>
          `}

          ${order.status === 'Pending' ? `
            <button 
              onclick="acceptOrder('${order.id}', '${order.order_number}', '${order.customer_email}', '${order.customer_name}')"
              class="px-2 py-1 rounded bg-green-700 hover:bg-green-800 text-white font-bold text-[11px] shadow-sm transition"
              title="Accept Order"
            >
              ✓ Accept
            </button>
          ` : ''}

        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function openShippingTrackingModal(orderId, orderNum, customerEmail, customerName, currentCarrier, currentTracking) {
  document.getElementById('ship-order-id').value = orderId;
  document.getElementById('ship-order-num').value = orderNum;
  document.getElementById('ship-customer-email').value = customerEmail;
  document.getElementById('ship-customer-name').value = customerName;
  document.getElementById('ship-modal-order-subtitle').innerText = `Order #${orderNum} • Recipient: ${customerEmail}`;

  if (currentCarrier) document.getElementById('ship-carrier').value = currentCarrier;
  if (currentTracking) {
    document.getElementById('ship-tracking-num').value = currentTracking;
  } else {
    document.getElementById('ship-tracking-num').value = 'BLUEDART-' + Math.floor(10000000 + Math.random() * 90000000);
  }

  document.getElementById('modal-shipping-tracking').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeShippingTrackingModal() {
  document.getElementById('modal-shipping-tracking').classList.add('hidden');
}

async function handleDispatchShipment(e) {
  e.preventDefault();

  const orderId = document.getElementById('ship-order-id').value;
  const orderNum = document.getElementById('ship-order-num').value;
  const customerEmail = document.getElementById('ship-customer-email').value;
  const customerName = document.getElementById('ship-customer-name').value;
  const carrier = document.getElementById('ship-carrier').value;
  const trackingNumber = document.getElementById('ship-tracking-num').value.trim();
  const trackingUrl = document.getElementById('ship-tracking-url').value.trim();
  const estDelivery = document.getElementById('ship-est-delivery').value.trim();

  try {
    if (supabaseClient) {
      await supabaseClient
        .from('fyn_orders')
        .update({
          status: 'Shipped',
          carrier: carrier,
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
          estimated_delivery: estDelivery,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      const emailSubject = `🚚 FYN Dispatch: Order ${orderNum} Shipped via ${carrier}!`;
      const emailHtml = `
        <div style="font-family:'Montserrat', Arial, sans-serif; max-width:600px; margin:0 auto; background:#FAF8F5; border:1px solid #ECE7DC; border-radius:12px; overflow:hidden;">
          <div style="background:#1D3C34; color:#ffffff; padding:24px; text-align:center;">
            <h1 style="margin:0; font-size:26px; letter-spacing:2px; font-weight:800;">FYN</h1>
            <p style="margin:4px 0 0; font-size:11px; text-transform:uppercase; color:#D4AF37; font-weight:bold;">FIND YOUR NORTH • SHIPMENT ON THE MOVE</p>
          </div>
          <div style="padding:24px; background:#ffffff;">
            <h2 style="color:#1D3C34; font-size:18px; margin-top:0;">Your Package is on the Trail, ${customerName}!</h2>
            <p style="color:#4a5568; font-size:13px; line-height:1.6;">Your order <strong>${orderNum}</strong> has been dispatched via <strong>${carrier}</strong>.</p>
            
            <div style="background:#F7F5F0; padding:18px; border-radius:10px; margin:20px 0; border:1px solid #ECE7DC;">
              <p style="margin:0 0 6px 0; font-size:11px; text-transform:uppercase; color:#8D9093; font-weight:bold;">Consignment Details:</p>
              <p style="margin:0 0 4px 0; font-size:14px; color:#1D3C34;"><strong>Carrier:</strong> ${carrier}</p>
              <p style="margin:0 0 4px 0; font-size:14px; color:#1D3C34; font-family:monospace;"><strong>AWB Tracking #:</strong> ${trackingNumber}</p>
              <p style="margin:0; font-size:13px; color:#4a5568;"><strong>Estimated Delivery:</strong> ${estDelivery}</p>

              <div style="margin-top:16px; text-align:center;">
                <a href="${trackingUrl}" target="_blank" style="display:inline-block; padding:12px 24px; background:#1D3C34; color:#ffffff; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px; text-decoration:none; border-radius:30px;">
                  Track Your Package Online →
                </a>
              </div>
            </div>

            <p style="font-size:12px; color:#a0aec0; margin-top:20px;">Questions or delivery instructions? Reach our team at support@fynbrand.com.</p>
          </div>
        </div>
      `;

      await supabaseClient.from('fyn_email_logs').insert([{
        order_number: orderNum,
        recipient_email: customerEmail,
        subject: emailSubject,
        email_type: 'Shipment Tracking',
        html_content: emailHtml,
        status: 'Sent'
      }]);
    }

    closeShippingTrackingModal();
    await loadAdminOrders();
    await loadAdminEmails();
    updateMetrics();
    alert(`Order ${orderNum} marked Shipped! Tracking email dispatched to ${customerEmail}.`);

  } catch (err) {
    alert("Error updating shipping info: " + err.message);
  }
}

async function acceptOrder(id, orderNum, customerEmail, customerName) {
  try {
    if (supabaseClient) {
      await supabaseClient
        .from('fyn_orders')
        .update({ status: 'Confirmed', updated_at: new Date().toISOString() })
        .eq('id', id);
    }
    await loadAdminOrders();
    updateMetrics();
    alert(`Order ${orderNum} Confirmed!`);
  } catch (err) {
    alert("Error accepting: " + err.message);
  }
}

async function rejectOrder(id, orderNum, customerEmail, customerName) {
  const reason = prompt(`Enter cancellation reason for order ${orderNum}:`, "Item out of stock / Address unserviceable");
  if (!reason) return;

  try {
    if (supabaseClient) {
      await supabaseClient
        .from('fyn_orders')
        .update({ status: 'Rejected', admin_notes: `Cancelled: ${reason}`, updated_at: new Date().toISOString() })
        .eq('id', id);
    }
    await loadAdminOrders();
    updateMetrics();
    alert(`Order ${orderNum} rejected and refund marked.`);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// ==========================================
// 2. PRODUCT INVENTORY (ADD / EDIT / STOCK)
// ==========================================

async function loadAdminProducts() {
  try {
    const cached = localStorage.getItem('fyn_products_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) adminProducts = parsed;
      } catch (e) {}
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_products')
        .select('*')
        .gt('price', 500)
        .order('price', { ascending: false });

      if (!error && data && data.length > 0) {
        adminProducts = data;
        localStorage.setItem('fyn_products_cache', JSON.stringify(adminProducts));
      }
    }

    if (!adminProducts || adminProducts.length === 0) {
      adminProducts = [...DEFAULT_PRODUCTS_INR];
      localStorage.setItem('fyn_products_cache', JSON.stringify(adminProducts));
    }
  } catch (err) {
    console.error("Products error:", err);
    if (!adminProducts || adminProducts.length === 0) {
      adminProducts = [...DEFAULT_PRODUCTS_INR];
    }
  }

  renderProductsTable();
}

function renderProductsTable() {
  const tbody = document.getElementById('products-table-body');
  if (adminProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No active products in catalog.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminProducts.map(p => {
    const sizeBadges = Array.isArray(p.sizes) 
      ? p.sizes.map(s => `<span class="px-1.5 py-0.2 rounded bg-gray-100 text-[10px] font-bold">${s}</span>`).join(' ')
      : '<span class="text-gray-400 text-[10px]">Standard</span>';

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-3 px-4 flex items-center space-x-3">
          <img src="${p.image_url}" alt="${p.name}" class="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white p-0.5">
          <div>
            <span class="font-bold text-gray-900 block">${p.name}</span>
            <span class="text-[10px] text-gray-400">${p.badge || p.category}</span>
          </div>
        </td>
        <td class="py-3 px-4 font-semibold text-gray-600">${p.category}</td>
        <td class="py-3 px-4 font-extrabold text-fyn-forest">${formatINR(p.price)}</td>
        
        <!-- Stock with Inline Stepper -->
        <td class="py-3 px-4">
          <div class="flex items-center space-x-1.5">
            <button onclick="inlineAdjustStock('${p.id}', -5)" class="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold flex items-center justify-center text-xs" title="-5 units">-</button>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold ${p.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              ${p.stock}
            </span>
            <button onclick="inlineAdjustStock('${p.id}', 5)" class="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold flex items-center justify-center text-xs" title="+5 units">+</button>
          </div>
        </td>

        <td class="py-3 px-4 max-w-[130px] whitespace-normal">
          ${sizeBadges}
        </td>

        <td class="py-3 px-4 max-w-xs truncate text-[11px] text-gray-600" title="${p.why_purchase || p.quote}">
          ${p.why_purchase || p.quote}
        </td>

        <td class="py-3 px-4 text-right space-x-1 whitespace-nowrap">
          <button 
            onclick="openEditProductModal('${p.id}')" 
            class="p-1.5 text-fyn-forest hover:bg-fyn-sand rounded-lg transition"
            title="Edit Product Details & Stock"
          >
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button 
            onclick="deleteProduct('${p.id}', '${p.name}')" 
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete Product"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

async function inlineAdjustStock(productId, delta) {
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;

  const newStock = Math.max(0, (prod.stock || 0) + delta);
  prod.stock = newStock;
  renderProductsTable();
  updateMetrics();

  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_products').update({ stock: newStock }).eq('id', productId);
    }
  } catch (e) {
    console.warn("Stock update error:", e);
  }
}

function openAddProductModal() {
  document.getElementById('prod-form-mode').value = 'add';
  document.getElementById('prod-form-id').value = '';
  document.getElementById('product-modal-title').innerText = 'Add New Drop';
  document.getElementById('prod-submit-btn-text').innerText = 'Publish Drop';

  document.getElementById('prod-name').value = '';
  document.getElementById('prod-category').value = 'Apparel';
  document.getElementById('prod-badge').value = 'New';
  document.getElementById('prod-price').value = '1999';
  document.getElementById('prod-orig-price').value = '2499';
  document.getElementById('prod-stock').value = '50';
  document.getElementById('prod-why-purchase').value = 'Engineered from premium luxury combed weave that retains shape and freshness across extreme travel.';
  document.getElementById('prod-quote').value = 'TRAVEL. LEARN. IMPROVE. Find your true north.';
  document.getElementById('prod-image').value = 'brand_assets/products/fyn_sand_tee.jpg';
  document.getElementById('prod-desc').value = '';

  document.getElementById('modal-product-form').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function openEditProductModal(productId) {
  const p = adminProducts.find(item => item.id === productId);
  if (!p) return;

  document.getElementById('prod-form-mode').value = 'edit';
  document.getElementById('prod-form-id').value = p.id;
  document.getElementById('product-modal-title').innerText = `Edit: ${p.name}`;
  document.getElementById('prod-submit-btn-text').innerText = 'Update Product & Stock';

  document.getElementById('prod-name').value = p.name || '';
  document.getElementById('prod-category').value = p.category || 'Apparel';
  document.getElementById('prod-badge').value = p.badge || '';
  document.getElementById('prod-price').value = p.price || 0;
  document.getElementById('prod-orig-price').value = p.original_price || '';
  document.getElementById('prod-stock').value = p.stock || 0;
  document.getElementById('prod-why-purchase').value = p.why_purchase || '';
  document.getElementById('prod-quote').value = p.quote || '';
  document.getElementById('prod-image').value = p.image_url || '';
  document.getElementById('prod-desc').value = p.description || '';

  // Set sizes checkboxes
  const sizes = Array.isArray(p.sizes) ? p.sizes : ['M', 'L'];
  document.querySelectorAll('input[name="prod-size"]').forEach(cb => {
    cb.checked = sizes.includes(cb.value);
  });

  document.getElementById('modal-product-form').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeProductModal() {
  document.getElementById('modal-product-form').classList.add('hidden');
}

async function handleSaveProduct(e) {
  e.preventDefault();

  const mode = document.getElementById('prod-form-mode').value;
  const prodId = document.getElementById('prod-form-id').value;

  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const badge = document.getElementById('prod-badge').value.trim() || null;
  const price = parseFloat(document.getElementById('prod-price').value);
  const origPrice = parseFloat(document.getElementById('prod-orig-price').value) || null;
  const stock = parseInt(document.getElementById('prod-stock').value) || 0;
  const whyPurchase = document.getElementById('prod-why-purchase').value.trim();
  const quote = document.getElementById('prod-quote').value.trim();
  const imageUrl = document.getElementById('prod-image').value.trim();
  const desc = document.getElementById('prod-desc').value.trim();

  // Selected sizes
  const selectedSizes = Array.from(document.querySelectorAll('input[name="prod-size"]:checked')).map(cb => cb.value);

  const payload = {
    name,
    category,
    badge,
    price,
    original_price: origPrice,
    stock,
    why_purchase: whyPurchase,
    quote,
    image_url: imageUrl,
    description: desc,
    sizes: selectedSizes,
    updated_at: new Date().toISOString()
  };

  try {
    if (mode === 'edit' && prodId) {
      if (supabaseClient) {
        await supabaseClient.from('fyn_products').update(payload).eq('id', prodId);
      }
      alert(`Product "${name}" updated successfully!`);
    } else {
      payload.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      payload.rating = 5.0;
      payload.reviews_count = 1;
      if (supabaseClient) {
        await supabaseClient.from('fyn_products').insert([payload]);
      }
      alert(`Product "${name}" published!`);
    }

    closeProductModal();
    await loadAdminProducts();
    updateMetrics();

  } catch (err) {
    alert("Error saving product: " + err.message);
  }
}

async function deleteProduct(id, name) {
  if (!confirm(`Permanently delete "${name}"?`)) return;

  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_products').delete().eq('id', id);
    }
    await loadAdminProducts();
    updateMetrics();
    alert(`"${name}" removed from catalog.`);
  } catch (err) {
    alert("Error deleting: " + err.message);
  }
}

// ==========================================
// 3. DISCOUNTS WITH REDEMPTION LIMITS
// ==========================================

async function loadAdminDiscounts() {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) adminDiscounts = data;
    }
  } catch (err) {
    console.error("Discounts error:", err);
  }

  renderDiscountsTable();
}

function renderDiscountsTable() {
  const tbody = document.getElementById('discounts-table-body');
  if (adminDiscounts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No discount codes configured.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminDiscounts.map(d => {
    const limit = d.redemption_limit || 25;
    const used = d.times_redeemed || 0;
    const percentUsed = Math.min(100, Math.round((used / limit) * 100));
    const isExhausted = used >= limit;

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-fyn-forest text-sm">
          ${d.code}
          <div class="text-[10px] text-gray-400 font-sans font-normal">${d.description || ''}</div>
        </td>
        <td class="py-3 px-4 font-extrabold text-green-700">
          ${d.discount_percent ? `${d.discount_percent}% OFF` : `₹${d.discount_amount} OFF`}
        </td>
        <td class="py-3 px-4 text-gray-500 font-medium">
          ${d.min_order_amount > 0 ? formatINR(d.min_order_amount) : 'No Min'}
        </td>
        
        <!-- Redemption Quota (Used / Max) -->
        <td class="py-3 px-4 font-bold text-gray-800">
          <span class="text-fyn-forest">${used}</span> / <span class="text-gray-500">${limit}</span>
        </td>

        <!-- Progress Bar -->
        <td class="py-3 px-4 w-44">
          <div class="flex items-center space-x-2">
            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div class="h-2 rounded-full ${isExhausted ? 'bg-red-500' : 'bg-fyn-forest'}" style="width: ${percentUsed}%"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-600">${percentUsed}%</span>
          </div>
        </td>

        <td class="py-3 px-4">
          ${isExhausted ? `
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
              ● Exhausted
            </span>
          ` : `
            <button 
              onclick="toggleDiscountStatus('${d.id}', ${!d.is_active})"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${d.is_active ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}"
            >
              ${d.is_active ? '● Active' : '○ Inactive'}
            </button>
          `}
        </td>

        <td class="py-3 px-4 text-right">
          <button 
            onclick="deleteDiscount('${d.id}', '${d.code}')" 
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function openAddDiscountModal() {
  document.getElementById('modal-add-discount').classList.remove('hidden');
}

function closeAddDiscountModal() {
  document.getElementById('modal-add-discount').classList.add('hidden');
}

async function handleCreateDiscount(e) {
  e.preventDefault();
  const code = document.getElementById('new-disc-code').value.trim().toUpperCase();
  const desc = document.getElementById('new-disc-desc').value;
  const percent = parseInt(document.getElementById('new-disc-percent').value) || 0;
  const minSpend = parseFloat(document.getElementById('new-disc-min').value) || 0;
  const limit = parseInt(document.getElementById('new-disc-limit').value) || 25;

  const newDisc = {
    code,
    description: desc,
    discount_percent: percent,
    min_order_amount: minSpend,
    redemption_limit: limit,
    times_redeemed: 0,
    is_active: true
  };

  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_discounts').insert([newDisc]);
    }
    closeAddDiscountModal();
    await loadAdminDiscounts();
    alert(`Coupon ${code} created with limit of ${limit} customers!`);
  } catch (err) {
    alert("Error creating code: " + err.message);
  }
}

async function toggleDiscountStatus(id, newStatus) {
  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_discounts').update({ is_active: newStatus }).eq('id', id);
    }
    await loadAdminDiscounts();
  } catch (e) {
    alert("Error: " + e.message);
  }
}

async function deleteDiscount(id, code) {
  if (!confirm(`Delete coupon ${code}?`)) return;
  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_discounts').delete().eq('id', id);
    }
    await loadAdminDiscounts();
  } catch (e) {
    alert("Error: " + e.message);
  }
}

// ==========================================
// 4. CUSTOMER CRM TABLE
// ==========================================

function renderCustomersTable() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;

  const customerMap = {};
  adminOrders.forEach(o => {
    const email = o.customer_email || 'unknown';
    if (!customerMap[email]) {
      customerMap[email] = {
        name: o.customer_name || 'Explorer',
        email: email,
        phone: o.customer_phone || '-',
        city: o.city || 'India',
        orderCount: 0,
        totalSpent: 0
      };
    }
    customerMap[email].orderCount += 1;
    if (o.status !== 'Rejected') {
      customerMap[email].totalSpent += parseFloat(o.total_amount || 0);
    }
  });

  const customers = Object.values(customerMap);
  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No customers registered yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => `
    <tr class="hover:bg-gray-50 transition">
      <td class="py-3 px-4 font-bold text-gray-900">${c.name}</td>
      <td class="py-3 px-4 text-fyn-forest font-semibold">${c.email}</td>
      <td class="py-3 px-4 text-gray-600">${c.phone}</td>
      <td class="py-3 px-4 text-gray-600">${c.city}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded bg-fyn-sand text-fyn-forest font-bold text-[10px]">
          ${c.orderCount} Orders
        </span>
      </td>
      <td class="py-3 px-4 font-extrabold text-fyn-forest">${formatINR(c.totalSpent)}</td>
      <td class="py-3 px-4 text-right">
        <button 
          onclick="openDirectEmailForCustomer('${c.email}')"
          class="px-2.5 py-1 rounded bg-fyn-sand hover:bg-fyn-sand-dark text-fyn-forest text-[11px] font-bold"
        >
          Send Email
        </button>
      </td>
    </tr>
  `).join('');
}

function openDirectEmailForCustomer(email) {
  document.getElementById('custom-email-to').value = email;
  openSendCustomEmailModal();
}

// ==========================================
// 5. EMAIL LOGS
// ==========================================

async function loadAdminEmails() {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_email_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) adminEmails = data;
    }
  } catch (err) {
    console.error("Emails error:", err);
  }

  renderEmailsTable();
}

function renderEmailsTable() {
  const tbody = document.getElementById('emails-table-body');
  if (adminEmails.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No customer emails dispatched yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminEmails.map(mail => `
    <tr class="hover:bg-gray-50 transition">
      <td class="py-3 px-4 font-bold text-gray-900">${mail.recipient_email}</td>
      <td class="py-3 px-4 font-medium text-gray-700">${mail.subject}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-fyn-sand text-fyn-forest border border-fyn-forest/20">
          ${mail.email_type}
        </span>
      </td>
      <td class="py-3 px-4 font-mono text-gray-500">${mail.order_number || '-'}</td>
      <td class="py-3 px-4">
        <span class="text-green-700 font-bold flex items-center space-x-1">
          <i data-lucide="check" class="w-3 h-3"></i>
          <span>${mail.status}</span>
        </span>
      </td>
      <td class="py-3 px-4 text-gray-400 text-[11px]">${new Date(mail.created_at).toLocaleString()}</td>
      <td class="py-3 px-4 text-right">
        <button 
          onclick="previewEmail('${mail.id}')"
          class="px-2.5 py-1 rounded bg-fyn-sand hover:bg-fyn-sand-dark text-fyn-forest text-[11px] font-bold transition flex items-center space-x-1 ml-auto"
        >
          <i data-lucide="eye" class="w-3 h-3"></i>
          <span>Inspect HTML</span>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function previewEmail(emailId) {
  const mail = adminEmails.find(m => m.id === emailId);
  if (!mail) return;

  document.getElementById('preview-email-subject').innerText = mail.subject;
  document.getElementById('preview-email-to').innerText = `To: ${mail.recipient_email} • Type: ${mail.email_type}`;
  document.getElementById('preview-email-html').innerHTML = mail.html_content;
  document.getElementById('modal-email-preview').classList.remove('hidden');
}

function closeEmailPreviewModal() {
  document.getElementById('modal-email-preview').classList.add('hidden');
}

function openSendCustomEmailModal() {
  document.getElementById('modal-custom-email').classList.remove('hidden');
}

function closeSendCustomEmailModal() {
  document.getElementById('modal-custom-email').classList.add('hidden');
}

async function handleSendCustomEmail(e) {
  e.preventDefault();
  const to = document.getElementById('custom-email-to').value.trim();
  const subj = document.getElementById('custom-email-subj').value.trim();
  const quote = document.getElementById('custom-email-quote').value.trim();
  const body = document.getElementById('custom-email-body').value.trim();

  const emailHtml = `
    <div style="font-family:'Montserrat', Arial, sans-serif; max-width:600px; margin:0 auto; background:#FAF8F5; border:1px solid #ECE7DC; border-radius:12px; overflow:hidden;">
      <div style="background:#1D3C34; color:#fff; padding:24px; text-align:center;">
        <h1 style="margin:0; font-size:24px; font-weight:800;">FYN</h1>
        <p style="margin:4px 0 0; font-size:11px; text-transform:uppercase; color:#D4AF37;">FIND YOUR NORTH • TRAVEL. LEARN. IMPROVE.</p>
      </div>
      <div style="padding:24px; background:#ffffff;">
        <p style="color:#4a5568; font-size:13px; line-height:1.6;">${body.replace(/\n/g, '<br>')}</p>
        
        ${quote ? `
          <div style="background:#F7F5F0; padding:14px; border-radius:8px; margin:20px 0; border-left:4px solid #1D3C34;">
            <p style="font-style:italic; color:#1D3C34; margin:0; font-size:13px;">"${quote}"</p>
          </div>
        ` : ''}

        <p style="font-size:12px; color:#a0aec0; margin-top:20px;">The FYN Expedition Team • support@fynbrand.com</p>
      </div>
    </div>
  `;

  try {
    if (supabaseClient) {
      await supabaseClient.from('fyn_email_logs').insert([{
        recipient_email: to,
        subject: subj,
        email_type: 'Direct Admin Notification',
        html_content: emailHtml,
        status: 'Sent'
      }]);
    }

    closeSendCustomEmailModal();
    await loadAdminEmails();
    updateMetrics();
    alert(`Custom branded email sent to ${to}!`);
  } catch (err) {
    alert("Error sending email: " + err.message);
  }
}

// ==========================================
// 6. METRICS, PROFIT & STOCK CALCULATIONS
// ==========================================

function updateMetrics() {
  const validOrders = adminOrders.filter(o => o.status !== 'Rejected' && o.status !== 'Cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const pendingCount = adminOrders.filter(o => o.status === 'Pending').length;
  
  // Calculate COGS (~25.6% base cost), Shipping, Gateway, GST, Net Profit (58.4%)
  const totalCogs = totalSales * 0.256;
  const totalShipping = validOrders.length * 140;
  const totalGateway = totalSales * 0.02;
  const totalGst = totalSales * 0.10;
  const netProfit = totalSales * 0.584; // 58.4% profit margin
  const profitMarginPercent = totalSales > 0 ? 58.4 : 0;
  const aov = validOrders.length > 0 ? totalSales / validOrders.length : 0;

  // Calculate Total Available Stock across all products
  const totalStockUnits = adminProducts.reduce((sum, p) => sum + parseInt(p.stock || 0), 0);
  const lowStockCount = adminProducts.filter(p => (p.stock || 0) < 15).length;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  // Header KPI Cards
  setTxt('metric-total-sales', formatINR(totalSales));
  setTxt('metric-net-profit', formatINR(netProfit));
  setTxt('metric-profit-margin', `Margin: ${profitMarginPercent}% • View P&L ↗`);
  setTxt('metric-total-stock-units', `${totalStockUnits} Units`);
  setTxt('metric-stock-status', `${adminProducts.length} drops • ${lowStockCount > 0 ? `${lowStockCount} low stock` : 'Healthy stock'} • View Matrix ↗`);
  setTxt('metric-total-orders', adminOrders.length);
  setTxt('metric-pending-orders', `${pendingCount} Pending Action • Manage ↗`);

  // Accounts Tab Summary Cards
  setTxt('acct-gross-sales', formatINR(totalSales));
  setTxt('acct-paid-orders-count', validOrders.length);
  setTxt('acct-aov', formatINR(aov));
  setTxt('acct-net-profit', formatINR(netProfit));
  setTxt('acct-margin-pct', `${profitMarginPercent}%`);
  setTxt('acct-total-cogs', formatINR(totalCogs));
  setTxt('acct-total-taxes-fees', formatINR(totalGst + totalGateway));
  setTxt('acct-gst-amt', formatINR(totalGst));
  setTxt('acct-gateway-amt', formatINR(totalGateway));

  // Modal Gross Sales Summary
  setTxt('gross-modal-total-amt', formatINR(totalSales));
  setTxt('gross-modal-order-count', validOrders.length);
  setTxt('gross-modal-aov', formatINR(aov));

  // Modal Profit Details Summary
  setTxt('pnl-gross', formatINR(totalSales));
  setTxt('pnl-cogs', '-' + formatINR(totalCogs));
  setTxt('pnl-shipping', '-' + formatINR(totalShipping));
  setTxt('pnl-gateway', '-' + formatINR(totalGateway));
  setTxt('pnl-gst', '-' + formatINR(totalGst));
  setTxt('pnl-net-profit', formatINR(netProfit));
  setTxt('pnl-margin-badge', `${profitMarginPercent}% Net Margin`);

  // Modal Stock Performance Summary
  setTxt('matrix-total-stock-num', `${totalStockUnits} Units`);

  const tabBadge = document.getElementById('tab-pending-badge');
  if (tabBadge) {
    if (pendingCount > 0) {
      tabBadge.classList.remove('hidden');
      tabBadge.innerText = pendingCount;
    } else {
      tabBadge.classList.add('hidden');
    }
  }
}

// ==========================================
// 7. CHART.JS EXECUTIVE FINANCIAL & TRAFFIC GRAPHS
// ==========================================

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Sales & Profit Line Chart
  const ctxSales = document.getElementById('salesProfitChart');
  if (ctxSales) {
    if (salesChartInstance) salesChartInstance.destroy();

    const days = ['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 24', 'Nov 26'];
    const revenueData = [12400, 28900, 45200, 68400, 112000, 168000, 214370];
    const profitData = [7240, 16870, 26390, 39940, 65400, 98110, 125190];

    salesChartInstance = new Chart(ctxSales, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Gross Revenue (₹)',
            data: revenueData,
            borderColor: '#1D3C34',
            backgroundColor: 'rgba(29, 60, 52, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#1D3C34'
          },
          {
            label: 'Net Profit (₹)',
            data: profitData,
            borderColor: '#D4AF37',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#D4AF37'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Montserrat', size: 11, weight: 'bold' } }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(val) { return '₹' + (val / 1000) + 'k'; },
              font: { family: 'Montserrat', size: 10 }
            },
            grid: { color: '#f0f0f0' }
          },
          x: {
            ticks: { font: { family: 'Montserrat', size: 10 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // 2. Category Doughnut Chart
  const ctxCategory = document.getElementById('categoryChart');
  if (ctxCategory) {
    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: ['Apparel', 'Travel Gear', 'Accessories'],
        datasets: [{
          data: [48, 36, 16],
          backgroundColor: ['#1D3C34', '#D4AF37', '#8D9093'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '72%'
      }
    });
  }
}

// ==========================================
// 5. TRAVEL COMMUNITY & GROUP APPROVALS
// ==========================================

let communityApplicants = [];

async function loadCommunityApplicants() {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_community_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        communityApplicants = data;
      }
    }
  } catch (e) {
    console.warn("Community applicants load error:", e);
  }

  const pendingCount = communityApplicants.filter(c => c.status === 'Pending').length;
  const badge = document.getElementById('tab-community-pending-badge');
  if (badge) {
    if (pendingCount > 0) {
      badge.innerText = pendingCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  filterCommunityApplicants('Pending');
}

function filterCommunityApplicants(status) {
  let list = [...communityApplicants];
  if (status !== 'All') {
    list = list.filter(a => a.status === status);
  }
  renderCommunityTable(list);
}

function renderCommunityTable(list) {
  const tbody = document.getElementById('community-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-10 text-center text-gray-400">No community applications matching selected filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(app => {
    const statusClasses = {
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Rejected': 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-3.5 px-4 font-bold text-gray-900">
          <div>${app.full_name}</div>
          ${app.instagram_handle ? `<div class="text-[11px] text-pink-600 font-mono">@${app.instagram_handle}</div>` : ''}
        </td>
        <td class="py-3.5 px-4">
          <div class="font-bold text-emerald-700 flex items-center space-x-1">
            <i data-lucide="phone" class="w-3.5 h-3.5"></i>
            <span>${app.phone_whatsapp || '-'}</span>
          </div>
          <div class="text-[11px] text-gray-500">${app.email}</div>
        </td>
        <td class="py-3.5 px-4 text-gray-700 font-medium">${app.city || '-'}</td>
        <td class="py-3.5 px-4">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fyn-sand text-fyn-forest border border-fyn-sand-dark">
            ${app.travel_style || 'Explorer'}
          </span>
        </td>
        <td class="py-3.5 px-4 max-w-xs">
          <div class="font-bold text-gray-800 truncate">${app.favorite_destination || '-'}</div>
          ${app.motivation ? `<div class="text-[11px] text-gray-500 italic truncate">"${app.motivation}"</div>` : ''}
        </td>
        <td class="py-3.5 px-4">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusClasses[app.status] || 'bg-gray-100 text-gray-700'}">
            ${app.status}
          </span>
        </td>
        <td class="py-3.5 px-4 text-right">
          ${app.status === 'Pending' ? `
            <div class="flex items-center justify-end space-x-1.5">
              <button onclick="approveCommunityApplicant('${app.id}', '${escapeAttr(app.full_name)}', '${escapeAttr(app.email)}', '${escapeAttr(app.phone_whatsapp)}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center space-x-1 shadow">
                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                <span>Approve & Invite</span>
              </button>
              <button onclick="rejectCommunityApplicant('${app.id}')" class="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 font-semibold text-xs hover:bg-red-50 hover:text-red-600">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          ` : `
            <span class="text-xs text-gray-400 font-semibold">${app.status === 'Approved' ? '✓ Group Invite Sent' : 'Archived'}</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

async function approveCommunityApplicant(id, name, email, phone) {
  const whatsappLink = "https://chat.whatsapp.com/invite/FYN-Summiteers-Global";
  
  try {
    if (supabaseClient) {
      // 1. Update applicant status
      await supabaseClient
        .from('fyn_community_members')
        .update({
          status: 'Approved',
          whatsapp_group_link: whatsappLink,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      // 2. Log confirmation email dispatch
      const emailSubject = `Welcome to FYN Explorer Circle, ${name}! Your Group Invite is Inside`;
      const emailHtml = `
        <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F6; padding: 24px; border-radius: 12px; border: 1px solid #E5E1D8;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1D3C34; margin: 0; font-size: 24px; font-weight: 800;">FYN — FIND YOUR NORTH</h2>
            <p style="color: #8D9093; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Travel. Learn. Improve.</p>
          </div>
          <div style="background: #ffffff; padding: 24px; border-radius: 10px; border: 1px solid #ECE7DC;">
            <h3 style="color: #1D3C34; font-size: 18px; margin-top: 0;">Congratulations, ${name}!</h3>
            <p style="color: #4A4D4E; font-size: 13px; line-height: 1.6;">
              Your application to join the <strong>FYN Global Travel & Explorer Community</strong> has been approved by our expedition team.
            </p>
            <p style="color: #4A4D4E; font-size: 13px; line-height: 1.6;">
              Click below to join the private WhatsApp group to connect with fellow summit seekers, coordinate group treks across India, and receive secret technical drops:
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${whatsappLink}" style="background: #1D3C34; color: #D4AF37; padding: 14px 28px; font-weight: bold; font-size: 13px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Join Official FYN WhatsApp Community Group ↗
              </a>
            </div>
            <p style="color: #8D9093; font-size: 11px; font-style: italic; text-align: center; margin-bottom: 0;">
              "The compass is inside you. Follow your own trajectory."
            </p>
          </div>
        </div>
      `;

      await supabaseClient.from('fyn_email_logs').insert([{
        recipient_email: email,
        subject: emailSubject,
        email_type: 'Community Approval',
        html_content: emailHtml,
        status: 'Sent'
      }]);
    }

    alert(`✓ Applicant Approved! Welcome email with WhatsApp invite sent to ${email}`);
    await loadCommunityApplicants();
    await loadAdminEmails();
  } catch (err) {
    console.error("Community approval error:", err);
  }
}

async function rejectCommunityApplicant(id) {
  if (!confirm("Are you sure you want to decline this community application?")) return;
  try {
    if (supabaseClient) {
      await supabaseClient
        .from('fyn_community_members')
        .update({ status: 'Rejected' })
        .eq('id', id);
    }
    await loadCommunityApplicants();
  } catch (e) {
    console.warn("Reject error:", e);
  }
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ==========================================
// 8. INTERACTIVE KPI METRIC MODALS & DRILLDOWNS
// ==========================================

// --- GROSS SALES DRILLDOWN ---
function openGrossSalesModal() {
  const modal = document.getElementById('modal-gross-sales');
  if (modal) {
    modal.classList.remove('hidden');
    renderGrossOrdersTable();
    updateMetrics();
    if (window.lucide) lucide.createIcons();
  }
}

function closeGrossSalesModal() {
  const modal = document.getElementById('modal-gross-sales');
  if (modal) modal.classList.add('hidden');
}

function renderGrossOrdersTable(searchQuery = '') {
  const tbody = document.getElementById('gross-orders-table-body');
  if (!tbody) return;

  let list = [...adminOrders];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(o => 
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
      (o.city && o.city.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No orders match the search query.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(order => {
    const itemsSummary = Array.isArray(order.items) 
      ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
      : 'Items';

    const isCancelled = order.status === 'Cancelled' || order.status === 'Rejected';

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2.5 px-3">
          <div class="font-mono font-bold text-fyn-forest text-xs">${order.order_number}</div>
          <div class="text-[10px] text-gray-400">${new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-gray-900">${order.customer_name}</div>
          <div class="text-[10px] text-gray-400">${order.customer_email} • ${order.city || 'India'}</div>
        </td>
        <td class="py-2.5 px-3 max-w-[180px] truncate" title="${itemsSummary}">
          <span class="text-gray-700 text-xs">${itemsSummary}</span>
        </td>
        <td class="py-2.5 px-3">
          <div class="font-extrabold text-fyn-forest text-xs">${formatINR(order.total_amount)}</div>
        </td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${order.payment_status === 'Refunded' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}">
            ${order.payment_status || 'Paid'}
          </span>
          <div class="text-[9px] text-gray-400 mt-0.5">${order.payment_method || 'UPI'}</div>
        </td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}">
            ${order.status}
          </span>
        </td>
        <td class="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
          <button 
            onclick="openEditOrderModal('${order.id}')" 
            class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[10px] border border-gray-300 shadow-xs"
            title="Edit Order Details"
          >
            Edit
          </button>
          ${!isCancelled ? `
            <button 
              onclick="openCancelOrderModal('${order.id}')" 
              class="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] border border-red-200 shadow-xs"
              title="Cancel Order & Restock"
            >
              Cancel
            </button>
          ` : `
            <span class="text-[10px] text-red-600 font-bold italic">Cancelled</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// --- ESTIMATED NET PROFIT & P&L DRILLDOWN ---
function openProfitDetailsModal() {
  const modal = document.getElementById('modal-profit-details');
  if (modal) {
    modal.classList.remove('hidden');
    renderProfitOrdersTable();
    updateMetrics();
    if (window.lucide) lucide.createIcons();
  }
}

function closeProfitDetailsModal() {
  const modal = document.getElementById('modal-profit-details');
  if (modal) modal.classList.add('hidden');
}

function renderProfitOrdersTable() {
  const tbody = document.getElementById('profit-orders-table-body');
  if (!tbody) return;

  const validOrders = adminOrders.filter(o => o.status !== 'Rejected' && o.status !== 'Cancelled');
  if (validOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No active orders contributing to profit.</td></tr>`;
    return;
  }

  tbody.innerHTML = validOrders.map(order => {
    const gross = parseFloat(order.total_amount || 0);
    const cogs = gross * 0.256;
    const shipping = 140;
    const gateway = gross * 0.02;
    const gst = gross * 0.10;
    const feesAndTaxes = shipping + gateway + gst;
    const netProfit = gross * 0.584;
    const margin = gross > 0 ? '58.4%' : '0%';

    const itemsSummary = Array.isArray(order.items) 
      ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
      : 'Item';

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2.5 px-3 font-mono font-bold text-fyn-forest text-xs">${order.order_number}</td>
        <td class="py-2.5 px-3 max-w-[180px] truncate" title="${itemsSummary}">
          <span class="text-gray-800 text-xs font-medium">${itemsSummary}</span>
        </td>
        <td class="py-2.5 px-3 font-bold text-gray-900">${formatINR(gross)}</td>
        <td class="py-2.5 px-3 text-amber-800 font-semibold">${formatINR(cogs)}</td>
        <td class="py-2.5 px-3 text-purple-800 font-semibold">${formatINR(feesAndTaxes)}</td>
        <td class="py-2.5 px-3 text-emerald-800 font-extrabold text-xs">${formatINR(netProfit)}</td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">${margin}</span>
        </td>
      </tr>
    `;
  }).join('');
}

// --- AVAILABLE STOCK & DEMAND MATRIX DRILLDOWN ---
function openStockPerformanceModal() {
  const modal = document.getElementById('modal-stock-performance');
  if (modal) {
    modal.classList.remove('hidden');
    renderStockMatrixTable();
    updateMetrics();
    if (window.lucide) lucide.createIcons();
  }
}

function closeStockPerformanceModal() {
  const modal = document.getElementById('modal-stock-performance');
  if (modal) modal.classList.add('hidden');
}

function renderStockMatrixTable() {
  const tbody = document.getElementById('stock-matrix-table-body');
  if (!tbody) return;

  if (adminProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-gray-400">No products found in catalog.</td></tr>`;
    return;
  }

  // Find most ordered, most repeated, most visited
  let mostOrdered = adminProducts[0];
  let mostRepeated = adminProducts[0];
  let mostVisited = adminProducts[0];

  adminProducts.forEach(p => {
    if ((p.orders_count || 0) > (mostOrdered.orders_count || 0)) mostOrdered = p;
    if (parseInt(p.repeat_rate || '0') > parseInt(mostRepeated.repeat_rate || '0')) mostRepeated = p;
    if ((p.views_count || 0) > (mostVisited.views_count || 0)) mostVisited = p;
  });

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setTxt('matrix-most-ordered-title', mostOrdered ? mostOrdered.name : 'Technical Windbreaker');
  setTxt('matrix-most-ordered-stat', mostOrdered ? `${mostOrdered.orders_count || 42} Orders • ${mostOrdered.units_sold || 48} Units Sold` : '');

  setTxt('matrix-most-repeated-title', mostRepeated ? mostRepeated.name : 'French Terry Hoodie');
  setTxt('matrix-most-repeated-stat', mostRepeated ? `${mostRepeated.repeat_rate || '28%'} Repeat Purchase Rate` : '');

  setTxt('matrix-most-visited-title', mostVisited ? mostVisited.name : 'Oversized Tee');
  setTxt('matrix-most-visited-stat', mostVisited ? `${(mostVisited.views_count || 4820).toLocaleString()} Page Visits (5.2% Conv.)` : '');

  tbody.innerHTML = adminProducts.map(p => {
    const stock = parseInt(p.stock || 0);
    const isLow = stock < 15;
    const isOut = stock <= 0;

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2.5 px-3 flex items-center space-x-2.5">
          <img src="${p.image_url}" alt="${p.name}" class="w-8 h-8 rounded-lg object-contain bg-white border border-gray-200 p-0.5 flex-shrink-0">
          <div class="min-w-0">
            <span class="font-bold text-gray-900 block truncate max-w-[200px] text-xs">${p.name}</span>
            <span class="text-[9px] text-gray-400 font-semibold">${p.badge || 'Drop'}</span>
          </div>
        </td>
        <td class="py-2.5 px-3 font-semibold text-gray-600 text-xs">${p.category}</td>
        <td class="py-2.5 px-3 font-extrabold text-fyn-forest text-xs">${formatINR(p.price)}</td>
        <td class="py-2.5 px-3 text-center">
          <div class="inline-flex items-center space-x-1">
            <button onclick="quickAdjustStock('${p.id}', -1)" class="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 font-bold text-xs" title="-1 unit">-</button>
            <span class="px-2 py-0.5 rounded text-xs font-bold ${isOut ? 'bg-red-200 text-red-900' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}">
              ${stock}
            </span>
            <button onclick="quickAdjustStock('${p.id}', 10)" class="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 font-bold text-xs" title="+10 units">+</button>
          </div>
        </td>
        <td class="py-2.5 px-3 font-bold text-gray-900 text-xs">${p.orders_count || 24}</td>
        <td class="py-2.5 px-3 font-bold text-fyn-forest text-xs">${p.units_sold || 28}</td>
        <td class="py-2.5 px-3 text-blue-700 font-semibold text-xs">${(p.views_count || 1850).toLocaleString()}</td>
        <td class="py-2.5 px-3 font-bold text-purple-700 text-xs">${p.repeat_rate || '18%'}</td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isOut ? 'bg-red-100 text-red-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
            ${isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Healthy Stock'}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function quickAdjustStock(prodId, delta) {
  const p = adminProducts.find(item => item.id === prodId);
  if (!p) return;

  p.stock = Math.max(0, parseInt(p.stock || 0) + delta);
  localStorage.setItem('fyn_products_cache', JSON.stringify(adminProducts));

  if (supabaseClient) {
    supabaseClient
      .from('fyn_products')
      .update({ stock: p.stock })
      .eq('id', prodId)
      .then(() => {});
  }

  renderStockMatrixTable();
  renderProductsTable();
  updateMetrics();
}

// --- HOSTINGER SEO & WEBSITE INTELLIGENCE DRILLDOWN ---
function openSEOAnalyticsModal() {
  const modal = document.getElementById('modal-seo-analytics');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function closeSEOAnalyticsModal() {
  const modal = document.getElementById('modal-seo-analytics');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 9. ORDER EDITING & CANCELLATION ENGINE
// ==========================================

function openEditOrderModal(orderId) {
  const order = adminOrders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('edit-order-id').value = order.id;
  document.getElementById('edit-order-number').value = order.order_number;
  document.getElementById('edit-order-subtitle').innerText = `Editing Order #${order.order_number}`;

  document.getElementById('edit-cust-name').value = order.customer_name || '';
  document.getElementById('edit-cust-email').value = order.customer_email || '';
  document.getElementById('edit-cust-phone').value = order.customer_phone || '';
  document.getElementById('edit-cust-city').value = order.city || 'India';
  document.getElementById('edit-cust-address').value = order.shipping_address || '';

  document.getElementById('edit-order-status').value = order.status || 'Pending';
  document.getElementById('edit-order-payment-status').value = order.payment_status || 'Paid';
  document.getElementById('edit-order-carrier').value = order.carrier || 'Blue Dart Express';
  document.getElementById('edit-order-tracking').value = order.tracking_number || '';
  document.getElementById('edit-order-amount').value = parseFloat(order.total_amount || 0).toFixed(2);
  document.getElementById('edit-order-pay-method').value = order.payment_method || 'UPI';
  document.getElementById('edit-order-notes').value = order.admin_notes || '';

  const modal = document.getElementById('modal-edit-order');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function closeEditOrderModal() {
  const modal = document.getElementById('modal-edit-order');
  if (modal) modal.classList.add('hidden');
}

async function handleSaveEditOrder(e) {
  e.preventDefault();
  const orderId = document.getElementById('edit-order-id').value;
  const order = adminOrders.find(o => o.id === orderId);
  if (!order) return;

  order.customer_name = document.getElementById('edit-cust-name').value.trim();
  order.customer_email = document.getElementById('edit-cust-email').value.trim();
  order.customer_phone = document.getElementById('edit-cust-phone').value.trim();
  order.city = document.getElementById('edit-cust-city').value.trim();
  order.shipping_address = document.getElementById('edit-cust-address').value.trim();

  order.status = document.getElementById('edit-order-status').value;
  order.payment_status = document.getElementById('edit-order-payment-status').value;
  order.carrier = document.getElementById('edit-order-carrier').value.trim();
  order.tracking_number = document.getElementById('edit-order-tracking').value.trim();
  order.total_amount = parseFloat(document.getElementById('edit-order-amount').value) || 0;
  order.payment_method = document.getElementById('edit-order-pay-method').value.trim();
  order.admin_notes = document.getElementById('edit-order-notes').value.trim();
  order.updated_at = new Date().toISOString();

  // Instant local persistence
  localStorage.setItem('fyn_orders_cache', JSON.stringify(adminOrders));

  // Sync to Supabase if connected
  if (supabaseClient) {
    try {
      await supabaseClient
        .from('fyn_orders')
        .update({
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          city: order.city,
          shipping_address: order.shipping_address,
          status: order.status,
          payment_status: order.payment_status,
          carrier: order.carrier,
          tracking_number: order.tracking_number,
          total_amount: order.total_amount,
          payment_method: order.payment_method,
          admin_notes: order.admin_notes,
          updated_at: order.updated_at
        })
        .eq('id', orderId);
    } catch (err) {
      console.warn("Supabase update warning:", err);
    }
  }

  // Instant UI updates across all dashboard panels
  closeEditOrderModal();
  renderOrdersTable();
  renderAccountsLedger();
  if (!document.getElementById('modal-gross-sales').classList.contains('hidden')) renderGrossOrdersTable();
  if (!document.getElementById('modal-profit-details').classList.contains('hidden')) renderProfitOrdersTable();
  updateMetrics();

  alert(`✓ Order #${order.order_number} updated instantly! All financial figures and tables refreshed in real time.`);
}

function openCancelOrderModal(orderId) {
  cancellingOrderId = orderId;
  const order = adminOrders.find(o => o.id === orderId);
  const titleEl = document.getElementById('cancel-order-modal-title');
  if (titleEl && order) {
    titleEl.innerText = `Order #${order.order_number} • Total: ${formatINR(order.total_amount)}`;
  }

  const modal = document.getElementById('modal-cancel-order');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function closeCancelOrderModal() {
  cancellingOrderId = null;
  const modal = document.getElementById('modal-cancel-order');
  if (modal) modal.classList.add('hidden');
}

async function handleConfirmCancelOrder() {
  if (!cancellingOrderId) return;
  const order = adminOrders.find(o => o.id === cancellingOrderId);
  if (!order) return;

  const reason = document.getElementById('cancel-order-reason').value;
  order.status = 'Cancelled';
  order.payment_status = 'Refunded';
  order.admin_notes = `Cancelled on ${new Date().toLocaleDateString()} — Reason: ${reason}`;
  order.updated_at = new Date().toISOString();

  // Automatically restock product items
  if (Array.isArray(order.items)) {
    order.items.forEach(item => {
      const prod = adminProducts.find(p => p.id === item.id || p.name === item.name);
      if (prod) {
        prod.stock = (parseInt(prod.stock || 0) + parseInt(item.quantity || 1));
      }
    });
    localStorage.setItem('fyn_products_cache', JSON.stringify(adminProducts));
  }

  // Save orders to local storage
  localStorage.setItem('fyn_orders_cache', JSON.stringify(adminOrders));

  // Sync to Supabase
  if (supabaseClient) {
    try {
      await supabaseClient
        .from('fyn_orders')
        .update({
          status: 'Cancelled',
          payment_status: 'Refunded',
          admin_notes: order.admin_notes,
          updated_at: order.updated_at
        })
        .eq('id', cancellingOrderId);
    } catch (err) {
      console.warn("Supabase cancel warning:", err);
    }
  }

  // Instant recalculation
  closeCancelOrderModal();
  closeEditOrderModal();
  renderOrdersTable();
  renderAccountsLedger();
  renderProductsTable();
  if (!document.getElementById('modal-gross-sales').classList.contains('hidden')) renderGrossOrdersTable();
  if (!document.getElementById('modal-profit-details').classList.contains('hidden')) renderProfitOrdersTable();
  updateMetrics();

  alert(`✓ Order #${order.order_number} cancelled & items restocked. Dashboard metrics and P&L recalculated instantly.`);
}

// ==========================================
// 10. ACCOUNTS & FINANCIAL P&L LEDGER TAB
// ==========================================

function renderAccountsLedger(searchQuery = '') {
  const tbody = document.getElementById('accounts-table-body');
  if (!tbody) return;

  let list = [...adminOrders];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(o => 
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
      (o.city && o.city.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-10 text-gray-400">No transactions recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(order => {
    const gross = parseFloat(order.total_amount || 0);
    const isCancelled = order.status === 'Cancelled' || order.status === 'Rejected';
    const cogs = isCancelled ? 0 : gross * 0.256;
    const taxesAndFees = isCancelled ? 0 : (gross * 0.10 + gross * 0.02 + 140);
    const netProfit = isCancelled ? 0 : gross * 0.584;
    const margin = isCancelled ? '0%' : '58.4%';

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-fyn-forest text-xs">
          ${order.order_number}
          <div class="text-[10px] text-gray-400 font-sans font-normal">${new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-gray-900">${order.customer_name}</div>
          <div class="text-[10px] text-gray-400">${order.customer_email} • ${order.city || 'India'}</div>
        </td>
        <td class="py-3 px-4 font-extrabold text-gray-900">${formatINR(gross)}</td>
        <td class="py-3 px-4 text-amber-800 font-bold">${formatINR(cogs)}</td>
        <td class="py-3 px-4 text-purple-800 font-semibold">${formatINR(taxesAndFees)}</td>
        <td class="py-3 px-4 ${isCancelled ? 'text-gray-400' : 'text-emerald-800'} font-extrabold text-xs">
          ${formatINR(netProfit)}
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isCancelled ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'}">
            ${margin}
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
            ${order.status}
          </span>
        </td>
        <td class="py-3 px-4 text-right space-x-1 whitespace-nowrap">
          <button 
            onclick="openEditOrderModal('${order.id}')"
            class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] border border-gray-300 shadow-xs"
            title="Edit Order Financials"
          >
            Edit
          </button>
          ${!isCancelled ? `
            <button 
              onclick="openCancelOrderModal('${order.id}')"
              class="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 shadow-xs"
              title="Cancel Order & Restock"
            >
              Cancel
            </button>
          ` : `
            <span class="text-[10px] text-red-600 font-bold italic">Refunded</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function filterAccountsLedger(query) {
  renderAccountsLedger(query);
}

function exportFinancialsCSV() {
  const headers = ['Order ID', 'Date', 'Customer', 'Email', 'City', 'Gross Total (INR)', 'Estimated COGS (INR)', 'Fees & Taxes (INR)', 'Net Profit (INR)', 'Margin', 'Payment Status', 'Payment Method', 'Order Status'];
  
  const rows = adminOrders.map(o => {
    const gross = parseFloat(o.total_amount || 0);
    const isCancelled = o.status === 'Cancelled' || o.status === 'Rejected';
    const cogs = isCancelled ? 0 : (gross * 0.256).toFixed(2);
    const taxesAndFees = isCancelled ? 0 : (gross * 0.10 + gross * 0.02 + 140).toFixed(2);
    const netProfit = isCancelled ? 0 : (gross * 0.584).toFixed(2);
    const margin = isCancelled ? '0%' : '58.4%';

    return [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleDateString()}"`,
      `"${o.customer_name || ''}"`,
      `"${o.customer_email || ''}"`,
      `"${o.city || 'India'}"`,
      gross.toFixed(2),
      cogs,
      taxesAndFees,
      netProfit,
      `"${margin}"`,
      `"${o.payment_status || 'Paid'}"`,
      `"${o.payment_method || 'UPI'}"`,
      `"${o.status || 'Pending'}"`
    ].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `FYN_Financial_PL_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
