import { PageHeader, StatCard } from '../components/admin/AdminUI.jsx';
import { TrendingUp, Percent, RotateCcw, Users } from 'lucide-react';
import { revenueByMonth, salesByCategory, adminOrders, adminCustomers } from '../data/demo';
import { products } from '../data/products';

export default function AdminAnalytics() {
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.revenue));
  const avgOrderValue = (adminOrders.reduce((s, o) => s + o.amount, 0) / adminOrders.length).toFixed(0);
  const cancelledRate = ((adminOrders.filter((o) => o.status === 'Cancelled').length / adminOrders.length) * 100).toFixed(0);
  const repeatCustomers = adminCustomers.filter((c) => c.orders > 1).length;

  const topFabrics = Object.entries(
    products.reduce((acc, p) => {
      acc[p.fabric] = (acc[p.fabric] || 0) + p.reviewCount;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxFabric = Math.max(...topFabrics.map(([, v]) => v));

  return (
    <div>
      <PageHeader eyebrow="Insights" title="Analytics" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Avg. Order Value" value={`$${avgOrderValue}`} icon={TrendingUp} />
        <StatCard label="Cancellation Rate" value={`${cancelledRate}%`} icon={RotateCcw} />
        <StatCard label="Repeat Customers" value={`${repeatCustomers} / ${adminCustomers.length}`} icon={Users} />
        <StatCard label="Avg. Discount Used" value="12%" icon={Percent} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-ink/10 bg-warmwhite p-6">
          <h3 className="font-display text-lg mb-6">Monthly Revenue Trend</h3>
          <div className="flex items-end gap-4 h-56">
            {revenueByMonth.map((r) => (
              <div key={r.month} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[10px] text-muted mb-1">${(r.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full bg-burgundy/85 hover:bg-burgundy transition-colors" style={{ height: `${(r.revenue / maxRevenue) * 100}%` }} />
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
                <div className="h-2 bg-ink/10">
                  <div className="h-full bg-gold" style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 border border-ink/10 bg-warmwhite p-6">
          <h3 className="font-display text-lg mb-6">Most Reviewed Fabrics</h3>
          <div className="space-y-4">
            {topFabrics.map(([fabric, count]) => (
              <div key={fabric}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink">{fabric}</span>
                  <span className="text-muted">{count} reviews</span>
                </div>
                <div className="h-2 bg-ink/10">
                  <div className="h-full bg-burgundy" style={{ width: `${(count / maxFabric) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
