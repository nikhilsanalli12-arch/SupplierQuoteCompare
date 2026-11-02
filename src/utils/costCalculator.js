/**
 * Strict Deterministic Cost Calculation Engine
 * 
 * Order of operations:
 * 1. Line Item Subtotal = Quantity * UnitPrice
 * 2. Line Item Discount = Line Subtotal * (DiscountPercent / 100)
 * 3. Net Line Subtotal = Line Subtotal - Line Discount
 * 4. Line Item Tax = Net Line Subtotal * (TaxPercent / 100)
 * 5. Line Total Amount = Net Line Subtotal + Line Tax
 * 6. Product Subtotal = Sum(Line Total Amount for all items)
 * 7. Grand Total = Product Subtotal + DeliveryCharges + AdditionalCharges
 */

export function calculateLineItem(item) {
  const quantity = Math.max(0, Number(item.quantity || item.orderQuantity || 1));
  const unitPrice = Math.max(0, Number(item.unitPrice || 0));
  const discountPercent = Math.min(100, Math.max(0, Number(item.discountPercent || item.discount || 0)));
  const taxPercent = Math.max(0, Number(item.taxPercent || item.taxRate || 0));

  const grossSubtotal = quantity * unitPrice;
  const discountAmount = grossSubtotal * (discountPercent / 100);
  const netSubtotal = grossSubtotal - discountAmount;
  const taxAmount = netSubtotal * (taxPercent / 100);
  const lineTotal = netSubtotal + taxAmount;

  return {
    quantity,
    unitPrice,
    discountPercent,
    discountAmount: Number(discountAmount.toFixed(2)),
    grossSubtotal: Number(grossSubtotal.toFixed(2)),
    netSubtotal: Number(netSubtotal.toFixed(2)),
    taxPercent,
    taxAmount: Number(taxAmount.toFixed(2)),
    lineTotal: Number(lineTotal.toFixed(2))
  };
}

export function calculateQuotationTotals(items = [], deliveryCharges = 0, additionalCharges = 0) {
  const delivery = Math.max(0, Number(deliveryCharges || 0));
  const additional = Math.max(0, Number(additionalCharges || 0));

  let totalGrossSubtotal = 0;
  let totalDiscounts = 0;
  let totalNetSubtotal = 0;
  let totalTax = 0;
  let productSubtotal = 0;

  const processedItems = items.map((item) => {
    const calc = calculateLineItem(item);
    totalGrossSubtotal += calc.grossSubtotal;
    totalDiscounts += calc.discountAmount;
    totalNetSubtotal += calc.netSubtotal;
    totalTax += calc.taxAmount;
    productSubtotal += calc.lineTotal;
    return { ...item, ...calc };
  });

  const grandTotal = productSubtotal + delivery + additional;

  return {
    items: processedItems,
    grossSubtotal: Number(totalGrossSubtotal.toFixed(2)),
    totalDiscount: Number(totalDiscounts.toFixed(2)),
    netSubtotal: Number(totalNetSubtotal.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    productSubtotal: Number(productSubtotal.toFixed(2)),
    deliveryCharges: Number(delivery.toFixed(2)),
    additionalCharges: Number(additional.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2))
  };
}
