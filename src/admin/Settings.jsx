import { useState } from 'react';
import { PageHeader } from '../components/admin/AdminUI.jsx';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [store, setStore] = useState({
    storeName: 'Bongo Sharee',
    supportEmail: 'support@bongosharee.com',
    supportPhone: '+1 (212) 555-7890',
    freeShippingThreshold: 99,
    standardShippingCost: 12,
    expressShippingCost: 25,
    returnWindowDays: 7,
  });
  const [providers, setProviders] = useState({
    stripe: true,
    sslcommerz: true,
    bkash: true,
    nagad: true,
    cod: false,
  });

  const saveStore = (e) => {
    e.preventDefault();
    showToast('Store settings saved');
  };

  const toggleProvider = (key) => setProviders((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div>
      <PageHeader eyebrow="Configuration" title="Settings" />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-ink/10 bg-warmwhite p-6">
          <h3 className="font-display text-lg mb-5">Store Details</h3>
          <form onSubmit={saveStore} className="space-y-4">
            <Field label="Store Name" value={store.storeName} onChange={(v) => setStore((s) => ({ ...s, storeName: v }))} />
            <Field label="Support Email" type="email" value={store.supportEmail} onChange={(v) => setStore((s) => ({ ...s, supportEmail: v }))} />
            <Field label="Support Phone" value={store.supportPhone} onChange={(v) => setStore((s) => ({ ...s, supportPhone: v }))} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Free Shipping Over ($)" type="number" value={store.freeShippingThreshold} onChange={(v) => setStore((s) => ({ ...s, freeShippingThreshold: v }))} />
              <Field label="Standard Shipping ($)" type="number" value={store.standardShippingCost} onChange={(v) => setStore((s) => ({ ...s, standardShippingCost: v }))} />
              <Field label="Express Shipping ($)" type="number" value={store.expressShippingCost} onChange={(v) => setStore((s) => ({ ...s, expressShippingCost: v }))} />
            </div>
            <Field label="Return Window (days)" type="number" value={store.returnWindowDays} onChange={(v) => setStore((s) => ({ ...s, returnWindowDays: v }))} />
            <Button type="submit">Save Settings</Button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="border border-ink/10 bg-warmwhite p-6">
            <h3 className="font-display text-lg mb-2">Payment Providers</h3>
            <p className="text-xs text-muted mb-5">
              Toggle which providers appear at checkout. Connect credentials in your Supabase Edge Function
              environment — never in this dashboard or the frontend bundle.
            </p>
            <div className="space-y-3">
              {Object.entries({ stripe: 'Stripe (Card)', sslcommerz: 'SSLCommerz', bkash: 'bKash', nagad: 'Nagad', cod: 'Cash on Delivery' }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between border border-ink/10 px-4 py-3">
                  <span className="text-sm text-ink">{label}</span>
                  <input type="checkbox" checked={providers[key]} onChange={() => toggleProvider(key)} className="accent-burgundy" />
                </label>
              ))}
            </div>
          </div>

          <div className="border border-ink/10 bg-warmwhite p-6">
            <h3 className="font-display text-lg mb-2">Environment</h3>
            <p className="text-xs text-muted leading-relaxed">
              This dashboard is running on local demo data because no Supabase project is connected. Add
              <code className="mx-1 px-1.5 py-0.5 bg-ink/5 rounded text-[11px]">VITE_SUPABASE_URL</code>
              and
              <code className="mx-1 px-1.5 py-0.5 bg-ink/5 rounded text-[11px]">VITE_SUPABASE_ANON_KEY</code>
              to your <code className="px-1 bg-ink/5 rounded text-[11px]">.env</code> file (see
              <code className="mx-1 px-1.5 py-0.5 bg-ink/5 rounded text-[11px]">.env.example</code>) and every
              page here starts reading and writing real Postgres data with no code changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide text-muted mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy"
      />
    </label>
  );
}
