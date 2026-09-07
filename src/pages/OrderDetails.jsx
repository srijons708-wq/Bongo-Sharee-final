import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { ordersApi } from '../lib/api';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from '../components/ui/LoadingState.jsx';

const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
export default function OrderDetails() {
  const { id } = useParams(); const { user } = useAuth();
  const [order, setOrder] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let alive = true; ordersApi.getForUser(id, user?.id).then((o) => alive && setOrder(o)).catch((e) => alive && setError(e.message || 'Could not load order.')).finally(() => alive && setLoading(false)); return () => { alive = false; }; }, [id, user]);
  if (loading) return <div className="container-content py-24 flex justify-center"><Spinner /></div>;
  if (error) return <div className="container-content py-24 text-center text-red-600">{error}</div>;
  if (!order) return <Navigate to="/account/orders" replace />;
  const current = Math.max(0, steps.indexOf(order.status));
  return <div className="container-content section-pad py-10"><Breadcrumb items={[{ label: 'Orders', to: '/account/orders' }, { label: order.orderNumber || order.id }]} /><div className="mt-5 flex items-center justify-between"><div><h1 className="font-display text-3xl">Order {order.orderNumber || order.id}</h1><p className="text-sm text-muted mt-1">Placed {order.date}</p></div><span className="text-sm font-semibold">{order.status}</span></div><div className="mt-10 border border-ink/10 p-5"><div className="grid grid-cols-5 gap-2">{steps.map((s, i) => <div key={s} className="text-center text-xs"><div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center ${i <= current ? 'bg-burgundy text-warmwhite' : 'bg-ink/10 text-muted'}`}>{i + 1}</div><span className="block mt-2">{s}</span></div>)}</div></div><div className="grid md:grid-cols-3 gap-8 mt-8"><div className="md:col-span-2"><h2 className="font-display text-xl mb-4">Items</h2><div className="border border-ink/10 divide-y divide-ink/10">{order.items.map((item, i) => <div key={`${item.productId}-${i}`} className="flex gap-4 p-4"><Link to={item.slug ? `/products/${item.slug}` : '/products'} className="w-16 h-20 shrink-0 bg-ink/5 overflow-hidden"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></Link><div className="flex-1"><p className="text-sm">{item.name}</p><p className="text-xs text-muted mt-1">Qty {item.qty} × ${item.price.toFixed(2)}</p></div><span className="text-sm font-semibold">${(item.qty * item.price).toFixed(2)}</span></div>)}</div></div><div className="border border-ink/10 p-5 h-fit"><h2 className="font-display text-xl mb-4">Summary</h2><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-muted">Shipping</span><span>${order.shipping.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-muted">Discount</span><span>-${order.discount.toFixed(2)}</span></div><div className="hairline pt-3 flex justify-between font-semibold"><span>Total</span><span>${order.total.toFixed(2)}</span></div><div className="pt-2"><span className="text-muted">Payment:</span> {order.paymentStatus}</div></div></div></div></div>;
}
