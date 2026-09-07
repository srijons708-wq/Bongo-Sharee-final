import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { ordersApi } from '../lib/api';

const navItems = [
  { to: '/account', label: 'Dashboard', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/settings', label: 'Settings', icon: Settings },
];

export default function Account() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const { count: wishCount } = useWishlist();
  const location = useLocation();

  const isDashboardRoot = location.pathname === '/account';
  useEffect(() => { ordersApi.listForUser(user.id).then(setOrders).catch(() => {}); }, [user]);
  const pendingOrders = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const totalSpent = orders.reduce((sum, o) => (o.status === 'Cancelled' ? sum : sum + o.total), 0);

  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'My Account' }]} />
      <h1 className="font-display text-3xl md:text-4xl mt-4 mb-8">
        Welcome back, {user?.user_metadata?.full_name || 'Guest'}
      </h1>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <aside>
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 text-sm ${
                    isActive ? 'text-burgundy bg-burgundy/5' : 'text-ink hover:text-burgundy'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <button onClick={signOut} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink hover:text-burgundy">
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        <div>
          {isDashboardRoot ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Orders" value={orders.length} />
              <StatCard label="Pending Orders" value={pendingOrders} />
              <StatCard label="Wishlist Items" value={wishCount} />
              <StatCard label="Total Spent" value={`$${totalSpent}`} />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-ink/10 p-5">
      <p className="font-display text-3xl text-burgundy">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
