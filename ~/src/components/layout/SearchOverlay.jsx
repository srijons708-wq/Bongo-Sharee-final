import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { productsApi } from '../../lib/api';

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  useEffect(() => { let alive = true; if (query.trim().length < 2) { setResults([]); return; } productsApi.list({ search: query.trim() }).then((r) => alive && setResults(r.slice(0, 6))).catch(() => alive && setResults([])); return () => { alive = false; }; }, [query]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  const goToResults = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[95] bg-warmwhite">
      <div className="container-content section-pad pt-8">
        <div className="flex items-center justify-between mb-8">
          <span className="eyebrow">Search</span>
          <button onClick={onClose} aria-label="Close search" className="text-muted hover:text-burgundy">
            <X size={22} />
          </button>
        </div>
        <form onSubmit={goToResults} className="flex items-center gap-3 border-b-2 border-ink pb-4">
          <Search size={22} className="text-burgundy shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, fabrics, categories&hellip;"
            className="w-full bg-transparent font-display text-2xl md:text-3xl outline-none placeholder:text-ink/30"
          />
        </form>

        {query.trim().length >= 2 && (
          <p className="mt-6 text-sm text-muted">
            {results.length ? `Results for "${query}"` : `No results for "${query}"`}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                navigate(`/products/${p.slug}`);
                onClose();
              }}
              className="text-left group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-ink/5">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <p className="mt-2 text-sm text-ink group-hover:text-burgundy transition-colors">{p.name}</p>
              <p className="text-xs text-muted">${p.price}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
