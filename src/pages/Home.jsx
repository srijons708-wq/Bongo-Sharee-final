import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Gem, Headset, Gift, ScanEye } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import CategoryCard from '../components/product/CategoryCard.jsx';
import { productsApi, categoriesApi } from '../lib/api';

const trustStats = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '100%', label: 'Quality Assured' },
  { value: '7 Days', label: 'Easy Returns' },
];

const perks = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: ShieldCheck, label: 'Secure Payment' },
  { icon: Gem, label: 'Premium Quality' },
  { icon: Headset, label: '24/7 Support' },
];

const craft = [
  { icon: Gift, title: 'Premium Fabrics', text: 'Sourced directly from mills and handloom cooperatives across Bengal and South India.' },
  { icon: ScanEye, title: 'Authentic Craftsmanship', text: 'Every weave is traceable to the loom and weaver who made it.' },
  { icon: ShieldCheck, title: 'Quality Checked', text: 'Each piece is inspected twice before it leaves our atelier.' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => { Promise.all([productsApi.list({ sort: 'featured' }), categoriesApi.list()]).then(([ps, cs]) => { setProducts(ps); setCategories(cs); }).catch(() => {}); }, []);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const homeCategories = categories.slice(0, 5);

  return (
    <div>
      {/* HERO */}
      <section className="container-content section-pad pt-10 md:pt-16 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="eyebrow">Elegance. Tradition. You.</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] mt-4 text-ink">
            Premium Sarees
            <br />
            For Every Occasion
          </h1>
          <p className="text-muted mt-5 max-w-md leading-relaxed">
            Discover our exclusive collection of premium sarees crafted with love, tradition and the finest quality
            materials.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button as={Link} to="/products" size="lg">
              Shop Collection →
            </Button>
            <Button as={Link} to="/categories" variant="outline" size="lg">
              Explore Categories
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
            {trustStats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl md:text-3xl text-burgundy">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1610030181087-540f829a4c2a?w=1000&q=80"
              alt="Woman wearing a premium maroon and gold Bengali saree in a warm, elegant interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block absolute -bottom-6 -left-6 bg-warmwhite shadow-soft px-6 py-5 max-w-[220px]">
            <p className="font-display text-2xl text-burgundy">15+ Years</p>
            <p className="text-xs text-muted mt-1">Of heritage weaving relationships across Bengal &amp; South India</p>
          </div>
        </div>
      </section>

      {/* PERKS STRIP */}
      <section className="hairline">
        <div className="container-content section-pad py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={22} className="text-burgundy shrink-0" strokeWidth={1.5} />
              <span className="text-xs tracking-wide uppercase text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-content section-pad py-16 md:py-20">
        <div className="text-center mb-10">
          <span className="eyebrow">Browse Collection</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3">Shop By Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {homeCategories.map((c) => (
            <CategoryCard key={c.id} category={c} variant="compact" />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-warmwhite hairline">
        <div className="container-content section-pad py-16 md:py-20">
          <div className="text-center mb-10">
            <span className="eyebrow">Curated For You</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3">Most Loved Sarees</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button as={Link} to="/products" variant="outline">
              View All Sarees
            </Button>
          </div>
        </div>
      </section>

      {/* CRAFT STORY */}
      <section className="container-content section-pad py-16 md:py-20">
        <div className="text-center mb-12">
          <span className="eyebrow">Crafted With Care</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3">Tradition Woven Into Every Thread</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {craft.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-burgundy/5 flex items-center justify-center mx-auto">
                <Icon size={24} className="text-burgundy" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl mt-4">{title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed max-w-xs mx-auto">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-burgundy">
        <div className="container-content section-pad py-14 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-warmwhite">Join the Bongo Sharee Circle</h2>
          <p className="text-warmwhite/70 text-sm mt-2 max-w-md mx-auto">
            New arrivals, weaving stories and early access to festive collections — no spam, unsubscribe anytime.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <Button variant="gold">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
