import { useEffect, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import Button from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/LoadingState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { paymentService } from '../lib/payment';
import { ordersApi } from '../lib/api';

const initialForm = { fullName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'United States', shippingMethod: 'standard', paymentMethod: 'cod' };

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...initialForm, fullName: user?.user_metadata?.full_name || '', email: user?.email || '' });
  const [coupon, setCoupon] = useState(() => { try { return JSON.parse(localStorage.getItem('bongo_coupon')) || null; } catch { return null; } });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => { setForm((f) => ({ ...f, fullName: f.fullName || user?.user_metadata?.full_name || '', email: f.email || user?.email || '' })); }, [user]);
  const providers = paymentService.listProviders();
  const shippingCost = form.shippingMethod === 'express' ? 25 : subtotal >= 99 ? 0 : 12;
  const discount = coupon ? (coupon.discountType === 'percentage' || coupon.discount_type === 'percentage' ? Math.min(subtotal * Number(coupon.discountAmount ?? coupon.discount_amount) / 100, Number(coupon.maxDiscount ?? coupon.maximum_discount ?? Infinity)) : Math.min(Number(coupon.discountAmount ?? coupon.discount_amount), Number(coupon.maxDiscount ?? coupon.maximum_discount ?? Infinity))) : 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  if (items.length === 0 && !placing) return <Navigate to="/cart" replace />;
  const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country'];
  const validate = () => { const next = {}; requiredFields.forEach((f) => { if (!String(form[f] || '').trim()) next[f] = 'Required'; }); if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'; setErrors(next); return !Object.keys(next).length; };
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validate()) { showToast('Please fill in all required fields', 'error'); return; }
    if (!user && import.meta.env.VITE_SUPABASE_URL) { showToast('Please sign in before placing an order.', 'error'); navigate('/login', { state: { from: '/checkout' } }); return; }
    setPlacing(true);
    try {
      // Demo mode simulates payment; real mode only permits COD until a payment Edge Function is configured.
      const currency = form.country.toLowerCase().includes('bangladesh') ? 'bdt' : 'usd';
      const provisionalId = `pending-${Date.now()}`;
      const charge = await paymentService.charge(form.paymentMethod, { amountCents: Math.round(total * 100), currency, orderId: provisionalId });
      const order = await ordersApi.create({ userId: user?.id || 'demo-user', form, items, subtotal, shippingCost, discount, couponCode: coupon?.code || null, paymentMethod: form.paymentMethod, paymentStatus: charge.status === 'succeeded' ? 'Paid' : 'Pending', transactionId: charge.transactionId || null });
      clearCart(); localStorage.removeItem('bongo_coupon'); setCoupon(null);
      navigate(user ? `/account/orders/${order.id}` : '/login', { state: user ? { justPlacedOrderId: order.id } : undefined, replace: true });
      showToast('Order placed successfully');
    } catch (err) { showToast(err.message || 'Something went wrong placing your order', 'error'); } finally { setPlacing(false); }
  };
  const inputClass = (field) => `w-full border px-3 py-2.5 text-sm outline-none focus:border-burgundy ${errors[field] ? 'border-red-400' : 'border-ink/20'}`;
  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="font-display text-3xl md:text-4xl mt-4 mb-8">Checkout</h1>
      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10">
          <section><h2 className="font-display text-xl mb-4">Customer Information</h2><div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.fullName}><input required className={inputClass('fullName')} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></Field>
            <Field label="Email" error={errors.email}><input required type="email" className={inputClass('email')} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
            <Field label="Phone" error={errors.phone}><input required className={inputClass('phone')} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></Field>
          </div></section>
          <section><h2 className="font-display text-xl mb-4">Shipping Address</h2><div className="grid sm:grid-cols-2 gap-4">
            <Field label="Address" className="sm:col-span-2" error={errors.address}><input required className={inputClass('address')} value={form.address} onChange={(e) => update('address', e.target.value)} /></Field>
            <Field label="City" error={errors.city}><input required className={inputClass('city')} value={form.city} onChange={(e) => update('city', e.target.value)} /></Field>
            <Field label="State / Province" error={errors.state}><input required className={inputClass('state')} value={form.state} onChange={(e) => update('state', e.target.value)} /></Field>
            <Field label="Postal Code" error={errors.postalCode}><input required className={inputClass('postalCode')} value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} /></Field>
            <Field label="Country" error={errors.country}><input required className={inputClass('country')} value={form.country} onChange={(e) => update('country', e.target.value)} /></Field>
          </div></section>
          <section><h2 className="font-display text-xl mb-4">Shipping Method</h2><div className="space-y-3"><RadioRow name="shippingMethod" value="standard" current={form.shippingMethod} onChange={update} label="Standard Shipping (5-9 days)" hint={subtotal >= 99 ? 'Free' : '$12'} /><RadioRow name="shippingMethod" value="express" current={form.shippingMethod} onChange={update} label="Express Shipping (2-4 days)" hint="$25" /></div></section>
          <section><h2 className="font-display text-xl mb-4">Payment Method</h2><div className="space-y-3">{providers.map((p) => <RadioRow key={p.id} name="paymentMethod" value={p.id} current={form.paymentMethod} onChange={update} label={p.label} />)}</div><p className="text-xs text-muted mt-3">Online gateways require server-side credentials. Cash on Delivery works without payment credentials.</p></section>
        </div>
        <div className="bg-warmwhite border border-ink/10 p-6 h-fit sticky top-24"><h3 className="font-display text-xl mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">{items.map((item) => <div key={item.id} className="flex gap-3 text-sm"><img src={item.image} alt={item.name} className="w-12 h-14 object-cover bg-ink/5" /><div className="flex-1"><p className="line-clamp-1">{item.name}</p><p className="text-muted text-xs">Qty {item.quantity}</p></div><span>${(item.price * item.quantity).toFixed(0)}</span></div>)}</div>
          <div className="hairline mt-4 pt-4 space-y-2.5 text-sm"><div className="flex justify-between"><span className="text-muted">Subtotal</span><span>${subtotal.toFixed(0)}</span></div>{discount > 0 && <div className="flex justify-between text-burgundy"><span>Discount</span><span>-${discount.toFixed(0)}</span></div>}<div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span></div><div className="hairline pt-3 flex justify-between font-semibold text-base"><span>Total</span><span>${total.toFixed(0)}</span></div></div>
          <Button type="submit" className="w-full mt-6" disabled={placing}>{placing ? <Spinner /> : 'Place Order'}</Button><p className="text-xs text-muted text-center mt-3">By placing this order you agree to our <Link to="/about" className="underline">Terms</Link>.</p>
        </div>
      </form>
    </div>
  );
}
function Field({ label, error, className = '', children }) { return <label className={`block ${className}`}><span className="text-xs tracking-wide text-muted mb-1.5 block">{label}</span>{children}{error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}</label>; }
function RadioRow({ name, value, current, onChange, label, hint }) { return <label className={`flex items-center justify-between border px-4 py-3 cursor-pointer ${current === value ? 'border-burgundy bg-burgundy/5' : 'border-ink/15'}`}><span className="flex items-center gap-3 text-sm"><input type="radio" name={name} checked={current === value} onChange={() => onChange(name, value)} className="accent-burgundy" />{label}</span>{hint && <span className="text-xs text-muted">{hint}</span>}</label>; }
