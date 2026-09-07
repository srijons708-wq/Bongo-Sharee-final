import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';
import { StatCard, PageHeader, StatusBadge } from '../components/admin/AdminUI.jsx';
import { adminOrders, adminCustomers, revenueByMonth, salesByCategory } from '../data/demo';
import { products } from '../data/products';

export default function Dashboard() {
  const totalRevenue = adminOrders.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + o.amount, 0);
  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.revenue));
  const maxCategory = Math.max(...salesByCategory.map((c) => c.value));

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+18% vs last month" />
        <StatCard label="Total Orders" value={adminOrders.length} icon={ShoppingCart} trend="+6 this week" />
        <StatCard label="Total Customers" value={adminCustomers.length} icon={Users} />
        <StatCard label="Total Products" value={products.length} icon={Package} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 border border-ink/10 bg-warmwhite p-6">
          <h3 className="font-display text-lg mb-6">Revenue (Last 6 Months)</h3>
          <div className="flex items-end gap-4 h-48">
            {revenueByMonth.map((r) => (
              <div key={r.month} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-burgundy/85 hover:bg-burgundy transition-colors"
                  style={{ height: `${(r.revenue / maxRevenue) * 100}%` }}
                  title={`$${r.revenue.toLocaleString()}`}
                />
                <span className="text-xs text-muted mt-2">{r.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-ink/10 bg-warmwhite p-6">
          <h3 className="font-display text-lg mb-6">Sales by Category</h3>
          <div className="space-y-4">
            {salesByCategory.map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink">{c.category}</span>
                  <span className="text-muted">{c.value}%</span>
                </div>
                <div className="h-1.5 bg-ink/10">
                  <div className="h-full bg-gold" style={{ width: `${(c.value / maxCategory) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-ink/10 bg-warmwhite">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
            <h3 className="font-display text-lg">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-burgundy hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-ink/10">
            {adminOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between px-6 py-3 text-sm">
                <div>
                  <p className="text-ink font-medium">{o.id}</p>
                  <p className="text-xs text-muted">{o.customer} &middot; {o.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-ink">${o.amount}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-ink/10 bg-warmwhite">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-ink/10">
            <AlertTriangle size={16} className="text-gold" />
            <h3 className="font-display text-lg">Low Stock</h3>
          </div>
          <div className="divide-y divide-ink/10">
            {lowStock.length === 0 && <p className="text-sm text-muted px-6 py-4">All products are well stocked.</p>}
            {lowStock.slice(0, 5).map((p) => (
              <Link key={p.id} to="/admin/products" className="flex items-center justify-between px-6 py-3 text-sm hover:bg-ink/[0.02]">
                <span className="text-ink line-clamp-1">{p.name}</span>
                <span className="text-burgundy font-semibold shrink-0 ml-3">{p.stock} left</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-ink/10 bg-warmwhite mt-6">
        <div className="px-6 py-4 border-b border-ink/10">
          <h3 className="font-display text-lg">Top Products</h3>
        </div>
        <div className="divide-y divide-ink/10">
          {topProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-6 py-3">
              <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover bg-ink/5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink line-clamp-1">{p.name}</p>
                <p className="text-xs text-muted">{p.reviewCount} reviews &middot; {p.rating}★</p>
              </div>
              <span className="text-sm text-ink shrink-0">${p.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
