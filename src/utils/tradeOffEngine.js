/**
 * Trade-Off Evaluation & Multi-Criteria Scoring Engine
 * 
 * Provides transparent, mathematically sound scoring across 4 key dimensions:
 * 1. Price (Grand Total / Cost Efficiency)
 * 2. Delivery Speed (Lead Time in Business Days)
 * 3. Warranty Protection (Coverage in Months)
 * 4. Payment Terms (Credit Period Flexibility)
 * 
 * Strictly follows procurement best practices:
 * - Does not silently treat missing data as a good score
 * - Explains how each score is derived
 * - Weighted composite score out of 100 points
 */

export const PRESET_WEIGHTS = {
  balanced: {
    id: 'balanced',
    name: 'Balanced Procurement',
    description: 'Even distribution across financial, operational, and warranty criteria',
    weights: { price: 40, delivery: 25, warranty: 20, paymentTerms: 15 }
  },
  costPriority: {
    id: 'costPriority',
    name: 'Cost Minimization Priority',
    description: 'High weight on lowest purchase price and cash savings',
    weights: { price: 65, delivery: 15, warranty: 10, paymentTerms: 10 }
  },
  urgentDelivery: {
    id: 'urgentDelivery',
    name: 'Urgent Project / Fast Delivery',
    description: 'Fulfillment lead time is the primary decision driver',
    weights: { price: 25, delivery: 50, warranty: 15, paymentTerms: 10 }
  },
  riskProtection: {
    id: 'riskProtection',
    name: 'Quality & Risk Mitigation',
    description: 'Longer warranty coverage and supplier credit flexibility prioritised',
    weights: { price: 25, delivery: 15, warranty: 40, paymentTerms: 20 }
  }
};

/**
 * Maps payment terms string to a standardized 0-100 credit score
 */
export function getPaymentTermsScore(paymentTerms) {
  if (!paymentTerms || typeof paymentTerms !== 'string') {
    return {
      score: 10,
      days: 0,
      label: 'Unspecified / Advance Required (Penalty applied)',
      isMissing: true
    };
  }

  const clean = paymentTerms.toLowerCase().trim();

  if (clean.includes('60') || clean.includes('90')) {
    return { score: 100, days: 60, label: 'Net 60 Days (Optimal Credit)' };
  }
  if (clean.includes('45')) {
    return { score: 85, days: 45, label: 'Net 45 Days (Favorable Credit)' };
  }
  if (clean.includes('30')) {
    return { score: 70, days: 30, label: 'Net 30 Days (Standard Industry Terms)' };
  }
  if (clean.includes('15') || clean.includes('14')) {
    return { score: 50, days: 15, label: 'Net 15 Days (Short Credit)' };
  }
  if (clean.includes('advance') || clean.includes('cod') || clean.includes('cash') || clean.includes('immediate')) {
    return { score: 25, days: 0, label: 'Advance / COD (High Cashflow Impact)' };
  }

  return { score: 40, days: 0, label: paymentTerms };
}

/**
 * Evaluates multiple quotations using transparent weighted scoring
 * 
 * @param {Array} quotations - List of quotation objects
 * @param {Object} rawWeights - Weights object { price, delivery, warranty, paymentTerms }
 * @returns {Array} List of evaluated quotations with transparent scores and breakdowns
 */
export function evaluateQuotations(quotations = [], rawWeights = PRESET_WEIGHTS.balanced.weights) {
  if (!quotations || quotations.length === 0) return [];

  // Normalize weights so they sum to 1.0 (or 100%)
  const sumWeights = (rawWeights.price || 0) + 
                     (rawWeights.delivery || 0) + 
                     (rawWeights.warranty || 0) + 
                     (rawWeights.paymentTerms || 0) || 100;

  const weights = {
    price: (rawWeights.price || 0) / sumWeights,
    delivery: (rawWeights.delivery || 0) / sumWeights,
    warranty: (rawWeights.warranty || 0) / sumWeights,
    paymentTerms: (rawWeights.paymentTerms || 0) / sumWeights
  };

  // Find min/max anchors across the comparison cohort
  const validPrices = quotations.map(q => q.summary?.grandTotal || q.totalAmount || 0).filter(p => p > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 1;
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 1;

  const validLeadTimes = quotations.map(q => q.commercialTerms?.leadTimeDays || 0).filter(d => d > 0);
  const minLeadTime = validLeadTimes.length > 0 ? Math.min(...validLeadTimes) : 7;

  const validWarranties = quotations.map(q => q.commercialTerms?.warrantyMonths || 0);
  const maxWarranty = validWarranties.length > 0 ? Math.max(...validWarranties, 12) : 12;

  // Evaluate each quotation
  const scoredQuotations = quotations.map(quote => {
    const qId = quote._id || quote.id;
    const price = quote.summary?.grandTotal || quote.totalAmount || 0;
    const leadTime = quote.commercialTerms?.leadTimeDays;
    const warranty = quote.commercialTerms?.warrantyMonths;
    const paymentTerms = quote.commercialTerms?.paymentTerms || quote.supplierId?.paymentTerms;

    // 1. Price Score: Lower is better -> (MinPrice / QuotePrice) * 100
    let priceScore = 0;
    let priceExplanation = '';
    if (price > 0) {
      priceScore = Math.min(100, Math.round((minPrice / price) * 100));
      priceExplanation = price === minPrice
        ? 'Lowest commercial bid (100 pts)'
        : `${Math.round(((price - minPrice) / minPrice) * 100)}% higher than lowest bid (${priceScore} pts)`;
    } else {
      priceScore = 0;
      priceExplanation = 'Missing or invalid price data (0 pts)';
    }

    // 2. Delivery Score: Lower days is better -> (MinLeadTime / QuoteLeadTime) * 100
    let deliveryScore = 0;
    let deliveryExplanation = '';
    if (leadTime && leadTime > 0) {
      deliveryScore = Math.min(100, Math.round((minLeadTime / leadTime) * 100));
      deliveryExplanation = leadTime === minLeadTime
        ? `Fastest fulfillment at ${leadTime} business days (100 pts)`
        : `${leadTime - minLeadTime} days slower than fastest bid (${deliveryScore} pts)`;
    } else {
      deliveryScore = 15; // penalty for uncommitted lead time
      deliveryExplanation = 'Lead time unspecified by supplier (penalty score: 15 pts)';
    }

    // 3. Warranty Score: Higher months is better -> (QuoteWarranty / MaxWarranty) * 100
    let warrantyScore = 0;
    let warrantyExplanation = '';
    if (warranty !== undefined && warranty !== null && warranty >= 0) {
      warrantyScore = maxWarranty > 0 ? Math.min(100, Math.round((warranty / maxWarranty) * 100)) : 50;
      warrantyExplanation = warranty === maxWarranty
        ? `Maximum warranty protection at ${warranty} months (100 pts)`
        : `${warranty} months warranty coverage (${warrantyScore} pts)`;
    } else {
      warrantyScore = 10;
      warrantyExplanation = 'Warranty not specified (penalty score: 10 pts)';
    }

    // 4. Payment Terms Score
    const termsMeta = getPaymentTermsScore(paymentTerms);
    const termsScore = termsMeta.score;
    const termsExplanation = termsMeta.label;

    // Weighted composite score (0 to 100)
    const compositeScore = Number((
      (priceScore * weights.price) +
      (deliveryScore * weights.delivery) +
      (warrantyScore * weights.warranty) +
      (termsScore * weights.paymentTerms)
    ).toFixed(1));

    // Determine pros and cons
    const pros = [];
    const cons = [];

    if (price === minPrice) {
      pros.push(`Lowest overall purchase price (${formatCurrencyINR(price)})`);
    } else {
      const priceDiff = price - minPrice;
      const pctDiff = Math.round((priceDiff / minPrice) * 100);
      cons.push(`₹${priceDiff.toLocaleString()} (${pctDiff}%) premium over lowest bid`);
    }

    if (leadTime === minLeadTime && validLeadTimes.length > 1) {
      pros.push(`Fastest delivery turnaround (${leadTime} business days)`);
    } else if (leadTime > minLeadTime) {
      cons.push(`${leadTime - minLeadTime} days slower lead time than fastest supplier`);
    }

    if (warranty === maxWarranty && validWarranties.length > 1 && maxWarranty > 12) {
      pros.push(`Superior ${warranty}-month warranty coverage`);
    } else if (warranty < maxWarranty) {
      cons.push(`Shorter warranty period (${warranty || 0} vs ${maxWarranty} months)`);
    }

    if (termsMeta.days >= 45) {
      pros.push(`Flexible cash flow terms (${termsMeta.label})`);
    } else if (termsMeta.days <= 15) {
      cons.push(`Restricted credit window (${termsMeta.label})`);
    }

    return {
      quotation: quote,
      id: qId,
      quotationNumber: quote.quotationNumber || quote.id,
      supplierName: quote.supplierName,
      grandTotal: price,
      leadTimeDays: leadTime || 0,
      warrantyMonths: warranty || 0,
      paymentTerms: paymentTerms || 'Unspecified',
      scores: {
        price: priceScore,
        delivery: deliveryScore,
        warranty: warrantyScore,
        paymentTerms: termsScore,
        composite: compositeScore
      },
      weightedContributions: {
        price: Number((priceScore * weights.price).toFixed(1)),
        delivery: Number((deliveryScore * weights.delivery).toFixed(1)),
        warranty: Number((warrantyScore * weights.warranty).toFixed(1)),
        paymentTerms: Number((termsScore * weights.paymentTerms).toFixed(1))
      },
      explanations: {
        price: priceExplanation,
        delivery: deliveryExplanation,
        warranty: warrantyExplanation,
        paymentTerms: termsExplanation
      },
      pros,
      cons
    };
  });

  // Sort descending by composite score
  return scoredQuotations.sort((a, b) => b.scores.composite - a.scores.composite);
}

function formatCurrencyINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);
}
