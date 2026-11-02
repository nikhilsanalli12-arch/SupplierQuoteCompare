import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier/Company name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Supplier category is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Business address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'United States'
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    paymentTerms: {
      type: String,
      default: 'Net 30',
      enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', '100% Advance', '50% Advance, 50% on Delivery']
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Under Review', 'Inactive']
    },
    activeQuotes: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted location
supplierSchema.virtual('location').get(function () {
  return `${this.city}, ${this.country}`;
});

export const Supplier = mongoose.model('Supplier', supplierSchema);
