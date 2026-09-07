import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Heart } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { productsApi } from '../lib/api';
import { coupons } from '../data/demo';
import { couponsApi } from '../lib/api';
import { useToast } from '../context/ToastContext.jsx';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(() => { try { return JSON.parse(localStorage.getItem('bongo_coupon')) || null; } catch { return null; } });
  useEffect(() => { if (appliedCoupon) localStorage.setItem('bongo_coupon', JSON.stringify(appliedCoupon)); else localStorage.removeItem('bongo_coupon'); }, [appliedCoupon]);

  const shipping = subtotal === 0 || subtotal >= 99 ? 0 : 12;
  const discount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage' || appliedCoupon.discount_type === 'percentage'
      ? Math.min((subtotal * Number(appliedCoupon.discountAmount ?? appliedCoupon.discount_amount)) / 100, Number(appliedCoupon.maxDiscount ?? appliedCoupon.maximum_discount ?? Infinity))
      : Math.min(Number(appliedCoupon.discountAmount ?? appliedCoupon.discount_amount), Number(appliedCoupon.maxDiscount ?? appliedCoupon.maximum_discount ?? Infinity))
    : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = async (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    try {
      const live = await couponsApi.validate(code, subtotal);
      if (live?.error) { showToast(live.error, 'error'); return; }
      const match = live || coupons.find((c) => c.code === code && c.active);
      if (!match) { showToast('Invalid or expired coupon', 'error'); return; }
      const minimum = Number(match.minimum_order ?? match.minOrder ?? 0);
      if (subtotal < minimum) { showToast(`Minimum order of $${minimum} required for ${code}`, 'error'); return; }
      setAppliedCoupon(match); showToast(`Coupon ${code} applied`);
    } catch (err) { showToast(err.message || 'Could not validate coupon', 'error'); }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponInput(''); showToast('Coupon removed'); };

  if (items.length === 0) {
    return (
      <div className="container-content section-pad py-10">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Sarees you add to your cart will show up here."
          actionLabel="Continue Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <h1 className="font-display text-3xl md:text-4xl mt-4 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="divide-y divide-ink/10">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-5 first:pt-0">
              <Link to={`/products/${item.slug}`} className="w-24 h-28 shrink-0 overflow-hidden bg-ink/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/products/${item.slug}`} className="font-display text-lg text-ink hover:text-burgundy line-clamp-1">
                    {item.name}
                  </Link>
                  <span className="font-semibold text-ink shrink-0">${(item.price * item.quantity).toFixed(0)}</span>
                </div>
                <p className="text-sm text-muted mt-1">${item.price} each</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-ink/20">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 text-ink hover:text-burgundy">−</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 text-ink hover:text-burgundy">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        productsApi.getBySlug(item.slug).then((full) => full && toggleWishlist(full));
                        removeItem(item.id);
                      }}
                      aria-label="Move to wishlist"
                      className="text-muted hover:text-burgundy"
                    >
                      <Heart size={17} />
                    </button>
                    <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-muted hover:text-burgundy">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-6">
            <Button as={Link} to="/products" variant="outline">
              Continue Shopping
            </Button>
          </div>
        </div>

        <div className="bg-warmwhite border border-ink/10 p-6 h-fit">
          <h3 className="font-display text-xl mb-4">Order Summary</h3>
          <form onSubmit={applyCoupon} className="flex gap-2 mb-5">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border border-ink/20 px-3 py-2 text-sm outline-none focus:border-burgundy"
            />
            <Button type="submit" size="sm" variant="outline">Apply</Button>
          </form>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>${subtotal.toFixed(0)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-burgundy">
                <span>Discount ({appliedCoupon.code}) <button type="button" onClick={removeCoupon} className="underline ml-1">remove</button></span><span>-${discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="hairline pt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span>${total.toFixed(0)}</span>
            </div>
          </div>

          <Button as={Link} to="/checkout" className="w-full mt-6">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
