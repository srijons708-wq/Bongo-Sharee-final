import { useState } from 'react';
import { PageHeader, StatusBadge } from '../components/admin/AdminUI.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { adminOrders as demoAdminOrders } from '../data/demo';

const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(demoAdminOrders);
  const [filter, setFilter] = useState('All');

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    showToast(`Order ${id} marked as ${status}`);
  };

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <PageHeader eyebrow="Fulfillment" title="Orders" />

      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 border rounded-full ${
              filter === s ? 'border-burgundy text-burgundy bg-burgundy/5' : 'border-ink/20 text-muted hover:border-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="border border-ink/10 bg-warmwhite overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-ink/10">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className="px-5 py-3 text-ink font-medium">{o.id}</td>
                <td className="px-5 py-3 text-muted">{o.customer}</td>
                <td className="px-5 py-3 text-muted">{o.date}</td>
                <td className="px-5 py-3 text-ink">${o.amount}</td>
                <td className="px-5 py-3"><StatusBadge status={o.paymentStatus} /></td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border border-ink/20 text-xs px-2 py-1.5 outline-none focus:border-burgundy bg-warmwhite ml-auto block"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">No orders with this status.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted mt-4">
        Status changes here reflect in the customer&rsquo;s Order Tracking timeline on the storefront.
      </p>
    </div>
  );
}
