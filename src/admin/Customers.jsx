import { useState } from 'react';
import { X } from 'lucide-react';
import { PageHeader } from '../components/admin/AdminUI.jsx';
import { adminCustomers, adminOrders } from '../data/demo';

export default function AdminCustomers() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <PageHeader eyebrow="People" title="Customers" />

      <div className="border border-ink/10 bg-warmwhite overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-ink/10">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Total Spent</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {adminCustomers.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-ink/[0.02]">
                <td className="px-5 py-3 text-ink font-medium">{c.name}</td>
                <td className="px-5 py-3 text-muted">{c.email}</td>
                <td className="px-5 py-3 text-muted">{c.phone}</td>
                <td className="px-5 py-3 text-ink">{c.orders}</td>
                <td className="px-5 py-3 text-ink">${c.totalSpent}</td>
                <td className="px-5 py-3 text-muted">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[95]">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-warmwhite overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">{selected.name}</h3>
              <button onClick={() => setSelected(null)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm mb-8">
              <p><span className="text-muted">Email:</span> {selected.email}</p>
              <p><span className="text-muted">Phone:</span> {selected.phone}</p>
              <p><span className="text-muted">Joined:</span> {selected.joined}</p>
              <p><span className="text-muted">Lifetime Value:</span> ${selected.totalSpent}</p>
            </div>
            <h4 className="font-display text-lg mb-3">Order History</h4>
            <div className="divide-y divide-ink/10 border-t border-ink/10">
              {adminOrders.filter((o) => o.customer === selected.name).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{o.id}</span>
                  <span className="text-muted">{o.date}</span>
                  <span>${o.amount}</span>
                </div>
              ))}
              {adminOrders.filter((o) => o.customer === selected.name).length === 0 && (
                <p className="text-sm text-muted py-3">No orders on record for this customer yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
