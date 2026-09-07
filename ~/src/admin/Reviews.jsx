import { useState } from 'react';
import { Star, Trash2, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/admin/AdminUI.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { reviews as demoReviews } from '../data/demo';
import { getProductById } from '../data/products';

export default function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(demoReviews);

  const remove = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed');
  };

  return (
    <div>
      <PageHeader eyebrow="Moderation" title="Reviews" />

      <div className="border border-ink/10 bg-warmwhite divide-y divide-ink/10">
        {reviews.map((r) => {
          const product = getProductById(r.productId);
          return (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-start gap-4 p-5">
              {product && (
                <img src={product.images[0]} alt={product.name} className="w-14 h-16 object-cover bg-ink/5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? 'fill-gold text-gold' : 'text-ink/15'} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-ink">{r.title}</span>
                  {r.verified && (
                    <span className="flex items-center gap-1 text-[11px] text-burgundy">
                      <ShieldCheck size={11} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">{r.comment}</p>
                <p className="text-xs text-muted mt-2">
                  {r.author} &middot; {r.date} &middot; on <span className="text-ink">{product?.name || 'Unknown product'}</span>
                </p>
              </div>
              <button onClick={() => remove(r.id)} aria-label="Remove review" className="text-muted hover:text-burgundy shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        {reviews.length === 0 && <p className="text-sm text-muted p-8 text-center">No reviews to moderate.</p>}
      </div>
    </div>
  );
}
