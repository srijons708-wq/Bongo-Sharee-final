import { Phone } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-burgundy-dark text-warmwhite text-[11px]">
      <div className="container-content section-pad h-9 flex items-center justify-center md:justify-between">
        <p className="tracking-wide">Free Shipping on Orders Over $99</p>
        <div className="hidden md:flex items-center gap-6 tracking-wide">
          <span>Premium Quality</span>
          <span>Easy Returns</span>
          <span>100% Authentic</span>
          <a href="tel:+12125557890" className="flex items-center gap-1.5 hover:text-gold transition-colors">
            <Phone size={12} />
            +1 (212) 555-7890
          </a>
        </div>
      </div>
    </div>
  );
}
