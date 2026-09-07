// Demo category data — replace with Supabase `categories` table data in production.
// Image URLs point to Unsplash source queries as easy-to-replace placeholders.

export const categories = [
  {
    id: 'wedding',
    slug: 'wedding',
    name: 'Wedding Sarees',
    description: 'Opulent weaves for the most important day.',
    image: 'https://images.unsplash.com/photo-1610030181087-540f5b32c235?w=800&q=80',
  },
  {
    id: 'party-wear',
    slug: 'party-wear',
    name: 'Party Wear Sarees',
    description: 'Statement pieces for evenings to remember.',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
  },
  {
    id: 'cotton',
    slug: 'cotton',
    name: 'Cotton Sarees',
    description: 'Breathable handwoven cotton for every day.',
    image: 'https://images.unsplash.com/photo-1610189020217-5f1e3b6b1a6a?w=800&q=80',
  },
  {
    id: 'silk',
    slug: 'silk',
    name: 'Silk Sarees',
    description: 'Lustrous pure silk, woven by master artisans.',
    image: 'https://images.unsplash.com/photo-1610189844305-91b2b5f8f4d0?w=800&q=80',
  },
  {
    id: 'new-arrivals',
    slug: 'new-arrivals',
    name: 'New Arrivals',
    description: 'The newest additions to the collection.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
  },
  {
    id: 'banarasi',
    slug: 'banarasi',
    name: 'Banarasi',
    description: 'Timeless zari work from Varanasi.',
    image: 'https://images.unsplash.com/photo-1610030181087-540f5b32c235?w=800&q=80',
  },
  {
    id: 'kanjivaram',
    slug: 'kanjivaram',
    name: 'Kanjivaram',
    description: 'Rich South Indian silk with temple borders.',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
  },
  {
    id: 'handloom',
    slug: 'handloom',
    name: 'Handloom',
    description: 'Slow-woven textiles from Bengal\u2019s looms.',
    image: 'https://images.unsplash.com/photo-1610189020217-5f1e3b6b1a6a?w=800&q=80',
  },
  {
    id: 'festive',
    slug: 'festive',
    name: 'Festive',
    description: 'Bright, celebratory drapes for the festival season.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
  },
]

export const getCategoryBySlug = (slug) => categories.find((c) => c.slug === slug)
