import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState.jsx';
import { ordersApi } from '../lib/api';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from '../components/ui/LoadingState.jsx';

const statusStyles = { Pending: 'bg-ink/10 text-ink', Confirmed: 'bg-gold/15 text-gold', Processing: 'bg-gold/15 text-gold', Shipped: 'bg-burgundy/10 text-burgundy', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-600' };
export default function Orders() {
  const { user } = useAuth(); const location = useLocation();
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { if (!user) return; let alive = true; setLoading(true); ordersApi.listForUser(user.id).then((o) => alive && setOrders(o)).catch((e) => alive && setError(e.message || 'Could not load orders.')).finally(() => alive && setLoading(false)); return () => { alive = false; }; }, [user, location.state?.justPlacedOrderId]);
  if (loading) return <div className="py-20 flex justify-center"><Spinner /></div>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!orders.length) return <EmptyState icon={Package} title="No orders yet" description="Your completed orders will appear here." actionLabel="Shop Sarees" actionTo="/products" />;
  return <div><h2 className="font-display text-2xl mb-6">Orders</h2><div className="border border-ink/10 divide-y divide-ink/10">{orders.map((o) => <Link key={o.id} to={`/account/orders/${o.id}`} className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-4 hover:bg-ink/[.02]"><span className="font-semibold text-ink">{o.orderNumber || o.id}</span><span className="text-muted text-sm">{o.date}</span><span className="text-muted text-sm">{o.items.length} item{o.items.length === 1 ? '' : 's'}</span><span className="text-right"><span className="block text-ink font-semibold">${o.total.toFixed(2)}</span><span className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full ${statusStyles[o.status] || 'bg-ink/10 text-ink'}`}>{o.status}</span></span></Link>)}</div></div>;
}
