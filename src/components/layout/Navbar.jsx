import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import SearchOverlay from './SearchOverlay.jsx';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/products?filter=new', label: 'New Arrivals' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [isAuthenticated]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-warmwhite/95 backdrop-blur border-b border-ink/10">
        <div className="container-content section-pad h-20 flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none shrink-0">
            <span className="font-display text-2xl md:text-3xl text-burgundy">Bongo Sharee</span>
            <span className="text-[9px] tracking-widest2 text-muted mt-1">Premium Saree Collection</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `text-[13px] tracking-wide pb-1 border-b transition-colors ${
                    isActive ? 'text-burgundy border-burgundy' : 'text-ink border-transparent hover:text-burgundy'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="text-ink hover:text-burgundy">
              <Search size={20} />
            </button>
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              aria-label="Account"
              className="hidden sm:inline-block text-ink hover:text-burgundy"
            >
              <User size={20} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative text-ink hover:text-burgundy">
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-warmwhite text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative text-ink hover:text-burgundy">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-warmwhite text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-ink hover:text-burgundy"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[96] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-xs bg-warmwhite shadow-soft flex flex-col">
            <div className="flex items-center justify-between h-20 px-6 border-b border-ink/10">
              <span className="font-display text-xl text-burgundy">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm tracking-wide ${isActive ? 'text-burgundy' : 'text-ink'}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="hairline pt-5 mt-2">
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-ink"
                >
                  {isAuthenticated ? 'My Account' : 'Sign In'}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
