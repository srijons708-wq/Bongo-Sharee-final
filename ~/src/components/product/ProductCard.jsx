import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import QuickViewModal from './QuickViewModal.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <>
      <div className="group">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
          <Link to={`/products/${product.slug}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400"
            />
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-ink text-warmwhite text-[10px] tracking-wide uppercase px-2 py-1">New</span>
            )}
            {product.onSale && discount && (
              <span className="bg-burgundy text-warmwhite text-[10px] tracking-wide uppercase px-2 py-1">
                -{discount}%
              </span>
            )}
          </div>

          <button
            onClick={() => toggleWishlist(product)}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-warmwhite/90 flex items-center justify-center hover:bg-warmwhite"
          >
            <Heart size={16} className={wishlisted ? 'fill-burgundy text-burgundy' : 'text-ink'} />
          </button>

          <button
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-0 left-0 right-0 bg-ink/85 text-warmwhite text-[11px] tracking-widest2 uppercase py-2.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>

        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-wide text-muted">{product.fabric}</p>
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-display text-base text-ink mt-0.5 hover:text-burgundy transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-xs text-muted">{product.rating} ({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-ink font-semibold">${product.price}</span>
            {product.comparePrice && (
              <span className="text-muted text-sm line-through">${product.comparePrice}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product, 1)}
            className="mt-3 w-full border border-ink text-ink text-[11px] tracking-widest2 uppercase py-2.5 hover:bg-ink hover:text-warmwhite transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <QuickViewModal open={quickViewOpen} onClose={() => setQuickViewOpen(false)} product={product} />
    </>
  );
}
