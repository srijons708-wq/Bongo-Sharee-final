import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import ProductViewer360 from './ProductViewer360.jsx';

export default function ProductGallery({ images, name, has360 = true }) {
  const [active, setActive] = useState(0);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | '360'

  return (
    <div>
      <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
        {viewMode === '360' ? (
          <ProductViewer360 images={images} name={name} />
        ) : (
          <img src={images[active]} alt={name} className="w-full h-full object-cover" />
        )}

        {has360 && (
          <button
            onClick={() => setViewMode(viewMode === '360' ? 'gallery' : '360')}
            className="absolute top-4 right-4 flex items-center gap-1.5 bg-warmwhite/95 text-ink text-[11px] tracking-widest2 uppercase px-3 py-2 hover:bg-warmwhite"
          >
            <RotateCw size={13} />
            {viewMode === '360' ? 'Photos' : '360° View'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 mt-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              setViewMode('gallery');
            }}
            className={`aspect-square overflow-hidden border-2 transition-colors ${
              active === i && viewMode === 'gallery' ? 'border-burgundy' : 'border-transparent'
            }`}
          >
            <img src={img} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
