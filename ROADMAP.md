# SupplierQuoteCompare — Implementation Roadmap

This document outlines the detailed roadmap for developing **SupplierQuoteCompare** in accordance with the Master Project Specification.

---

## Roadmap Phases

### Phase 1: Frontend Foundation & Dashboard (Current Phase)
- [x] Initial React + Vite scaffolding.
- [x] Tailwind CSS v4 styling system and custom theme tokens.
- [x] Responsive layout with collapsible sidebar and mobile drawer.
- [x] Install `react-router-dom` and `axios`.
- [x] Configure standard client-side routing (`/`, `/suppliers`, `/quotations`, `/compare`, `/reports`, `/settings`).
- [x] Modern Dashboard overview with KPIs, status metrics, recent quotations table, and recent activity.
- [x] Meaningful empty states when data is cleared or empty.
- [x] Reusable component hierarchy: Layout, MetricCard, WelcomeBanner, Table, Modal wrappers.

### Phase 2: Supplier Management Module (CRUD)
- [ ] Supplier listing page with search, category filtering, and status badges.
- [ ] Add Supplier modal/form with complete field validation (Email, Phone, City, Country, Address, Payment Terms).
- [ ] Edit Supplier modal to update vendor parameters.
- [ ] View Supplier detail view showing associated quotations history.
- [ ] Safe deletion dialog (checks for dependent active quotations before deletion).
- [ ] Export supplier directory.

### Phase 3: Quotation Management Module
- [ ] Create Quotation form with dynamic multi-product line items.
- [ ] Item-level calculations: Quantity × Unit Price, Discount %, Tax %, Line Total.
- [ ] Quotation-level calculations: Subtotal + Delivery Charges + Additional Fees = Grand Total.
- [ ] Measurement unit dropdowns (`kg`, `g`, `L`, `ml`, `pcs`, `units`) and Package Size input.
- [ ] Quotation detail view with commercial terms (Lead time, Warranty, Payment terms, MOQ).
- [ ] Quotation status management (Pending, Approved, Under Negotiation, Rejected).
- [ ] Filtering by vendor, date range, and status.

### Phase 4: Unit Price Normalisation & Comparison Engine
- [ ] Dedicated `unitConverter.js` utility engine.
- [ ] Unit dimension compatibility matrix (prevents comparing kg with litres).
- [ ] Automated normalisation calculation to standard base units (₹/kg, ₹/L, ₹/piece).
- [ ] Side-by-side comparison matrix for 2 to 4 quotations.
- [ ] Clear distinction between comparable and non-comparable items.
- [ ] Visual indicators for lowest unit price and lowest total price.

### Phase 5: Trade-Off Analysis & Reports Module
- [ ] Objective trade-off matrix (Total Cost vs Lead Time vs Warranty vs Payment Terms vs MOQ).
- [ ] Factual pros and cons summary for each vendor bid.
- [ ] Spend analytics charts by category and supplier turnaround trends.
- [ ] CSV and printable report export.
- [ ] System settings (Currency selector: INR/USD/EUR/GBP, quotation approval thresholds).

### Phase 6: Full-Stack Express Backend & MongoDB Atlas
- [ ] Express.js server in `server/` with CORS and security headers.
- [ ] Mongoose schemas for Suppliers, Quotations, and Comparisons.
- [ ] REST API routes matching frontend service contracts.
- [ ] Environment variable configuration (`.env.example`).
- [ ] MongoDB Atlas connection with fallback to mock data when database is disconnected.
- [ ] Production build and public deployment preparation on Render.

---

## Progress Summary
- **Current Active Step**: Phase 1 (Enhancing Frontend Foundation, React Router Integration, Reusable Normalization Utility, and Empty States).
- **Completed**: React + Vite, Tailwind CSS, Lucide icons, Initial interactive prototype, React Router & Axios installed, Master Specification & Roadmap saved.
