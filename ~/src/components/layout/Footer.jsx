import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Sarees', to: '/products' },
      { label: 'Wedding', to: '/products?category=wedding' },
      { label: 'Silk', to: '/products?category=silk' },
      { label: 'Cotton', to: '/products?category=cotton' },
      { label: 'Party Wear', to: '/products?category=party-wear' },
      { label: 'New Arrivals', to: '/products?filter=new' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Shipping', to: '/contact' },
      { label: 'Returns', to: '/contact' },
      { label: 'FAQ', to: '/contact' },
      { label: 'Size Guide', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Story', to: '/about#story' },
      { label: 'Privacy', to: '/about#privacy' },
      { label: 'Terms', to: '/about#terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-warmwhite/80 mt-24">
      <div className="container-content section-pad py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <span className="font-display text-2xl text-warmwhite">Bongo Sharee</span>
          <p className="mt-4 text-sm text-warmwhite/60 max-w-xs">
            Premium Bengali sarees, hand-selected from weaver cooperatives and heritage looms, delivered worldwide.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="#" aria-label="Facebook" className="hover:text-gold"><Facebook size={18} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-gold"><Instagram size={18} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-gold"><Youtube size={18} /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-warmwhite text-sm font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-warmwhite/60 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-warmwhite text-sm font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-warmwhite/60">
            <li className="flex items-center gap-2"><Phone size={14} /> +1 (212) 555-7890</li>
            <li className="flex items-center gap-2"><Mail size={14} /> support@bongosharee.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Dhaka &amp; New York</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-warmwhite/10">
        <div className="container-content section-pad py-5 text-xs text-warmwhite/40 text-center">
          © 2026 Bongo Sharee. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
