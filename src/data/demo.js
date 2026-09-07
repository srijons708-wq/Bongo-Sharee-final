export const reviews = [
  { id: 'r1', productId: 'p1', author: 'Nusrat J.', rating: 5, title: 'Exactly as pictured', comment: 'The zari work is even denser in person. Wore it for my reception and it held its pleats for 9 hours straight.', date: '2026-07-12', verified: true },
  { id: 'r2', productId: 'p1', author: 'Priyanka D.', rating: 5, title: 'Worth every dollar', comment: 'Heavy but not stiff, and the blouse piece matched perfectly. Shipping to Toronto took 6 days.', date: '2026-06-30', verified: true },
  { id: 'r3', productId: 'p1', author: 'Farhana K.', rating: 4, title: 'Beautiful, slightly long', comment: 'Had to get 2 inches taken in at the fall, otherwise gorgeous.', date: '2026-05-22', verified: true },
  { id: 'r4', productId: 'p3', author: 'Alamin H.', rating: 5, title: 'Perfect for Dhaka summers', comment: 'Bought this for my wife for Pohela Boishakh. Breathes so much better than our usual silk.', date: '2026-04-10', verified: true },
  { id: 'r5', productId: 'p3', author: 'Rummana S.', rating: 4, title: 'Lovely weave', comment: 'Color is slightly more olive than emerald on screen, still beautiful.', date: '2026-03-02', verified: true },
  { id: 'r6', productId: 'p8', author: 'Ishika R.', rating: 5, title: 'Lighter than expected', comment: 'Was worried about the weight for an engagement but it draped beautifully all evening.', date: '2026-02-18', verified: true },
];

export const orders = [
  {
    id: 'BS-100231',
    date: '2026-08-14',
    items: [
      { productId: 'p1', name: 'Maroon Banarasi Bridal Silk', qty: 1, price: 289, image: 'https://images.unsplash.com/photo-1610030181087-540f829a4c2a?w=200&q=80' },
    ],
    total: 289,
    paymentStatus: 'Paid',
    status: 'Shipped',
  },
  {
    id: 'BS-100198',
    date: '2026-07-29',
    items: [
      { productId: 'p3', name: 'Emerald Jamdani Handloom Cotton', qty: 2, price: 89, image: 'https://images.unsplash.com/photo-1610030182693-19a1a3a3a2f9?w=200&q=80' },
      { productId: 'p7', name: 'Indigo Tant Handloom Cotton', qty: 1, price: 76, image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=200&q=80' },
    ],
    total: 254,
    paymentStatus: 'Paid',
    status: 'Delivered',
  },
  {
    id: 'BS-100150',
    date: '2026-06-03',
    items: [
      { productId: 'p6', name: 'Blush Organza Party Wear', qty: 1, price: 112, image: 'https://images.unsplash.com/photo-1610189844202-eb5e83f88f39?w=200&q=80' },
    ],
    total: 112,
    paymentStatus: 'Paid',
    status: 'Cancelled',
  },
];

export const orderTimeline = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export const adminCustomers = [
  { id: 'c1', name: 'Nusrat Jahan', email: 'nusrat.j@example.com', phone: '+1 212 555 0110', orders: 4, totalSpent: 812, joined: '2025-11-02' },
  { id: 'c2', name: 'Priyanka Das', email: 'priyanka.d@example.com', phone: '+1 646 555 0121', orders: 2, totalSpent: 378, joined: '2026-01-19' },
  { id: 'c3', name: 'Alamin Hossain', email: 'alamin.h@example.com', phone: '+880 1711 555001', orders: 6, totalSpent: 1024, joined: '2025-08-27' },
  { id: 'c4', name: 'Ishika Roy', email: 'ishika.r@example.com', phone: '+1 917 555 0133', orders: 1, totalSpent: 198, joined: '2026-03-05' },
  { id: 'c5', name: 'Farhana Karim', email: 'farhana.k@example.com', phone: '+44 7700 900123', orders: 3, totalSpent: 645, joined: '2025-12-14' },
];

export const adminOrders = [
  { id: 'BS-100231', customer: 'Nusrat Jahan', date: '2026-08-14', amount: 289, paymentStatus: 'Paid', status: 'Shipped' },
  { id: 'BS-100230', customer: 'Ishika Roy', date: '2026-08-13', amount: 198, paymentStatus: 'Paid', status: 'Processing' },
  { id: 'BS-100229', customer: 'Farhana Karim', date: '2026-08-11', amount: 156, paymentStatus: 'Paid', status: 'Confirmed' },
  { id: 'BS-100198', customer: 'Priyanka Das', date: '2026-07-29', amount: 254, paymentStatus: 'Paid', status: 'Delivered' },
  { id: 'BS-100150', customer: 'Nusrat Jahan', date: '2026-06-03', amount: 112, paymentStatus: 'Refunded', status: 'Cancelled' },
  { id: 'BS-100122', customer: 'Alamin Hossain', date: '2026-05-20', amount: 421, paymentStatus: 'Paid', status: 'Delivered' },
];

export const coupons = [
  { id: 'co1', code: 'WELCOME10', discountType: 'percentage', discountAmount: 10, minOrder: 50, maxDiscount: 40, expiry: '2026-12-31', usageLimit: 500, used: 214, active: true },
  { id: 'co2', code: 'PUJA25', discountType: 'flat', discountAmount: 25, minOrder: 150, maxDiscount: 25, expiry: '2026-10-15', usageLimit: 200, used: 88, active: true },
  { id: 'co3', code: 'SUMMER50', discountType: 'flat', discountAmount: 50, minOrder: 300, maxDiscount: 50, expiry: '2026-06-30', usageLimit: 100, used: 100, active: false },
];

export const revenueByMonth = [
  { month: 'Mar', revenue: 8200 }, { month: 'Apr', revenue: 9600 }, { month: 'May', revenue: 11400 },
  { month: 'Jun', revenue: 10100 }, { month: 'Jul', revenue: 13800 }, { month: 'Aug', revenue: 15200 },
];

export const salesByCategory = [
  { category: 'Wedding', value: 32 }, { category: 'Silk', value: 24 }, { category: 'Cotton', value: 18 },
  { category: 'Festive', value: 14 }, { category: 'Party', value: 12 },
];
