import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Heart, Star, Truck, RotateCcw, ShieldCheck, Lock } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import Button from '../components/ui/Button.jsx';
import ProductGallery from '../components/product/ProductGallery.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import ReviewSection from '../components/product/ReviewSection.jsx';
import { productsApi, reviewsApi } from '../lib/api';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const tabs = ['Description', 'Specifications', 'Shipping & Returns', 'Reviews'];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  useEffect(() => {
    let alive = true;
    setLoading(true); setError('');
    productsApi.getBySlug(id).then(async (p) => {
      if (!alive) return;
      if (!p) { setProduct(null); return; }
      setProduct(p);
      const [all, reviews] = await Promise.all([productsApi.list({}), reviewsApi.listForProduct(p.id)]);
      if (alive) { setRelated(all.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4)); setProductReviews(reviews); }
    }).catch((e) => alive && setError(e.message || 'Could not load product.')).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="container-content py-24 text-center text-muted">Loading product…</div>;
  if (error) return <div className="container-content py-24 text-center text-red-600">{error}</div>;
  if (!product) return <Navigate to="/products" replace />;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;
  const specifications = {
    Fabric: product.fabric,
    Color: product.color,
    'Available Sizes': product.sizes.join(', '),
    Category: product.category.replace('-', ' '),
    'In Stock': `${product.stock} units`,
    Care: 'Dry clean recommended',
  };

  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Products', to: '/products' }, { label: product.name }]} />

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <ProductGallery images={product.images} name={product.name} has360={Boolean(product.has360)} />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted">{product.category.replace('-', ' ')}</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.round(product.rating) ? 'fill-gold text-gold' : 'text-ink/15'} />
              ))}
            </div>
            <span className="text-sm text-muted">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="font-display text-3xl text-ink">${product.price}</span>
            {product.comparePrice && (
              <>
                <span className="text-muted line-through text-lg">${product.comparePrice}</span>
                <span className="text-burgundy text-sm font-semibold">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm text-muted mt-5 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-xs tracking-widest2 uppercase text-muted mb-2">Color: {product.color}</p>
            <div className="flex gap-2">
              <span className="w-9 h-9 rounded-full border-2 border-burgundy" style={{ backgroundColor: colorSwatch(product.color) }} />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-ink/20">
              <button
                disabled={product.stock <= 0}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-11 text-lg text-ink hover:text-burgundy"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                disabled={product.stock <= 0}
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-11 text-lg text-ink hover:text-burgundy"
              >
                +
              </button>
            </div>
            <span className="text-xs text-muted">{product.stock} in stock</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button disabled={product.stock <= 0} onClick={() => addItem(product, quantity)} className="flex-1">
              Add to Cart
            </Button>
            <Button disabled={product.stock <= 0} as={Link} to="/checkout" onClick={() => addItem(product, quantity)} variant="gold" className="flex-1">
              Buy Now
            </Button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
              className="w-11 h-11 flex items-center justify-center border border-ink/20 shrink-0 hover:border-burgundy"
            >
              <Heart size={18} className={isWishlisted(product.id) ? 'fill-burgundy text-burgundy' : 'text-ink'} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 hairline pt-6">
            <div className="flex items-center gap-2 text-xs text-muted"><Truck size={16} className="text-burgundy" /> Free Shipping</div>
            <div className="flex items-center gap-2 text-xs text-muted"><RotateCcw size={16} className="text-burgundy" /> 7-Day Easy Returns</div>
            <div className="flex items-center gap-2 text-xs text-muted"><ShieldCheck size={16} className="text-burgundy" /> 100% Authentic</div>
            <div className="flex items-center gap-2 text-xs text-muted"><Lock size={16} className="text-burgundy" /> Secure Payment</div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 hairline overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm whitespace-nowrap border-b-2 -mb-px ${
                activeTab === tab ? 'border-burgundy text-burgundy' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8 max-w-2xl">
          {activeTab === 'Description' && <p className="text-sm text-muted leading-relaxed">{product.description}</p>}
          {activeTab === 'Specifications' && (
            <dl className="divide-y divide-ink/10">
              {Object.entries(specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {activeTab === 'Shipping & Returns' && (
            <ul className="text-sm text-muted space-y-2 leading-relaxed">
              <li>Free standard shipping on orders over $99 — delivered in 5-9 business days.</li>
              <li>Express shipping available at checkout for an additional fee.</li>
              <li>7-day return window from delivery, item must be unworn with tags attached.</li>
              <li>Custom blouse stitching, if selected, is final sale.</li>
            </ul>
          )}
          {activeTab === 'Reviews' && <ReviewSection product={product} reviews={productReviews} />}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <span className="eyebrow">You May Also Like</span>
          <h2 className="font-display text-2xl md:text-3xl mt-2 mb-8">Related Sarees</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function colorSwatch(name) {
  const map = {
    Maroon: '#6E1F32', Ivory: '#F5F0E6', Emerald: '#1F5C4A', 'Sapphire Blue': '#1B3B6F',
    'Antique Gold': '#C58A45', 'Blush Pink': '#E8B7BE', Indigo: '#2C3968', Copper: '#B36A3B',
    'Rani Pink': '#C2185B', 'Sage Green': '#8A9A7E', Teal: '#12554F', 'Off-White': '#F4EFE6',
    Crimson: '#8E1B2B', Charcoal: '#3A3A3C',
  };
  return map[name] || '#6E1F32';
}
