const providers = {
  stripe: { label: 'Card (Stripe)' },
  sslcommerz: { label: 'SSLCommerz (Card / Mobile Banking - BD)' },
  bkash: { label: 'bKash' },
  nagad: { label: 'Nagad' },
  cod: { label: 'Cash on Delivery' },
};

export const paymentService = {
  listProviders: () => Object.entries(providers).map(([id, p]) => ({ id, label: p.label })),
  async charge(providerId, { amountCents, currency, orderId }) {
    if (providerId === 'cod') return { status: 'pending', amountCents, currency, orderId, provider: 'cod', transactionId: null };
    const endpoint = import.meta.env.VITE_PAYMENT_FUNCTION_URL;
    if (!endpoint) throw new Error(`Online payment is not configured yet. Use Cash on Delivery or set VITE_PAYMENT_FUNCTION_URL.`);
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: providerId, amountCents, currency, orderId }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Payment gateway request failed.');
    return data;
  },
};
