import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { productsApi, categoriesApi } from '../lib/api';
import { Spinner } from '../components/ui/LoadingState.jsx';



export default function Products() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const activeCategory = params.get('category') || '';
  const activeSearch = params.get('search') || '';
  const activeSort = params.get('sort') || 'featured';
  const activeFabric = params.get('fabric') || '';
  const activeColor = params.get('color') || '';
  const activeFilter = params.get('filter') || '';
  const maxPrice = Number(params.get('maxPrice') || 400);
  const inStockOnly = params.get('inStock') === '1';

  useEffect(() => {
    let alive = true;
    setLoading(true); setLoadError('');
    Promise.all([productsApi.list({ category: activeCategory, search: activeSearch, sort: activeSort }), categoriesApi.list()])
      .then(([ps, cs]) => { if (alive) { setProducts(ps); setCategories(cs); } })
      .catch((e) => { if (alive) setLoadError(e.message || 'Could not load products.'); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [activeCategory, activeSearch, activeSort]);

  const fabrics = useMemo(() => [...new Set(products.map((p) => p.fabric).filter(Boolean))], [products]);
  const colors = useMemo(() => [...new Set(products.map((p) => p.color).filter(Boolean))], [products]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activeFilter === 'new') list = list.filter((p) => p.isNew);
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q)
      );
    }
    if (activeFabric) list = list.filter((p) => p.fabric === activeFabric);
    if (activeColor) list = list.filter((p) => p.color === activeColor);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    list = list.filter((p) => p.price <= maxPrice);

    switch (activeSort) {
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [activeCategory, activeSearch, activeSort, activeFabric, activeColor, activeFilter, maxPrice, inStockOnly]);

  const activeCategoryLabel = categories.find((c) => c.slug === activeCategory)?.name;

  const clearFilters = () => setParams(new URLSearchParams());

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <h4 className="text-xs tracking-widest2 uppercase text-muted mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam('category', activeCategory === c.slug ? '' : c.slug)}
              className={`block text-sm ${activeCategory === c.slug ? 'text-burgundy font-semibold' : 'text-ink hover:text-burgundy'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-widest2 uppercase text-muted mb-3">Price — up to ${maxPrice}</h4>
        <input
          type="range"
          min="60"
          max="350"
          step="10"
          value={maxPrice}
          onChange={(e) => setParam('maxPrice', e.target.value)}
          className="w-full accent-burgundy"
        />
      </div>

      <div>
        <h4 className="text-xs tracking-widest2 uppercase text-muted mb-3">Fabric</h4>
        <div className="space-y-2">
          {fabrics.map((f) => (
            <button
              key={f}
              onClick={() => setParam('fabric', activeFabric === f ? '' : f)}
              className={`block text-sm ${activeFabric === f ? 'text-burgundy font-semibold' : 'text-ink hover:text-burgundy'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-widest2 uppercase text-muted mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setParam('color', activeColor === c ? '' : c)}
              className={`text-xs border px-2.5 py-1.5 ${
                activeColor === c ? 'border-burgundy text-burgundy' : 'border-ink/20 text-ink hover:border-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-widest2 uppercase text-muted mb-3">Availability</h4>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setParam('inStock', e.target.checked ? '1' : '')} className="accent-burgundy" />
          In stock only
        </label>
      </div>

      <button onClick={clearFilters} className="text-xs text-burgundy underline">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Products' }]} />
      <div className="mt-4 mb-8">
        <span className="eyebrow">Our Collection</span>
        <h1 className="font-display text-3xl md:text-4xl mt-2">
          {activeCategoryLabel ? activeCategoryLabel : 'Discover Our Sarees'}
        </h1>
        <p className="text-muted text-sm mt-2 max-w-xl">
          {activeSearch
            ? `Search results for "${activeSearch}"`
            : 'Hand-selected weaves from heritage looms across Bengal and South India.'}
        </p>
      </div>

      {loading && <div className="py-20 flex justify-center"><Spinner /></div>}
      {loadError && !loading && <div className="border border-red-200 bg-red-50 text-red-700 p-4 text-sm mb-6">{loadError}</div>}

      {!loading && !loadError && <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm border border-ink/20 px-3 py-2"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <p className="text-sm text-muted hidden lg:block">{filtered.length} sarees</p>
            <select
              value={activeSort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="border border-ink/20 text-sm px-3 py-2 outline-none bg-warmwhite ml-auto"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No sarees match those filters"
              description="Try widening your price range or clearing a filter."
              actionLabel="Clear Filters"
              actionTo="/products"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>}

      {drawerOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-xs bg-warmwhite overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setDrawerOpen(false)}><X size={20} /></button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
