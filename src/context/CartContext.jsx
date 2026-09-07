import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useToast } from './ToastContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { cartApi } from '../lib/api';
const CartContext = createContext(null);
const STORAGE_KEY = 'bongo_cart';
export function CartProvider({ children }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const hydratedUser = useRef(null);
  const [items, setItems] = useState(() => { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {} }, [items]);
  useEffect(() => { let alive = true; if (!user) { hydratedUser.current = null; return; } hydratedUser.current = null; cartApi.load(user.id).then((serverItems) => { if (alive) { if (serverItems) setItems(serverItems.map(({ product, quantity }) => ({ id: product.id, name: product.name, image: product.images?.[0] || '', price: product.price, comparePrice: product.comparePrice, slug: product.slug, quantity, stock: product.stock }))); hydratedUser.current = user.id; } }).catch(() => { if (alive) hydratedUser.current = user.id; }); return () => { alive = false; }; }, [user]);
  useEffect(() => { if (user && hydratedUser.current === user.id) cartApi.replace(user.id, items).catch(() => {}); }, [user, items]);
  const addItem = (product, quantity = 1) => {
    const stock = Number(product.stock ?? 999999);
    if (stock <= 0) { showToast('This product is out of stock', 'error'); return false; }
    const safeQty = Math.min(Math.max(1, quantity), stock);
    setItems((prev) => { const existing = prev.find((i) => i.id === product.id); if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: Math.min(stock, i.quantity + safeQty) } : i); return [...prev, { id: product.id, name: product.name, image: product.images?.[0] || '', price: product.price, comparePrice: product.comparePrice, slug: product.slug, quantity: safeQty, stock }]; });
    showToast(`${product.name} added to cart`); return true;
  };
  const removeItem = (id) => { setItems((p) => p.filter((i) => i.id !== id)); showToast('Removed from cart'); };
  const updateQuantity = (id, quantity) => setItems((p) => p.map((i) => i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), Number(i.stock ?? 999999)) } : i));
  const clearCart = () => setItems([]);
  const itemCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + Number(i.price) * i.quantity, 0), [items]);
  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>{children}</CartContext.Provider>;
}
export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error('useCart must be used within CartProvider'); return ctx; }
