import { Quotation } from '../models/Quotation.js';
import { Supplier } from '../models/Supplier.js';
import { calculateQuotationTotals } from '../utils/costCalculator.js';
import { normalizeUnitPrice, areUnitsCompatible, getUnitDimension } from '../utils/unitConverter.js';

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

    const quotations = await Quotation.find(query).sort(sortOption).populate('supplierId', 'name email phone category rating city country address paymentTerms');

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

/**
 * @route   GET/POST /api/quotations/compare
 * @desc    Compare 2 to 4 quotations with unit price normalisation and multi-parametric trade-offs
 */
export const compareQuotations = async (req, res) => {
  try {
    let ids = [];
    if (req.method === 'POST') {
      ids = req.body.quotationIds || req.body.ids || [];
    } else {
      const qIds = req.query.ids || req.query.quotationIds || '';
      ids = typeof qIds === 'string' ? qIds.split(',').map(s => s.trim()).filter(Boolean) : qIds;
    }

    if (!Array.isArray(ids) || ids.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 quotation IDs to perform a comparison.'
      });
    }

    if (ids.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'You can compare a maximum of 4 quotations simultaneously.'
      });
    }

    // Fetch quotations from database
    const quotations = await Quotation.find({ _id: { $in: ids } })
      .populate('supplierId', 'name email phone category rating city country address paymentTerms');

    if (quotations.length < 2) {
      return res.status(404).json({
        success: false,
        message: `Found only ${quotations.length} matching quotations. At least 2 valid quotations are required.`
      });
    }

    // Preserve order matching requested IDs
    const orderedQuotations = ids
      .map(id => quotations.find(q => q._id.toString() === id.toString()))
      .filter(Boolean);

    // 1. Grand totals & Cost variance
    const grandTotals = orderedQuotations.map(q => q.summary?.grandTotal || 0);
    const minGrandTotal = Math.min(...grandTotals);
    const maxGrandTotal = Math.max(...grandTotals);
    const costVariance = maxGrandTotal - minGrandTotal;
    const lowestCostQuote = orderedQuotations.find(q => (q.summary?.grandTotal || 0) === minGrandTotal);

    // 2. Lead times & Warranty
    const leadTimes = orderedQuotations.map(q => q.commercialTerms?.leadTimeDays || 999);
    const minLeadTime = Math.min(...leadTimes);
    const fastestDeliveryQuote = orderedQuotations.find(q => (q.commercialTerms?.leadTimeDays || 999) === minLeadTime);

    const warranties = orderedQuotations.map(q => q.commercialTerms?.warrantyMonths || 0);
    const maxWarranty = Math.max(...warranties);
    const longestWarrantyQuote = orderedQuotations.find(q => (q.commercialTerms?.warrantyMonths || 0) === maxWarranty);

    // 3. Line Item Alignment & Unit Normalisation
    const productMap = new Map();
    orderedQuotations.forEach(q => {
      (q.items || []).forEach(item => {
        const normKey = (item.name || '').trim().toLowerCase();
        if (!productMap.has(normKey)) {
          productMap.set(normKey, {
            displayName: item.name,
            category: item.category,
            entries: []
          });
        }

        // Calculate normalised price
        const normResult = normalizeUnitPrice(
          item.unitPrice,
          item.packageSize,
          item.measurementUnit
        );

        productMap.get(normKey).entries.push({
          quotationId: q._id,
          quotationNumber: q.quotationNumber,
          supplierName: q.supplierName,
          item,
          calculatedNormalisation: normResult
        });
      });
    });

    const alignedItems = [];
    for (const [key, prod] of productMap.entries()) {
      const unitsUsed = prod.entries.map(e => e.item.measurementUnit || 'pcs');
      const uniqueUnits = [...new Set(unitsUsed)];

      let areAllCompatible = true;
      let incompatibleDetails = null;

      if (uniqueUnits.length > 1) {
        for (let i = 0; i < uniqueUnits.length - 1; i++) {
          if (!areUnitsCompatible(uniqueUnits[i], uniqueUnits[i + 1])) {
            areAllCompatible = false;
            const dim1 = getUnitDimension(uniqueUnits[i])?.dimension || 'unknown';
            const dim2 = getUnitDimension(uniqueUnits[i + 1])?.dimension || 'unknown';
            incompatibleDetails = `Incompatible dimensions: "${uniqueUnits[i]}" (${dim1}) cannot be normalised against "${uniqueUnits[i + 1]}" (${dim2}).`;
            break;
          }
        }
      }

      // Find lowest normalised unit price if compatible
      let lowestUnitPrice = null;
      let lowestUnitEntry = null;

      if (areAllCompatible) {
        prod.entries.forEach(entry => {
          const np = entry.calculatedNormalisation?.normalizedPrice;
          if (np !== undefined && np !== null) {
            if (lowestUnitPrice === null || np < lowestUnitPrice) {
              lowestUnitPrice = np;
              lowestUnitEntry = entry;
            }
          }
        });
      }

      alignedItems.push({
        productName: prod.displayName,
        category: prod.category,
        isShared: prod.entries.length > 1,
        areAllCompatible,
        incompatibleDetails,
        lowestNormalisedUnitPrice: lowestUnitPrice,
        lowestUnitEntry: lowestUnitEntry ? {
          quotationId: lowestUnitEntry.quotationId,
          quotationNumber: lowestUnitEntry.quotationNumber,
          supplierName: lowestUnitEntry.supplierName,
          price: lowestUnitPrice,
          baseUnit: lowestUnitEntry.calculatedNormalisation?.baseUnit
        } : null,
        entries: prod.entries
      });
    }

    // 4. Multi-Parametric Trade-Off Insights
    const tradeOffInsights = [];

    if (costVariance > 0 && lowestCostQuote) {
      tradeOffInsights.push({
        type: 'cost',
        badge: 'Lowest Commercial Total',
        title: 'Price Variance Opportunity',
        description: `${lowestCostQuote.supplierName} (${lowestCostQuote.quotationNumber}) offers the lowest total cost at ₹${minGrandTotal.toLocaleString()}, providing a potential savings opportunity of ₹${costVariance.toLocaleString()} over the highest bid.`
      });
    }

    if (fastestDeliveryQuote && fastestDeliveryQuote._id.toString() !== lowestCostQuote?._id.toString()) {
      const daysDiff = (lowestCostQuote?.commercialTerms?.leadTimeDays || 0) - minLeadTime;
      tradeOffInsights.push({
        type: 'delivery',
        badge: 'Fastest Delivery',
        title: 'Lead Time Advantage',
        description: `${fastestDeliveryQuote.supplierName} delivers in ${minLeadTime} days (${daysDiff > 0 ? `${daysDiff} days faster than ${lowestCostQuote?.supplierName}` : 'fastest fulfillment'}). If delivery speed is critical, this may outweigh price differences.`
      });
    }

    if (longestWarrantyQuote && maxWarranty > (lowestCostQuote?.commercialTerms?.warrantyMonths || 0)) {
      tradeOffInsights.push({
        type: 'warranty',
        badge: 'Longest Warranty',
        title: 'Extended Risk Protection',
        description: `${longestWarrantyQuote.supplierName} provides ${maxWarranty} months warranty (vs ${lowestCostQuote?.commercialTerms?.warrantyMonths || 0} months from ${lowestCostQuote?.supplierName}), offering stronger operational risk coverage.`
      });
    }

    tradeOffInsights.push({
      type: 'decision_guidance',
      badge: 'Procurement Notice',
      title: 'Objective Procurement Decision',
      description: 'The cheapest quotation is not necessarily the best overall value. Evaluate supplier rating, payment terms flexibility, warranty terms, and packaging efficiency before deciding.'
    });

    res.status(200).json({
      success: true,
      count: orderedQuotations.length,
      data: {
        quotations: orderedQuotations,
        alignedItems,
        insights: {
          lowestCostQuote: {
            id: lowestCostQuote?._id,
            quotationNumber: lowestCostQuote?.quotationNumber,
            supplierName: lowestCostQuote?.supplierName,
            grandTotal: minGrandTotal
          },
          highestCostQuote: {
            grandTotal: maxGrandTotal
          },
          costVariance,
          fastestDeliveryQuote: {
            id: fastestDeliveryQuote?._id,
            quotationNumber: fastestDeliveryQuote?.quotationNumber,
            supplierName: fastestDeliveryQuote?.supplierName,
            leadTimeDays: minLeadTime
          },
          longestWarrantyQuote: {
            id: longestWarrantyQuote?._id,
            quotationNumber: longestWarrantyQuote?.quotationNumber,
            supplierName: longestWarrantyQuote?.supplierName,
            warrantyMonths: maxWarranty
          },
          tradeOffs: tradeOffInsights
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to perform quotation comparison',
      error: error.message
    });
  }
};
