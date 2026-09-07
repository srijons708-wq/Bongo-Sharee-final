import { Link } from 'react-router-dom';
import { Heart, X, ShoppingBag } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { productsApi } from '../lib/api';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <h1 className="font-display text-3xl md:text-4xl mt-4 mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save sarees you love and come back to them anytime."
          actionLabel="Browse Sarees"
          actionTo="/products"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <button
                onClick={() => removeFromWishlist(item.id)}
                aria-label="Remove from wishlist"
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-warmwhite/90 flex items-center justify-center"
              >
                <X size={15} />
              </button>
              <Link to={`/products/${item.slug}`} className="block aspect-[3/4] overflow-hidden bg-ink/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
              </Link>
              <p className="mt-3 text-sm text-ink">{item.name}</p>
              <p className="text-sm font-semibold mt-1">${item.price}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full"
                onClick={() => {
                  productsApi.getBySlug(item.slug).then((full) => full && addItem(full, 1));
                }}
              >
                <ShoppingBag size={14} /> Move to Cart
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
