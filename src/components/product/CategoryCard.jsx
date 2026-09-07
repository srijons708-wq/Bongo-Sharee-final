import { Link } from 'react-router-dom';

export default function CategoryCard({ category, variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <Link to={`/products?category=${category.slug}`} className="group flex flex-col items-center text-center">
        <div className="w-full aspect-square overflow-hidden rounded-full bg-ink/5">
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        </div>
        <span className="mt-3 text-sm text-ink group-hover:text-burgundy transition-colors">{category.name}</span>
      </Link>
    );
  }

  return (
    <Link to={`/products?category=${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden">
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-xl text-warmwhite">{category.name}</h3>
        <p className="text-warmwhite/70 text-xs mt-1 line-clamp-1">{category.description}</p>
      </div>
    </Link>
  );
}
