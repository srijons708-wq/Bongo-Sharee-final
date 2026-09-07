import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/admin/AdminUI.jsx';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

const initialHero = {
  eyebrow: 'Elegance. Tradition. You.',
  title: 'Premium Sarees For Every Occasion',
  description: 'Discover our exclusive collection of premium sarees crafted with love, tradition and the finest quality materials.',
  primaryCta: 'Shop Collection',
  secondaryCta: 'Explore Categories',
  image: 'https://images.unsplash.com/photo-1610030181087-540f829a4c2a?w=1000&q=80',
};

const initialBanners = [
  { id: 'b1', label: 'Homepage Newsletter Banner', message: 'Join the Bongo Sharee Circle — new arrivals & early festive access.', active: true },
  { id: 'b2', label: 'Free Shipping Announcement', message: 'Free Shipping on Orders Over $99', active: true },
];

export default function AdminBanners() {
  const { showToast } = useToast();
  const [hero, setHero] = useState(initialHero);
  const [banners, setBanners] = useState(initialBanners);
  const [newBanner, setNewBanner] = useState({ label: '', message: '' });

  const saveHero = (e) => {
    e.preventDefault();
    // In production: persist to a `site_content` / `homepage_cms` table read by Home.jsx
    showToast('Homepage content updated');
  };

  const addBanner = (e) => {
    e.preventDefault();
    if (!newBanner.label.trim() || !newBanner.message.trim()) return;
    setBanners((prev) => [...prev, { ...newBanner, id: `b${Date.now()}`, active: true }]);
    setNewBanner({ label: '', message: '' });
    showToast('Banner added');
  };

  const toggleBanner = (id) => setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  const removeBanner = (id) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner removed');
  };

  return (
    <div>
      <PageHeader eyebrow="Content" title="Banners &amp; Homepage" />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-ink/10 bg-warmwhite p-6">
          <h3 className="font-display text-lg mb-5">Homepage Hero</h3>
          <form onSubmit={saveHero} className="space-y-4">
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Eyebrow Label</span>
              <input value={hero.eyebrow} onChange={(e) => setHero((h) => ({ ...h, eyebrow: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Hero Title</span>
              <input value={hero.title} onChange={(e) => setHero((h) => ({ ...h, title: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Description</span>
              <textarea rows={3} value={hero.description} onChange={(e) => setHero((h) => ({ ...h, description: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs tracking-wide text-muted mb-1.5 block">Primary CTA Text</span>
                <input value={hero.primaryCta} onChange={(e) => setHero((h) => ({ ...h, primaryCta: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
              </label>
              <label className="block">
                <span className="text-xs tracking-wide text-muted mb-1.5 block">Secondary CTA Text</span>
                <input value={hero.secondaryCta} onChange={(e) => setHero((h) => ({ ...h, secondaryCta: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs tracking-wide text-muted mb-1.5 block">Hero Image URL</span>
              <input value={hero.image} onChange={(e) => setHero((h) => ({ ...h, image: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            </label>
            <Button type="submit">Save Hero Content</Button>
          </form>
        </div>

        <div>
          <div className="border border-ink/10 bg-warmwhite overflow-hidden mb-6">
            <div className="aspect-[16/9] bg-ink/5">
              <img src={hero.image} alt="Hero preview" className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <span className="eyebrow">{hero.eyebrow}</span>
              <h2 className="font-display text-xl mt-1">{hero.title}</h2>
              <p className="text-sm text-muted mt-2 line-clamp-2">{hero.description}</p>
            </div>
          </div>

          <div className="border border-ink/10 bg-warmwhite p-6">
            <h3 className="font-display text-lg mb-4">Promotional Banners</h3>
            <div className="divide-y divide-ink/10 mb-5">
              {banners.map((b) => (
                <div key={b.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{b.label}</p>
                    <p className="text-xs text-muted mt-1">{b.message}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => toggleBanner(b.id)}
                      className={`text-[10px] px-2 py-1 rounded-full ${b.active ? 'bg-green-100 text-green-700' : 'bg-ink/10 text-muted'}`}
                    >
                      {b.active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => removeBanner(b.id)} aria-label="Remove banner" className="text-muted hover:text-burgundy">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={addBanner} className="space-y-3">
              <input placeholder="Banner label" value={newBanner.label} onChange={(e) => setNewBanner((b) => ({ ...b, label: e.target.value }))} className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-burgundy" />
              <input placeholder="Banner message" value={newBanner.message} onChange={(e) => setNewBanner((b) => ({ ...b, message: e.target.value }))} className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-burgundy" />
              <Button type="submit" size="sm" variant="outline"><Plus size={13} /> Add Banner</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
