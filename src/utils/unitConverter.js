/**
 * Reusable Unit Conversion & Price Normalisation Utility
 * 
 * Complies with SupplierQuoteCompare Master Specification (Section 8):
 * - Dimension compatibility validation (Weight vs Volume vs Count)
 * - Safe calculation preventing division by zero
 * - Canonical base unit conversion
 */

export const UNIT_DIMENSIONS = {
  // Mass
  kg: { dimension: 'mass', baseUnit: 'kg', factorToBase: 1.0, label: 'Kilogram (kg)' },
  g: { dimension: 'mass', baseUnit: 'kg', factorToBase: 0.001, label: 'Gram (g)' },
  grams: { dimension: 'mass', baseUnit: 'kg', factorToBase: 0.001, label: 'Gram (g)' },
  ton: { dimension: 'mass', baseUnit: 'kg', factorToBase: 1000.0, label: 'Metric Ton (t)' },

  // Volume
  l: { dimension: 'volume', baseUnit: 'L', factorToBase: 1.0, label: 'Litre (L)' },
  litre: { dimension: 'volume', baseUnit: 'L', factorToBase: 1.0, label: 'Litre (L)' },
  litres: { dimension: 'volume', baseUnit: 'L', factorToBase: 1.0, label: 'Litre (L)' },
  ml: { dimension: 'volume', baseUnit: 'L', factorToBase: 0.001, label: 'Millilitre (ml)' },

  // Discrete Count
  pcs: { dimension: 'count', baseUnit: 'pcs', factorToBase: 1.0, label: 'Pieces (pcs)' },
  piece: { dimension: 'count', baseUnit: 'pcs', factorToBase: 1.0, label: 'Pieces (pcs)' },
  units: { dimension: 'count', baseUnit: 'pcs', factorToBase: 1.0, label: 'Units' },
  unit: { dimension: 'count', baseUnit: 'pcs', factorToBase: 1.0, label: 'Units' },
  box: { dimension: 'count', baseUnit: 'box', factorToBase: 1.0, label: 'Box' },
  carton: { dimension: 'count', baseUnit: 'carton', factorToBase: 1.0, label: 'Carton' }
};

/**
 * Returns the dimension for a given measurement unit
 */
export function getUnitDimension(unitString) {
  if (!unitString) return null;
  const clean = unitString.toString().trim().toLowerCase();
  return UNIT_DIMENSIONS[clean] || null;
}

/**
 * Checks whether two measurement units can be compared against each other
 */
export function areUnitsCompatible(unitA, unitB) {
  const dimA = getUnitDimension(unitA);
  const dimB = getUnitDimension(unitB);
  if (!dimA || !dimB) return false;
  return dimA.dimension === dimB.dimension;
}

/**
 * Normalises a price based on package size and measurement unit to canonical base unit.
 * 
 * Formula:
 * Normalized Quantity = packageSize * factorToBase
 * Normalized Unit Price = price / Normalized Quantity
 * 
 * Example:
 * Package size = 500, unit = 'g', price = 250
 * factorToBase = 0.001
 * Normalized Quantity = 500 * 0.001 = 0.5 kg
 * Normalized Unit Price = 250 / 0.5 = 500 per kg
 */
export function normalizeUnitPrice(unitPrice, packageSize = 1, unit = 'pcs') {
  const price = Number(unitPrice);
  const size = Number(packageSize);

  if (isNaN(price) || price < 0) {
    return {
      success: false,
      error: 'Invalid unit price value',
      normalizedPrice: 0,
      baseUnit: unit
    };
  }

  if (isNaN(size) || size <= 0) {
    return {
      success: false,
      error: 'Package size must be greater than zero to avoid division by zero',
      normalizedPrice: price,
      baseUnit: unit
    };
  }

  const unitMeta = getUnitDimension(unit);
  if (!unitMeta) {
    // If unit is unknown, return raw price with unit as fallback
    return {
      success: true,
      normalizedPrice: price / size,
      baseUnit: unit,
      dimension: 'custom',
      rawUnit: unit
    };
  }

  const normalizedQuantityInBase = size * unitMeta.factorToBase;
  if (normalizedQuantityInBase <= 0) {
    return {
      success: false,
      error: 'Calculated base quantity is zero',
      normalizedPrice: price,
      baseUnit: unitMeta.baseUnit
    };
  }

  const normalizedPrice = price / normalizedQuantityInBase;

  return {
    success: true,
    normalizedPrice: Number(normalizedPrice.toFixed(4)),
    baseUnit: unitMeta.baseUnit,
    dimension: unitMeta.dimension,
    rawUnit: unit,
    factorUsed: unitMeta.factorToBase
  };
}
