# 🌲 FYN — "FIND YOUR NORTH"
### Travel. Learn. Improve. — Mountain Lifestyle E-Commerce Platform

A complete modern lifestyle e-commerce platform built for **FYN** with **Hostinger E-Commerce Command Central**, **Supabase Cloud Database**, **Direct Bank Link & UPI Payment Gateway in INR (₹)**, and **End-to-End Tracking & Email Dispatching**.

---

## 🎨 Visual Identity & Brand Guide
- **Colors**:
  - **Forest Green** (`#1D3C34`): Deep signature evergreen
  - **Sand White** (`#F7F5F0`): Warm, clean cream canvas
  - **Stone Grey** (`#8D9093`): Refined slate accents
  - **Charcoal Black** (`#171918`): Modern contrast
- **Hintful Mountain Graphics**:
  - Clean, modern Sand White background with subtle topographic / contour mountain line-art watermark (`mountain-line-art` and `topo-lines-overlay`).
  - Stamped with the 3 Core Brand Pillars:
    - ⛰️ **TRAVEL** (Mountain Peak Icon — Chart New Horizons)
    - 📖 **LEARN** (Open Book Icon — Feed Your Mind)
    - 📈 **IMPROVE** (Growth Metric Icon — Conquer Daily Peaks)
- **Tagline**: *"TRAVEL. LEARN. IMPROVE. FIND YOUR NORTH."*

---

## 🛍️ Official Brand Kit Drops (in INR ₹)
All products feature authentic cropped mockups from your official brand sheet:
1. **FYN Forest Green Embroidered Hoodie** — `₹3,499` (Orig: `₹4,299`)
2. **FYN Sand White Oversized Tee** — `₹1,499` (Orig: `₹1,999`)
3. **FYN Classic Cap Duo (Forest Green & Sand White)** — `₹1,199` (Orig: `₹1,599`)
4. **FYN Matte Forest Green Thermal Bottle & Luggage Tag** — `₹1,899` (Orig: `₹2,499`)
5. **FYN Charcoal Black Travel Duffel & Toiletry Kit** — `₹3,899` (Orig: `₹4,999`)
6. **FYN Stormproof Travel Umbrella** — `₹1,699` (Orig: `₹2,199`)
7. **FYN Expedition Technical Backpack 35L** — `₹4,499` (Orig: `₹5,999`)
8. **FYN Eco Kraft Mountain Shopping & Travel Bag Set** — `₹899` (Orig: `₹1,299`)

---

## 💳 Payment Gateway in INR & Direct Bank Link Tester
1. **Direct Bank Link / NetBanking**:
   - Supports State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra.
   - Includes **"Test Bank Payment Link Simulation"**: opens an interactive Bank Gateway sandbox dialog where you can click *"Approve Test Payment Now (Success)"* to test full order completion and receipt generation!
2. **UPI / QR Code**:
   - Standard UPI URI (`upi://pay?pa=fynbrand@icici&pn=FYN%20Enterprises&am=...&cu=INR`)
   - 1-click "Copy UPI Link" and QR code for UPI apps.
3. **Credit / Debit Cards**: RuPay, Visa, and Mastercard with auto-formatting.
4. **Discounts (₹)**:
   - `NORTH20`: 20% off all drops
   - `TRAVEL15`: 15% off orders over ₹2,499
   - `FYN500`: Flat ₹500 off orders over ₹3,999
   - `WELCOME10`: 10% welcome discount

---

## 🛡️ Hostinger-Style Admin Command Central (`/admin.html`)
**Credentials**: `admin@fyn.com` / `fyn2026`

### 1. Central KPI Station
- Live Gross Sales in Indian Rupees (`₹`)
- Total Orders & Pending Fulfilment counter
- Average Order Value (AOV in `₹`)
- Active Catalog Drops & Email logs

### 2. Order Fulfilment & Shipping Tracking Hub
- Complete order status workflow:
  `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Rejected`
- **Dispatch Shipment & Add Tracking**:
  - Carrier selection: **Blue Dart Express**, **Delhivery**, **DTDC**, **India Post Speed Post**, **FedEx**, **DHL**, **Shadowfax**.
  - Enter AWB Tracking Number & Tracking URL.
  - Set Estimated Delivery Date.
  - **1-Click "Dispatch & Send Email"**:
    - Saves carrier, tracking number, and status to Supabase `fyn_orders`.
    - Automatically formats and fires a branded **Dispatch Notice Email** with a direct "Track Your Package Online" button to the customer!
- **1-Click Order Approval**: Confirms order and triggers confirmation email.
- **1-Click Order Rejection**: Rejects order with reason and fires cancellation & refund notice email.

### 3. Product Inventory Management
- Add new drops to Supabase with title, category, price in `₹`, stock, image path, quote, and badge.
- 1-Click permanent product deletion.

### 4. Discounts & Coupon Engine
- Create percentage or flat `₹` discount coupons.
- 1-Click activate/deactivate or delete.

### 5. Customer CRM Database
- Overview of all customer profiles, contact numbers, cities, order counts, and lifetime `₹` spend.
- 1-Click direct email composer.

### 6. Customer Email Dispatcher & Live Audit Log
- Complete history of all emails sent to customers (`fyn_email_logs`).
- **"Inspect HTML"**: Opens an email preview modal showing the exact branded layout sent to the customer.
- **"Compose Direct Email"**: Send ad-hoc updates or announcements to any customer.

---

## 🚀 Running the Store
```bash
python3 server.py
# Storefront: http://localhost:8080/index.html
# Admin Command Central: http://localhost:8080/admin.html
```
