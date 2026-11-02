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

### Phase 3: Quotation Management Module (Completed)
- [x] Create Quotation form with dynamic multi-product line items.
- [x] Item-level calculations: Quantity × Unit Price, Discount %, Tax %, Line Total.
- [x] Quotation-level calculations: Subtotal + Delivery Charges + Additional Fees = Grand Total.
- [x] Measurement unit dropdowns (`kg`, `g`, `L`, `ml`, `pcs`, `units`, `box`, `carton`) and Package Size input.
- [x] Quotation detail view with commercial terms (Lead time, Warranty, Payment terms, MOQ, Notes).
- [x] Quotation status management (Draft, Submitted, Accepted, Rejected).
- [x] Filtering by supplier, date range, search, and status with KPI summary counters.
- [x] Persistent MongoDB storage with Mongoose model, validation, and Express REST APIs.

### Phase 4: Unit Price Normalisation & Comparison Engine (Completed)
- [x] Dedicated `unitConverter.js` utility engine on frontend and backend.
- [x] Unit dimension compatibility matrix (prevents comparing kg with litres).
- [x] Automated normalisation calculation to standard base units (₹/kg, ₹/L, ₹/pcs).
- [x] Side-by-side comparison matrix for 2 to 4 quotations.
- [x] Clear distinction and warning alerts between comparable and non-comparable items.
- [x] Visual indicators for lowest unit price and lowest total price.
- [x] Dedicated REST API `/api/quotations/compare` and integrated UI workflow.

### Phase 5: Trade-Off Analysis & Reports Module (Completed)
- [x] Objective trade-off matrix (Total Cost vs Lead Time vs Warranty vs Payment Terms vs MOQ).
- [x] Factual pros and cons summary for each vendor bid.
- [x] Multi-criteria configurable evaluation weighting (Price, Delivery Speed, Warranty, Terms) with preset profiles.
- [x] Transparent 0-100 scoring engine with penalty handling for missing data.
- [x] Spend analytics and cost structure breakdown (Product, Tax, Logistics, Discounts).
- [x] Supplier performance and turnaround audit table.
- [x] Executive audit-ready PDF report export using `jspdf` and `jspdf-autotable`.
- [x] Dashboard integration with evaluated spend and benchmark metrics.

### Phase 6: Full-Stack Express Backend & Public Deployment (Completed)
- [x] Express.js server in `server/` with CORS and security headers.
- [x] Mongoose schema for Suppliers and Quotations with complete validation.
- [x] REST API routes matching frontend service contracts.
- [x] Environment variable configuration (`.env` and `.env.example`).
- [x] Local MongoDB persistent storage engine with MongoDB Atlas remote support.
- [x] Production deployment preparation on Render for client and server (`render.yaml`).
- [x] Step-by-step deployment guide (`DEPLOYMENT_GUIDE.md`).
- [x] Environment-driven API client and production static bundle build verified.

---

## Progress Summary
- **Current Active Step**: All Phases Complete (Project is Production & Deployment Ready).
- **Next Step**: Awaiting User Approval to Trigger Public Render Deployment.

