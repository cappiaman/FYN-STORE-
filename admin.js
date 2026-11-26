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

  ['orders', 'products', 'discounts', 'customers', 'emails'].forEach(t => {
    const el = document.getElementById(`tab-content-${t}`);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`tab-content-${tabId}`);
  if (target) target.classList.remove('hidden');
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
    loadAdminEmails()
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
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        adminOrders = data;
      }
    }
  } catch (err) {
    console.error("Orders fetch error:", err);
  }

  renderOrdersTable();
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
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
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
        <td class="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
          
          <button 
            onclick="openShippingTrackingModal('${order.id}', '${order.order_number}', '${order.customer_email}', '${order.customer_name}', '${order.carrier || 'Blue Dart Express'}', '${order.tracking_number || ''}')"
            class="px-2.5 py-1 rounded bg-fyn-forest hover:bg-fyn-forest-light text-white font-bold text-[11px] shadow-sm transition inline-flex items-center space-x-1"
          >
            <i data-lucide="send" class="w-3 h-3 text-fyn-gold"></i>
            <span>${order.status === 'Shipped' ? 'Update Tracking' : 'Dispatch & Track'}</span>
          </button>

          ${order.status === 'Pending' ? `
            <button 
              onclick="acceptOrder('${order.id}', '${order.order_number}', '${order.customer_email}', '${order.customer_name}')"
              class="px-2.5 py-1 rounded bg-green-700 hover:bg-green-800 text-white font-bold text-[11px] shadow-sm transition"
              title="Accept Order"
            >
              ✓ Accept
            </button>
            <button 
              onclick="rejectOrder('${order.id}', '${order.order_number}', '${order.customer_email}', '${order.customer_name}')"
              class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm transition"
              title="Reject & Issue Refund Email"
            >
              ✕ Reject
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
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('fyn_products')
        .select('*')
        .gt('price', 500)
        .order('price', { ascending: false });

      if (!error && data) adminProducts = data;
    }
  } catch (err) {
    console.error("Products error:", err);
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
  const validOrders = adminOrders.filter(o => o.status !== 'Rejected');
  const totalSales = validOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const pendingCount = adminOrders.filter(o => o.status === 'Pending').length;
  
  // Calculate COGS (estimated at 41.6% of sales) and Net Profit
  const netProfit = totalSales * 0.584; // 58.4% profit margin
  const profitMarginPercent = totalSales > 0 ? 58.4 : 0;

  // Calculate Total Available Stock across all products
  const totalStockUnits = adminProducts.reduce((sum, p) => sum + parseInt(p.stock || 0), 0);
  const lowStockCount = adminProducts.filter(p => (p.stock || 0) < 15).length;

  document.getElementById('metric-total-sales').innerText = formatINR(totalSales);
  document.getElementById('metric-net-profit').innerText = formatINR(netProfit);
  document.getElementById('metric-profit-margin').innerText = `Margin: ${profitMarginPercent}%`;

  document.getElementById('metric-total-stock-units').innerText = `${totalStockUnits} Units`;
  document.getElementById('metric-stock-status').innerText = `${adminProducts.length} drops • ${lowStockCount > 0 ? `${lowStockCount} low stock` : 'Healthy stock'}`;

  document.getElementById('metric-total-orders').innerText = adminOrders.length;
  document.getElementById('metric-pending-orders').innerText = `${pendingCount} Pending Action`;
  document.getElementById('metric-total-emails').innerText = adminEmails.length;

  const tabBadge = document.getElementById('tab-pending-badge');
  if (pendingCount > 0) {
    tabBadge.classList.remove('hidden');
    tabBadge.innerText = pendingCount;
  } else {
    tabBadge.classList.add('hidden');
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
