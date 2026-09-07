import { supabase, isSupabaseConfigured } from './supabase';
import { products as demoProducts } from '../data/products';
import { categories as demoCategories } from '../data/categories';
import { reviews as demoReviews } from '../data/demo';

const money = (v) => Number(v || 0);

export function normalizeProduct(p) {
  if (!p) return null;
  const category = Array.isArray(p.categories) ? p.categories[0] : p.categories;
  const images = (p.product_images || [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((x) => x.url)
    .filter(Boolean);
  return {
    id: p.id, name: p.name, slug: p.slug, description: p.description || '',
    category: category?.slug || p.category || '', categoryName: category?.name || '',
    fabric: p.fabric || '', color: p.color || '', price: money(p.price),
    comparePrice: p.compare_price == null ? null : money(p.compare_price),
    sku: p.sku || '', stock: Number(p.stock || 0), sizes: p.sizes || ['Free Size'],
    featured: Boolean(p.featured), isNew: Boolean(p.is_new), onSale: Boolean(p.on_sale),
    has360: Boolean(p.has_360), rating: money(p.rating), reviewCount: Number(p.review_count || 0),
    images: images.length ? images : p.image ? [p.image] : [],
  };
}

function normalizeReview(r) {
  return { id: r.id, productId: r.product_id ?? r.productId, rating: Number(r.rating), title: r.title || '', comment: r.comment || '', verified: Boolean(r.verified), date: r.created_at ? r.created_at.slice(0, 10) : (r.date || ''), author: r.profiles?.full_name || r.author || 'Customer' };
}

function normalizeOrder(o) {
  return {
    ...o,
    id: o.id,
    orderNumber: o.order_number || o.id,
    date: o.created_at ? o.created_at.slice(0, 10) : o.date,
    total: money(o.total), subtotal: money(o.subtotal), shipping: money(o.shipping_cost), discount: money(o.discount),
    paymentStatus: o.payment_status || o.paymentStatus || 'Pending',
    status: o.status || 'Pending',
    items: (o.order_items || o.items || []).map((i) => ({ productId: i.product_id, slug: i.products?.slug || i.slug, name: i.product_name || i.name, image: i.product_image || i.image, price: money(i.unit_price ?? i.price), qty: Number(i.quantity ?? i.qty ?? 1) })),
  };
}

export const productsApi = {
  async list({ category, search, sort } = {}) {
    if (!isSupabaseConfigured) {
      let list = [...demoProducts];
      if (category) list = list.filter((p) => p.category === category);
      if (search) { const q = search.toLowerCase(); list = list.filter((p) => `${p.name} ${p.category} ${p.fabric}`.toLowerCase().includes(q)); }
      if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (sort === 'newest') list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      if (sort === 'best-selling') list.sort((a, b) => b.reviewCount - a.reviewCount);
      if (!sort || sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured));
      return list;
    }
    let query = supabase.from('products').select('*, categories(id,name,slug), product_images(*)');
    if (category) {
      const { data: cat, error: catError } = await supabase.from('categories').select('id').eq('slug', category).maybeSingle();
      if (catError) throw catError;
      if (cat) query = query.eq('category_id', cat.id); else return [];
    }
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,fabric.ilike.%${search}%`);
    if (sort === 'price-asc') query = query.order('price', { ascending: true });
    else if (sort === 'price-desc') query = query.order('price', { ascending: false });
    else if (sort === 'newest') query = query.order('created_at', { ascending: false });
    else query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(normalizeProduct);
  },
  async getBySlug(slug) {
    if (!isSupabaseConfigured) return demoProducts.find((p) => p.slug === slug) ?? null;
    const { data, error } = await supabase.from('products').select('*, categories(id,name,slug), product_images(*)').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return normalizeProduct(data);
  },
};

export const adminProductsApi = {
  async save(product, editingId = null) {
    if (!isSupabaseConfigured) return { ...product, id: editingId || `p${Date.now()}` };
    const { data: cat, error: catError } = await supabase.from('categories').select('id').eq('slug', product.category).single();
    if (catError) throw catError;
    const payload = { name: product.name, slug: product.slug, description: product.description, category_id: cat.id, price: Number(product.price), compare_price: product.comparePrice == null ? null : Number(product.comparePrice), sku: product.sku || null, stock: Number(product.stock), fabric: product.fabric, color: product.color, sizes: product.sizes, featured: Boolean(product.featured), is_new: Boolean(product.isNew), on_sale: Boolean(product.onSale) };
    const result = editingId ? await supabase.from('products').update(payload).eq('id', editingId).select('*, categories(id,name,slug), product_images(*)').single() : await supabase.from('products').insert(payload).select('*, categories(id,name,slug), product_images(*)').single();
    if (result.error) throw result.error;
    return normalizeProduct(result.data);
  },
  async remove(id) { if (!isSupabaseConfigured) return; const { error } = await supabase.from('products').delete().eq('id', id); if (error) throw error; },
};

export const categoriesApi = {
  async list() {
    if (!isSupabaseConfigured) return demoCategories;
    const { data, error } = await supabase.from('categories').select('*').eq('status', 'active').order('name');
    if (error) throw error;
    return data || [];
  },
};

export const reviewsApi = {
  async listForProduct(productId) {
    if (!isSupabaseConfigured) return demoReviews.filter((r) => r.productId === productId);
    const { data, error } = await supabase.from('reviews').select('*, profiles(full_name)').eq('product_id', productId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizeReview);
  },
  async submit({ productId, userId, rating, title, comment }) {
    if (!isSupabaseConfigured) return { id: `demo-${Date.now()}`, productId, rating, title, comment, verified: true, author: 'You', date: new Date().toISOString().slice(0, 10) };
    const { data, error } = await supabase.from('reviews').insert({ product_id: productId, user_id: userId, rating, title, comment }).select('*, profiles(full_name)').single();
    if (error) throw error;
    return normalizeReview(data);
  },
};

export const ordersApi = {
  async listForUser(userId) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.from('orders').select('*, order_items(*, products(slug))').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizeOrder);
  },
  async getForUser(orderId, userId) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('orders').select('*, order_items(*, products(slug))').eq('id', orderId).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return normalizeOrder(data);
  },
  async create({ userId, form, items, subtotal, shippingCost, discount = 0, couponCode = null, paymentMethod, paymentStatus = 'Pending', transactionId = null }) {
    if (!userId && isSupabaseConfigured) throw new Error('Please sign in before checkout.');
    if (!isSupabaseConfigured) return { id: `BS-${Math.floor(100000 + Math.random() * 900000)}`, orderNumber: `BS-${Date.now()}`, user_id: userId, full_name: form.fullName, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, postal_code: form.postalCode, country: form.country, shipping_method: form.shippingMethod, payment_method: paymentMethod, payment_status: paymentStatus, subtotal, shipping_cost: shippingCost, discount, total: subtotal + shippingCost - discount, coupon_code: couponCode, status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending', items: items.map((i) => ({ productId: i.id, slug: i.slug, name: i.name, image: i.image, price: i.price, qty: i.quantity })), date: new Date().toISOString().slice(0, 10) };
    const orderPayload = { user_id: userId, full_name: form.fullName, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, postal_code: form.postalCode, country: form.country, shipping_method: form.shippingMethod, payment_method: paymentMethod, payment_status: paymentStatus, payment_transaction_id: transactionId, discount, shipping_cost: shippingCost, coupon_code: couponCode };
    const itemPayload = items.map((i) => ({ product_id: i.id, quantity: i.quantity, product_image: i.image }));
    const { data: orderId, error } = await supabase.rpc('create_order_secure', { p_order: orderPayload, p_items: itemPayload });
    if (error) throw error;
    const { data: order, error: readError } = await supabase.from('orders').select('*, order_items(*, products(slug))').eq('id', orderId).single();
    if (readError) throw readError;
    return normalizeOrder(order);
  }
};

async function getOrCreateWishlist(userId) {
  let { data } = await supabase.from('wishlists').select('id').eq('user_id', userId).maybeSingle();
  if (!data) { const result = await supabase.from('wishlists').insert({ user_id: userId }).select('id').single(); if (result.error) throw result.error; data = result.data; }
  return data.id;
}

export const cartApi = {
  async load(userId) {
    if (!isSupabaseConfigured || !userId) return null;
    let { data: cart, error } = await supabase.from('carts').select('id').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (!cart) { const r = await supabase.from('carts').insert({ user_id: userId }).select('id').single(); if (r.error) throw r.error; cart = r.data; }
    const r = await supabase.from('cart_items').select('product_id, quantity, products(*, categories(id,name,slug), product_images(*))').eq('cart_id', cart.id);
    if (r.error) throw r.error;
    return (r.data || []).map((x) => ({ product: normalizeProduct(x.products), quantity: Number(x.quantity) }));
  },
  async replace(userId, items) {
    if (!isSupabaseConfigured || !userId) return;
    let { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).maybeSingle();
    if (!cart) { const r = await supabase.from('carts').insert({ user_id: userId }).select('id').single(); if (r.error) throw r.error; cart = r.data; }
    const del = await supabase.from('cart_items').delete().eq('cart_id', cart.id); if (del.error) throw del.error;
    if (items.length) { const r = await supabase.from('cart_items').insert(items.map((i) => ({ cart_id: cart.id, product_id: i.id, quantity: i.quantity }))); if (r.error) throw r.error; }
  },
};

export const wishlistApi = {
  async list(userId) {
    if (!isSupabaseConfigured || !userId) return null;
    const { data, error } = await supabase.from('wishlist_items').select('product_id, products(*, categories(id,name,slug), product_images(*))').eq('user_id', userId);
    if (error) throw error;
    return (data || []).map((x) => normalizeProduct(x.products)).filter(Boolean);
  },
  async add(userId, productId) { const wishlistId = await getOrCreateWishlist(userId); const { error } = await supabase.from('wishlist_items').upsert({ wishlist_id: wishlistId, user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' }); if (error) throw error; },
  async remove(userId, productId) { const { error } = await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId); if (error) throw error; },
};

export const addressesApi = {
  async list(userId) { if (!isSupabaseConfigured) return []; const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).order('is_default', { ascending: false }).order('created_at'); if (error) throw error; return data || []; },
  async save(userId, address) { if (!isSupabaseConfigured) return address; const payload = { ...address, user_id: userId }; const { data, error } = address.id ? await supabase.from('addresses').update(payload).eq('id', address.id).select().single() : await supabase.from('addresses').insert(payload).select().single(); if (error) throw error; return data; },
  async remove(userId, id) { if (!isSupabaseConfigured) return; const { error } = await supabase.from('addresses').delete().eq('user_id', userId).eq('id', id); if (error) throw error; },
};

export const couponsApi = {
  async validate(code, subtotal) {
    const normalized = code?.trim().toUpperCase();
    if (!normalized) return null;
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('coupons').select('*').eq('code', normalized).eq('active', true).maybeSingle();
    if (error) throw error;
    if (!data) return { error: 'Invalid or inactive coupon.' };
    if (data.expiry && new Date(data.expiry) < new Date()) return { error: 'This coupon has expired.' };
    if (data.usage_limit != null && data.used_count >= data.usage_limit) return { error: 'This coupon has reached its usage limit.' };
    if (subtotal < money(data.minimum_order)) return { error: `Minimum order of $${money(data.minimum_order).toFixed(2)} required.` };
    return data;
  },
};
