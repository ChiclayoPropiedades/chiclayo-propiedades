export function formatPrice(price: number, currency: 'PEN' | 'USD'): string {
  const symbol = currency === 'PEN' ? 'S/' : '$';
  return `${symbol} ${new Intl.NumberFormat('es-PE').format(price)}`;
}
