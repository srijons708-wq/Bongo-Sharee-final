import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send } from 'lucide-react';
import { products } from '../../data/products';

/**
 * Demo-mode assistant: matches the message against simple keyword rules and
 * returns a canned response plus, where relevant, real product results.
 *
 * To connect a real model:
 *   1. Create a Supabase Edge Function (e.g. `ai-assistant`) that holds the
 *      model API key server-side and accepts { message, history }.
 *   2. Replace `getDemoReply()` below with a fetch() to
 *      `${import.meta.env.VITE_AI_ASSISTANT_ENDPOINT}` and stream/await
 *      the response.
 *   3. Nothing else in this component needs to change — messages, the
 *      panel UI, and suggested-product cards all already work off the
 *      same `reply` shape: { text, productIds }.
 */
const SUGGESTIONS = [
  'Find me a red wedding saree',
  'Show sarees under $150',
  'Which saree is best for a wedding?',
  'Track my order',
];

function getDemoReply(message) {
  const q = message.toLowerCase();

  if (q.includes('track') && q.includes('order')) {
    return { text: 'You can track any order from My Account → Orders. Want me to take you there?', link: '/account/orders' };
  }
  if (q.includes('wedding')) {
    const matches = products.filter((p) => p.category === 'wedding' || p.category === 'kanjivaram' || p.category === 'banarasi').slice(0, 3);
    return { text: 'For weddings, brides usually go for a heavier silk with a dense zari border. Here are a few strong picks:', productIds: matches.map((p) => p.id) };
  }
  if (q.includes('red') || q.includes('maroon') || q.includes('crimson')) {
    const matches = products.filter((p) => /maroon|crimson|red/i.test(p.color)).slice(0, 3);
    return { text: matches.length ? 'Here\u2019s what we have in red and maroon tones:' : 'We don\u2019t have a pure red in stock right now, but here are close warm tones:', productIds: matches.length ? matches.map((p) => p.id) : products.slice(0, 3).map((p) => p.id) };
  }
  const priceMatch = q.match(/under\s*\$?(\d+)/);
  if (priceMatch) {
    const limit = Number(priceMatch[1]);
    const matches = products.filter((p) => p.price < limit).slice(0, 4);
    return { text: matches.length ? `Sarees under $${limit}:` : `Nothing under $${limit} right now — our lowest priced piece is $${Math.min(...products.map((p) => p.price))}.`, productIds: matches.map((p) => p.id) };
  }
  if (q.includes('silk')) {
    const matches = products.filter((p) => /silk/i.test(p.fabric)).slice(0, 3);
    return { text: 'Our silk range spans Banarasi, Kanjivaram and Tussar weaves. A few favourites:', productIds: matches.map((p) => p.id) };
  }
  return {
    text: 'I can help you find a saree by occasion, colour, fabric or budget — try one of the suggestions below, or tell me what you\u2019re shopping for.',
  };
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm0', role: 'assistant', text: 'Hi! I\u2019m the Bongo Sharee assistant. Ask me to find a saree by occasion, colour, fabric or budget.' },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: `u${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = getDemoReply(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a${Date.now()}`, role: 'assistant', text: reply.text, productIds: reply.productIds, link: reply.link },
      ]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI Assistant"
        className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 bg-burgundy text-warmwhite px-5 py-3.5 rounded-full shadow-soft hover:bg-burgundy-dark transition-colors"
      >
        <Sparkles size={18} />
        <span className="text-xs tracking-wide font-semibold hidden sm:inline">AI Assistant</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[80] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-warmwhite shadow-soft flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 bg-burgundy text-warmwhite">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="font-display text-base">Saree Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] text-sm px-3.5 py-2.5 rounded-sm ${
                    m.role === 'user' ? 'bg-ink text-warmwhite' : 'bg-ink/5 text-ink'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.link && (
                    <button onClick={() => navigate(m.link)} className="text-burgundy underline text-xs mt-1">
                      Go there
                    </button>
                  )}
                  {m.productIds && (
                    <div className="grid grid-cols-2 gap-2 mt-2.5">
                      {m.productIds.map((id) => {
                        const p = products.find((prod) => prod.id === id);
                        if (!p) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => {
                              navigate(`/products/${p.slug}`);
                              setOpen(false);
                            }}
                            className="text-left"
                          >
                            <div className="aspect-square overflow-hidden bg-ink/10">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[11px] mt-1 line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-muted">${p.price}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] border border-ink/20 rounded-full px-3 py-1.5 hover:border-burgundy hover:text-burgundy"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-ink/10"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a saree&hellip;"
              className="flex-1 bg-ink/5 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-burgundy"
            />
            <button type="submit" aria-label="Send" className="text-burgundy p-2">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
