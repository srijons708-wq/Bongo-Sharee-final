import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { wishlistApi } from '../lib/api';
const WishlistContext = createContext(null);
const STORAGE_KEY = 'bongo_wishlist';
export function WishlistProvider({ children }) {
  const { showToast } = useToast(); const { user } = useAuth();
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {} }, [items]);
  useEffect(() => { let alive = true; if (!user) return; wishlistApi.list(user.id).then((server) => { if (alive && server) setItems(server); }).catch(() => {}); return () => { alive = false; }; }, [user]);
  const isWishlisted = (id) => items.some((i) => i.id === id);
  const toggleWishlist = async (product) => {
    const exists = isWishlisted(product.id);
    setItems((prev) => exists ? prev.filter((i) => i.id !== product.id) : [...prev, { id: product.id, name: product.name, image: product.images?.[0] || '', price: product.price, comparePrice: product.comparePrice, slug: product.slug }]);
    try { if (user) exists ? await wishlistApi.remove(user.id, product.id) : await wishlistApi.add(user.id, product.id); showToast(exists ? 'Removed from wishlist' : 'Added to wishlist'); } catch (e) { setItems((prev) => exists ? [...prev, product] : prev.filter((i) => i.id !== product.id)); showToast(e.message || 'Could not update wishlist', 'error'); }
  };
  const removeFromWishlist = async (id) => { setItems((p) => p.filter((i) => i.id !== id)); if (user) { try { await wishlistApi.remove(user.id, id); } catch {} } };
  return <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeFromWishlist, count: items.length }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { const ctx = useContext(WishlistContext); if (!ctx) throw new Error('useWishlist must be used within WishlistProvider'); return ctx; }
