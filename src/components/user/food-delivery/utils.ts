export function formatTotal(price: string, quantity: number) {
  const amount = parsePrice(price);
  if (amount === 0) return price;

  return formatCurrency(amount * quantity);
}

export function parsePrice(price: string) {
  const amount = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isNaN(amount) ? 0 : amount;
}

export function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}
