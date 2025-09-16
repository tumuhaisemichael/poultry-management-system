const CURRENCY = "UGX";

export function formatCurrency(amount) {
  return `${CURRENCY} ${amount.toFixed(2)}`;
}
