import { Gem, Users, Leaf, ShieldCheck } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';

const values = [
  { icon: Gem, title: 'Premium Craftsmanship', text: 'Every saree is sourced from mills and handloom cooperatives we\u2019ve worked with for over a decade.' },
  { icon: Users, title: 'Weaver-First Sourcing', text: 'We pay weavers directly and above market rate, cutting out the middlemen that hollow out heritage crafts.' },
  { icon: Leaf, title: 'Slow Fashion', text: 'We produce in small batches. No overproduction, no landfill-bound stock.' },
  { icon: ShieldCheck, title: 'Authenticity Guaranteed', text: 'Every silk and handloom piece ships with a certificate of authenticity from its weaving cooperative.' },
];

export default function About() {
  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'About Us' }]} />

      <div id="story" className="max-w-2xl mt-6 scroll-mt-24">
        <span className="eyebrow">Our Story</span>
        <h1 className="font-display text-3xl md:text-4xl mt-2 mb-5">Fifteen Years of Bengal&rsquo;s Looms</h1>
        <p className="text-muted leading-relaxed">
          Bongo Sharee began in 2011 as a single stall in Dhaka&rsquo;s New Market, selling Jamdani and Tangail
          sarees woven by a cooperative of forty families. Today we work with over sixty weaving houses across
          Bengal and South India, and ship worldwide &mdash; but the promise hasn&rsquo;t changed: every saree we
          sell is chosen, inspected and packed by people who understand what a good weave is worth.
        </p>
        <p className="text-muted leading-relaxed mt-4">
          We believe a saree is not fast fashion. It&rsquo;s worn for weddings, handed down, re-worn for decades.
          That&rsquo;s the standard we buy to, and the standard we want you to hold us to.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 mt-16">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-burgundy/5 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-burgundy" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-display text-lg">{title}</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div id="privacy" className="max-w-2xl mt-20 hairline pt-12 scroll-mt-24">
        <span className="eyebrow">Legal</span>
        <h2 className="font-display text-2xl md:text-3xl mt-2 mb-4">Privacy Policy</h2>
        <p className="text-sm text-muted leading-relaxed">
          We collect only what&rsquo;s needed to process your order &mdash; your name, shipping address, email and
          payment confirmation. We never sell customer data to third parties. Payment details are handled entirely
          by our payment processors; Bongo Sharee never stores your card number. You can request a copy or deletion
          of your data at any time by emailing support@bongosharee.com.
        </p>
      </div>

      <div id="terms" className="max-w-2xl mt-14 hairline pt-12 mb-10 scroll-mt-24">
        <span className="eyebrow">Legal</span>
        <h2 className="font-display text-2xl md:text-3xl mt-2 mb-4">Terms of Service</h2>
        <p className="text-sm text-muted leading-relaxed">
          All sales are subject to our 7-day return policy on unworn items with tags attached. Custom blouse
          stitching is final sale. Prices are listed in USD unless otherwise noted at checkout. By placing an
          order you confirm the shipping details provided are accurate; Bongo Sharee is not responsible for
          delays caused by incorrect addresses.
        </p>
      </div>
    </div>
  );
}
