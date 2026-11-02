import { Quotation } from '../models/Quotation.js';
import { Supplier } from '../models/Supplier.js';
import { calculateQuotationTotals } from '../utils/costCalculator.js';
import { normalizeUnitPrice } from '../utils/unitConverter.js';

/**
 * @route   GET /api/quotations
 * @desc    Get all quotations with search and filters
 */
export const getQuotations = async (req, res) => {
  try {
    const { search, supplierId, status, sort } = req.query;

    const query = {};

    // Search by quotationNumber, supplierName, description or item name
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { quotationNumber: searchRegex },
        { supplierName: searchRegex },
        { description: searchRegex },
        { 'items.name': searchRegex }
      ];
    }

    if (supplierId && supplierId !== 'All') {
      query.supplierId = supplierId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let sortOption = { quotationDate: -1 };
    if (sort === 'total_asc') sortOption = { 'summary.grandTotal': 1 };
    if (sort === 'total_desc') sortOption = { 'summary.grandTotal': -1 };
    if (sort === 'date_asc') sortOption = { quotationDate: 1 };
    if (sort === 'number') sortOption = { quotationNumber: 1 };

    const quotations = await Quotation.find(query).sort(sortOption).populate('supplierId', 'name email phone category');

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quotations',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/quotations/:id
 * @desc    Get single quotation by ID
 */
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('supplierId');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: `Quotation not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: quotation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quotation details',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/quotations
 * @desc    Create new quotation with line items and deterministic cost calculations
 */
export const createQuotation = async (req, res) => {
  try {
    const {
      quotationNumber,
      supplierId,
      quotationDate,
      validUntil,
      description,
      status,
      items,
      commercialTerms
    } = req.body;

    // Validate supplier existence
    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: 'Supplier selection is required.'
      });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'The selected supplier does not exist in the database.'
      });
    }

    // Validate line items presence
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one product or service line item.'
      });
    }

    // Auto-generate quotation number if not provided
    const quoteNo = quotationNumber?.trim() || `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check duplicate quotation number
    const existing = await Quotation.findOne({ quotationNumber: quoteNo.toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A quotation with reference number "${quoteNo}" already exists.`
      });
    }

    // Delivery and additional charges from commercial terms
    const delivery = Number(commercialTerms?.deliveryCharges || 0);
    const additional = Number(commercialTerms?.additionalCharges || 0);

    // Calculate totals deterministically
    const calculated = calculateQuotationTotals(items, delivery, additional);

    // Apply unit price normalisation to each item
    const normalizedItems = calculated.items.map((item) => {
      const norm = normalizeUnitPrice(item.unitPrice, item.packageSize || 1, item.measurementUnit || 'pcs');
      return {
        ...item,
        normalisedUnitPrice: norm.normalizedPrice,
        normalisedBaseUnit: norm.baseUnit
      };
    });

    const quotation = await Quotation.create({
      quotationNumber: quoteNo.toUpperCase(),
      supplierId: supplier._id,
      supplierName: supplier.name,
      quotationDate: quotationDate ? new Date(quotationDate) : new Date(),
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: description || '',
      status: status || 'Draft',
      items: normalizedItems,
      commercialTerms: {
        deliveryCharges: delivery,
        additionalCharges: additional,
        leadTimeDays: Number(commercialTerms?.leadTimeDays || 7),
        warrantyMonths: Number(commercialTerms?.warrantyMonths || 12),
        paymentTerms: commercialTerms?.paymentTerms || supplier.paymentTerms || 'Net 30',
        minOrderQuantity: Number(commercialTerms?.minOrderQuantity || 1),
        notes: commercialTerms?.notes || ''
      },
      summary: {
        grossSubtotal: calculated.grossSubtotal,
        totalDiscount: calculated.totalDiscount,
        netSubtotal: calculated.netSubtotal,
        totalTax: calculated.totalTax,
        productSubtotal: calculated.productSubtotal,
        deliveryCharges: calculated.deliveryCharges,
        additionalCharges: calculated.additionalCharges,
        grandTotal: calculated.grandTotal,
        currency: 'INR'
      }
    });

    // Increment supplier active quote counter
    await Supplier.findByIdAndUpdate(supplier._id, { $inc: { activeQuotes: 1 } });

    res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: quotation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed while creating quotation',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/quotations/:id
 * @desc    Update existing quotation
 */
export const updateQuotation = async (req, res) => {
  try {
    const existingQuote = await Quotation.findById(req.params.id);
    if (!existingQuote) {
      return res.status(404).json({
        success: false,
        message: `Quotation not found with id ${req.params.id}`
      });
    }

    const {
      quotationNumber,
      supplierId,
      quotationDate,
      validUntil,
      description,
      status,
      items,
      commercialTerms
    } = req.body;

    // Check unique quotationNumber if updated
    if (quotationNumber && quotationNumber.toUpperCase() !== existingQuote.quotationNumber) {
      const duplicate = await Quotation.findOne({ 
        quotationNumber: quotationNumber.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Another quotation already exists with reference number "${quotationNumber}".`
        });
      }
    }

    // Determine supplier
    let supplierName = existingQuote.supplierName;
    if (supplierId && supplierId !== existingQuote.supplierId.toString()) {
      const newSupplier = await Supplier.findById(supplierId);
      if (newSupplier) {
        supplierName = newSupplier.name;
        // Transfer activeQuote count
        await Supplier.findByIdAndUpdate(existingQuote.supplierId, { $inc: { activeQuotes: -1 } });
        await Supplier.findByIdAndUpdate(newSupplier._id, { $inc: { activeQuotes: 1 } });
      }
    }

    const itemsToProcess = items || existingQuote.items;
    const delivery = Number(commercialTerms?.deliveryCharges !== undefined ? commercialTerms.deliveryCharges : existingQuote.commercialTerms.deliveryCharges);
    const additional = Number(commercialTerms?.additionalCharges !== undefined ? commercialTerms.additionalCharges : existingQuote.commercialTerms.additionalCharges);

    const calculated = calculateQuotationTotals(itemsToProcess, delivery, additional);

    const normalizedItems = calculated.items.map((item) => {
      const norm = normalizeUnitPrice(item.unitPrice, item.packageSize || 1, item.measurementUnit || 'pcs');
      return {
        ...item,
        normalisedUnitPrice: norm.normalizedPrice,
        normalisedBaseUnit: norm.baseUnit
      };
    });

    const updatedQuote = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        quotationNumber: quotationNumber ? quotationNumber.toUpperCase() : existingQuote.quotationNumber,
        supplierId: supplierId || existingQuote.supplierId,
        supplierName,
        quotationDate: quotationDate ? new Date(quotationDate) : existingQuote.quotationDate,
        validUntil: validUntil ? new Date(validUntil) : existingQuote.validUntil,
        description: description !== undefined ? description : existingQuote.description,
        status: status || existingQuote.status,
        items: normalizedItems,
        commercialTerms: {
          deliveryCharges: delivery,
          additionalCharges: additional,
          leadTimeDays: Number(commercialTerms?.leadTimeDays !== undefined ? commercialTerms.leadTimeDays : existingQuote.commercialTerms.leadTimeDays),
          warrantyMonths: Number(commercialTerms?.warrantyMonths !== undefined ? commercialTerms.warrantyMonths : existingQuote.commercialTerms.warrantyMonths),
          paymentTerms: commercialTerms?.paymentTerms || existingQuote.commercialTerms.paymentTerms,
          minOrderQuantity: Number(commercialTerms?.minOrderQuantity !== undefined ? commercialTerms.minOrderQuantity : existingQuote.commercialTerms.minOrderQuantity),
          notes: commercialTerms?.notes !== undefined ? commercialTerms.notes : existingQuote.commercialTerms.notes
        },
        summary: {
          grossSubtotal: calculated.grossSubtotal,
          totalDiscount: calculated.totalDiscount,
          netSubtotal: calculated.netSubtotal,
          totalTax: calculated.totalTax,
          productSubtotal: calculated.productSubtotal,
          deliveryCharges: calculated.deliveryCharges,
          additionalCharges: calculated.additionalCharges,
          grandTotal: calculated.grandTotal,
          currency: 'INR'
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      data: updatedQuote
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update quotation',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/quotations/:id
 * @desc    Delete quotation
 */
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: `Quotation not found with id ${req.params.id}`
      });
    }

    await Quotation.findByIdAndDelete(req.params.id);

    // Decrement supplier activeQuotes count
    await Supplier.findByIdAndUpdate(quotation.supplierId, { $inc: { activeQuotes: -1 } });

    res.status(200).json({
      success: true,
      message: `Quotation ${quotation.quotationNumber} removed successfully.`,
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete quotation',
      error: error.message
    });
  }
};
