import { useState } from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { reviewsApi } from '../../lib/api';

export default function ReviewSection({ product, reviews }) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [localReviews, setLocalReviews] = useState(reviews);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const [showForm, setShowForm] = useState(false);

  const avg =
    localReviews.length > 0
      ? (localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length).toFixed(1)
      : product.rating;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localReviews.filter((r) => r.rating === star).length,
  }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.comment.trim()) return;
    try {
      const saved = await reviewsApi.submit({ productId: product.id, userId: user?.id, rating: form.rating, title: form.title.trim(), comment: form.comment.trim() });
      setLocalReviews((prev) => [saved, ...prev]);
      setForm({ rating: 5, title: '', comment: '' }); setShowForm(false); showToast('Review submitted — thank you!');
    } catch (e) { showToast(e.message || 'Only verified buyers can review this product.', 'error'); }
  };

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl text-ink">{avg}</span>
            <span className="text-muted">/ 5</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(avg) ? 'fill-gold text-gold' : 'text-ink/15'} />
            ))}
          </div>
          <p className="text-sm text-muted mt-1">Based on {localReviews.length} reviews</p>

          <div className="mt-5 space-y-1.5">
            {breakdown.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-muted">
                <span className="w-8">{star}★</span>
                <div className="flex-1 h-1.5 bg-ink/10">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${localReviews.length ? (count / localReviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-6 text-right">{count}</span>
              </div>
            ))}
          </div>

          {isAuthenticated ? (
            <Button variant="outline" className="mt-6" onClick={() => setShowForm((s) => !s)}>
              Write a Review
            </Button>
          ) : (
            <p className="text-xs text-muted mt-6">Only customers who purchased this saree can leave a verified review.</p>
          )}

          {showForm && (
            <form onSubmit={submit} className="mt-5 space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button type="button" key={i} onClick={() => setForm((f) => ({ ...f, rating: i + 1 }))}>
                    <Star size={20} className={i < form.rating ? 'fill-gold text-gold' : 'text-ink/20'} />
                  </button>
                ))}
              </div>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Review title"
                className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-burgundy"
              />
              <textarea
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Share details about the fabric, fit and quality&hellip;"
                rows={3}
                className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-burgundy"
              />
              <Button size="sm" type="submit">Submit Review</Button>
            </form>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          {localReviews.length === 0 && <p className="text-sm text-muted">No reviews yet for this saree.</p>}
          {localReviews.map((r) => (
            <div key={r.id} className="hairline pt-5 first:pt-0 first:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? 'fill-gold text-gold' : 'text-ink/15'} />
                  ))}
                </div>
                <span className="text-xs text-muted">{r.date}</span>
              </div>
              <p className="font-semibold text-sm text-ink mt-2">{r.title}</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">{r.comment}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted">
                <span>{r.author}</span>
                {r.verified && (
                  <span className="flex items-center gap-1 text-burgundy">
                    <ShieldCheck size={12} /> Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
