const currencySymbol = 'UGX';

export function formatCurrency(amount) {
  return `${currencySymbol}${amount.toFixed(2)}`;
}
