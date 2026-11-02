# SupplierQuoteCompare — Master Project Specification

## 1. Executive Summary & Purpose
**SupplierQuoteCompare** is an enterprise-grade procurement analysis and quotation comparison platform. It enables businesses to systematically manage supplier data, register commercial quotations with multiple product line items, compute multi-tier purchasing costs, normalize prices across disparate packaging units (e.g., kg vs. grams, litres vs. ml), and conduct objective cost vs. non-cost trade-off analyses (warranties, payment terms, lead times, delivery costs, MOQs) to make optimal purchasing decisions without assuming the lowest-priced vendor is automatically best.

---

## 2. Core Architectural Principles
1. **Separation of Concerns**: Modular React frontend client communicating via REST APIs with an Express.js / Node.js backend connected to MongoDB Atlas.
2. **Explicit Calculation Hierarchy**: No hidden assumptions in pricing, tax, or discounts. All calculation steps are deterministic, verifiable, and consistent across line items and comparison matrices.
3. **Unit Price Normalisation as a First-Class Citizen**: Reusable unit conversion engine that prevents incompatible dimension comparisons (e.g., mass vs. volume) and avoids division by zero.
4. **Objective Multi-Factor Trade-off Analysis**: Clear presentation of price, warranty, delivery times, payment conditions, and minimum order requirements without biased algorithms.

---

## 3. Mathematical & Business Logic Specifications

### 3.1 Total Cost Calculation Engine
The calculation order must be strictly deterministic across individual quotations and comparison views:

```
For each product line item:
  Line Subtotal       = Quantity * UnitPrice
  Line Discount ($)   = Line Subtotal * (DiscountPercent / 100)
  Net Line Subtotal   = Line Subtotal - Line Discount
  Line Tax ($)        = Net Line Subtotal * (TaxPercent / 100)
  Line Total Amount   = Net Line Subtotal + Line Tax

For the entire quotation:
  Product Subtotal    = Sum(Line Total Amount for all items)
  Grand Total Cost    = Product Subtotal + DeliveryCharges + AdditionalCharges
```

### 3.2 Unit Price Normalisation Formula
To compare quotes with varying package sizes (e.g. 500g bag at ₹250 vs 2kg box at ₹900 vs 1kg pouch at ₹500):

1. **Dimensional Compatibility Check**:
   - Mass: `kg`, `g` (Base unit: `kg`, 1 kg = 1,000 g)
   - Volume: `L`, `ml` (Base unit: `L`, 1 L = 1,000 ml)
   - Discrete Count: `pcs`, `units`, `boxes`, `cartons`
2. **Validation Rules**:
   - Incompatible units (e.g., comparing `kg` to `litres`) must be flagged with an explicit warning and cannot be normalized together.
   - Package Size > 0 (prevents division by zero).
   - Package Quantity is distinct from Order Quantity.
3. **Formula**:
   $$\text{Normalised Quantity per Unit} = \text{Package Size} \times \text{Unit Conversion Factor to Base}$$
   $$\text{Normalised Unit Price} = \frac{\text{Unit Price}}{\text{Normalised Quantity per Unit}}$$

### 3.3 Trade-Off Assessment Matrix
Evaluates non-cost parameters alongside total spend:
- **Commercial Total**: Grand total cost differential.
- **Lead Time**: Delivery speed (business days).
- **Warranty**: Manufacturer / supplier warranty term (months).
- **Payment Terms**: Working capital impact (e.g., Net 60 vs Net 15 vs 100% advance).
- **Minimum Order Quantity (MOQ)**: Flexibility for batch orders.
- **Freight & Logistics Inclusion**: FOB vs CIF vs vendor-paid shipping.

---

## 4. Database Schema Design (MongoDB / Mongoose)

### 4.1 Suppliers Collection (`suppliers`)
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  rating: { type: Number, min: 1, max: 5, default: 4.5 },
  paymentTerms: { type: String, default: 'Net 30' },
  notes: { type: String },
  status: { type: String, enum: ['Active', 'Under Review', 'Inactive'], default: 'Active' },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Quotations Collection (`quotations`)
```javascript
{
  _id: ObjectId,
  quotationNumber: { type: String, required: true, unique: true }, // e.g. QT-2026-001
  supplierId: { type: ObjectId, ref: 'Supplier', required: true },
  supplierName: { type: String, required: true },
  quotationDate: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  currency: { type: String, default: 'INR' },
  items: [
    {
      productName: { type: String, required: true },
      description: String,
      category: String,
      orderQuantity: { type: Number, required: true, min: 1 },
      measurementUnit: { type: String, enum: ['kg', 'g', 'L', 'ml', 'pcs', 'units'], required: true },
      packageSize: { type: Number, required: true, default: 1 }, // e.g. 500 for 500g
      unitPrice: { type: Number, required: true, min: 0 },
      discountPercent: { type: Number, default: 0, min: 0, max: 100 },
      taxPercent: { type: Number, default: 0, min: 0, max: 100 },
      lineTotal: { type: Number, required: true },
      normalisedUnitPrice: { type: Number },
      normalisedBaseUnit: { type: String }
    }
  ],
  commercialTerms: {
    deliveryCharges: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    leadTimeDays: { type: Number, required: true },
    warrantyMonths: { type: Number, default: 12 },
    paymentTerms: { type: String, default: 'Net 30' },
    minOrderQuantity: { type: Number, default: 1 },
    specialConditions: String
  },
  subtotal: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  totalDiscount: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Under Negotiation', 'Rejected'], default: 'Pending' },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. REST API Endpoints Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Aggregated metrics (Suppliers, Quotes, Pending, Savings, Activity) |
| `GET` | `/api/suppliers` | List all suppliers with filtering & search |
| `POST` | `/api/suppliers` | Create new supplier |
| `GET` | `/api/suppliers/:id` | Get supplier details & associated quotes |
| `PUT` | `/api/suppliers/:id` | Update supplier details |
| `DELETE`| `/api/suppliers/:id` | Delete supplier (protected if quotes exist) |
| `GET` | `/api/quotations` | List quotations with status & supplier filters |
| `POST` | `/api/quotations` | Create quotation with multi-line items & auto-calculations |
| `GET` | `/api/quotations/:id` | Get full quotation details |
| `PUT` | `/api/quotations/:id` | Update quotation / status |
| `DELETE`| `/api/quotations/:id` | Delete quotation |
| `POST` | `/api/comparison/evaluate` | Evaluate 2+ quotations: normalisation & trade-offs |
| `GET` | `/api/reports/analytics` | Category spend, lead times, vendor ratings, savings audit |

---

## 6. Implementation Phasing
- **Phase 1**: Frontend Foundation, Routing, and Dashboard.
- **Phase 2**: Complete Supplier CRUD Management.
- **Phase 3**: Comprehensive Multi-Item Quotation Management.
- **Phase 4**: Unit Price Normalisation & Multi-Quote Comparison Engine.
- **Phase 5**: Trade-Off Analysis Engine & Procurement Reports / Export.
- **Phase 6**: Node.js/Express Backend, MongoDB Atlas Mongoose Integration & Deployment.
