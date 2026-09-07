import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Star,
  Ticket, Image, BarChart3, Settings, ArrowLeft, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <>
      <Link to="/" className="flex flex-col leading-none px-6 py-6 border-b border-warmwhite/10">
        <span className="font-display text-xl text-warmwhite">Bongo Sharee</span>
        <span className="text-[10px] tracking-widest2 text-warmwhite/50 mt-1">Admin Console</span>
      </Link>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                isActive ? 'text-warmwhite bg-warmwhite/10 border-r-2 border-gold' : 'text-warmwhite/60 hover:text-warmwhite hover:bg-warmwhite/5'
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <Link to="/" className="flex items-center gap-2 px-6 py-5 text-sm text-warmwhite/60 hover:text-warmwhite border-t border-warmwhite/10">
        <ArrowLeft size={15} /> Back to Store
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="hidden lg:flex flex-col w-64 bg-ink shrink-0 sticky top-0 h-screen">{SidebarContent}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[96] lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ink flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close admin menu"
              className="absolute top-6 right-4 text-warmwhite/60 hover:text-warmwhite"
            >
              <X size={20} />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-5 h-16 border-b border-ink/10 bg-warmwhite sticky top-0 z-40">
          <span className="font-display text-lg text-burgundy">Admin</span>
          <button onClick={() => setMobileOpen(true)} aria-label="Open admin menu"><Menu size={22} /></button>
        </div>
        <main className="p-5 md:p-10 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
