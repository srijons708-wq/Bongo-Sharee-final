import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping is 5-9 business days worldwide. Express shipping (2-4 days) is available at checkout.' },
  { q: 'What is your return policy?', a: 'Unworn items with tags attached can be returned within 7 days of delivery. Custom blouse stitching is final sale.' },
  { q: 'Do you offer a size guide?', a: 'Most sarees are free-size (5.5-6.5m) with an unstitched blouse piece. Blouse stitching to your measurements is available at checkout.' },
];

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast('Message sent — we\u2019ll reply within 24 hours');
  };

  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <div className="max-w-xl mt-4 mb-12">
        <span className="eyebrow">Get In Touch</span>
        <h1 className="font-display text-3xl md:text-4xl mt-2">We&rsquo;re Here to Help</h1>
        <p className="text-muted text-sm mt-2">
          Questions about an order, a fabric, or a size? Reach us any of the ways below.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <Phone size={18} className="text-burgundy mt-0.5" />
            <div>
              <p className="text-sm text-ink font-semibold">Phone</p>
              <a href="tel:+12125557890" className="text-sm text-muted hover:text-burgundy">+1 (212) 555-7890</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail size={18} className="text-burgundy mt-0.5" />
            <div>
              <p className="text-sm text-ink font-semibold">Email</p>
              <a href="mailto:support@bongosharee.com" className="text-sm text-muted hover:text-burgundy">support@bongosharee.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin size={18} className="text-burgundy mt-0.5" />
            <div>
              <p className="text-sm text-ink font-semibold">Studios</p>
              <p className="text-sm text-muted">Dhaka, Bangladesh &amp; New York, USA</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock size={18} className="text-burgundy mt-0.5" />
            <div>
              <p className="text-sm text-ink font-semibold">Support Hours</p>
              <p className="text-sm text-muted">Sun&ndash;Fri, 9am&ndash;6pm (GMT+6)</p>
            </div>
          </div>

          <div className="hairline pt-8">
            <h3 className="font-display text-lg mb-4">Frequently Asked</h3>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <p className="text-sm font-semibold text-ink">{f.q}</p>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-warmwhite border border-ink/10 p-6 md:p-8 h-fit">
          {sent ? (
            <div className="text-center py-10">
              <h3 className="font-display text-2xl mb-2">Message Sent</h3>
              <p className="text-sm text-muted">We&rsquo;ll get back to you at {form.email} within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
              </div>
              <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
              <textarea required rows={6} placeholder="How can we help?" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
