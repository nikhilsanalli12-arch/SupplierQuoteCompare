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
- [x] Supplier listing page with search, category filtering, and status badges.
- [x] Add Supplier modal/form with complete field validation (Email, Phone, City, Country, Address, Payment Terms).
- [x] Edit Supplier modal to update vendor parameters.
- [x] View Supplier detail view showing associated quotations history and complete profile.
- [x] Safe deletion dialog (checks for dependent active quotations before deletion).
- [x] Table and Grid view toggles with responsive design.
- [x] Express REST API backend and MongoDB Mongoose persistent database integration.

### Phase 3: Quotation Management Module (Next Phase)
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
- [x] Express.js server in `server/` with CORS and security headers.
- [x] Mongoose schema for Suppliers with complete validation.
- [x] REST API routes matching frontend service contracts.
- [x] Environment variable configuration (`.env` and `.env.example`).
- [x] Local MongoDB persistent storage engine with MongoDB Atlas remote support.
- [ ] Production deployment preparation on Render.

---

## Progress Summary
- **Current Active Step**: Phase 2 Complete (Supplier Management Module & MongoDB Mongoose Integration).
- **Next Step**: Phase 3 (Quotation Management Module with Dynamic Line Items).

