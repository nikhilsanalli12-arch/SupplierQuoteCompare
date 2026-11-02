import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Line item name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [0.0001, 'Quantity must be greater than zero']
    },
    packageSize: {
      type: Number,
      default: 1,
      min: [0.0001, 'Package size must be greater than zero']
    },
    measurementUnit: {
      type: String,
      required: [true, 'Measurement unit is required'],
      enum: ['kg', 'g', 'L', 'ml', 'pcs', 'units', 'box', 'carton'],
      default: 'pcs'
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    taxPercent: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
      max: [100, 'Tax cannot exceed 100%']
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    grossSubtotal: {
      type: Number,
      default: 0
    },
    netSubtotal: {
      type: Number,
      default: 0
    },
    lineTotal: {
      type: Number,
      required: true,
      default: 0
    },
    normalisedUnitPrice: {
      type: Number
    },
    normalisedBaseUnit: {
      type: String
    }
  },
  { _id: true }
);

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: [true, 'Quotation/reference number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Associated supplier is required']
    },
    supplierName: {
      type: String,
      required: [true, 'Supplier name is required']
    },
    quotationDate: {
      type: Date,
      required: [true, 'Quotation date is required'],
      default: Date.now
    },
    validUntil: {
      type: Date,
      required: [true, 'Validity expiry date is required']
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Accepted', 'Rejected'],
      default: 'Draft'
    },
    items: {
      type: [lineItemSchema],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: 'A quotation must contain at least one product/service line item.'
      }
    },
    commercialTerms: {
      deliveryCharges: {
        type: Number,
        default: 0,
        min: [0, 'Delivery charges cannot be negative']
      },
      additionalCharges: {
        type: Number,
        default: 0,
        min: [0, 'Additional charges cannot be negative']
      },
      leadTimeDays: {
        type: Number,
        required: [true, 'Expected delivery time is required'],
        default: 7,
        min: [1, 'Lead time must be at least 1 day']
      },
      warrantyMonths: {
        type: Number,
        default: 12,
        min: [0, 'Warranty months cannot be negative']
      },
      paymentTerms: {
        type: String,
        default: 'Net 30'
      },
      minOrderQuantity: {
        type: Number,
        default: 1,
        min: [1, 'MOQ must be at least 1']
      },
      notes: {
        type: String,
        default: ''
      }
    },
    summary: {
      grossSubtotal: { type: Number, default: 0 },
      totalDiscount: { type: Number, default: 0 },
      netSubtotal: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      productSubtotal: { type: Number, default: 0 },
      deliveryCharges: { type: Number, default: 0 },
      additionalCharges: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true, default: 0 },
      currency: { type: String, default: 'INR' }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for fast lookups
quotationSchema.index({ supplierId: 1, status: 1 });


export const Quotation = mongoose.model('Quotation', quotationSchema);
