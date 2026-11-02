/**
 * Currency, Number, and Date Formatters
 */

export function formatCurrency(amount, currency = 'USD') {
  const val = Number(amount) || 0;
  
  const currencySymbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£'
  };

  const symbol = currencySymbols[currency] || '$';

  return `${symbol}${val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}
