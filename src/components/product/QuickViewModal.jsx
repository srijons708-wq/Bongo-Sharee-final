import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function QuickViewModal({ open, onClose, product }) {
  const { addItem } = useCart();
  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title={product.name} size="lg">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-[3/4] overflow-hidden bg-ink/5">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">{product.category}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star size={13} className="fill-gold text-gold" />
            <span className="text-xs text-muted">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-semibold text-ink">${product.price}</span>
            {product.comparePrice && <span className="text-muted line-through">${product.comparePrice}</span>}
          </div>
          <p className="text-sm text-muted mt-4 leading-relaxed">{product.description}</p>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={() => {
                addItem(product, 1);
                onClose();
              }}
            >
              Add to Cart
            </Button>
            <Button as={Link} to={`/products/${product.slug}`} variant="outline" onClick={onClose}>
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
