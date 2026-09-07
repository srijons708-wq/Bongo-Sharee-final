export function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="border border-ink/10 bg-warmwhite p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        {Icon && <Icon size={16} className="text-burgundy" strokeWidth={1.5} />}
      </div>
      <p className="font-display text-3xl text-ink mt-2">{value}</p>
      {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="font-display text-2xl md:text-3xl mt-1">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-ink/10 text-ink',
    Confirmed: 'bg-gold/15 text-gold',
    Processing: 'bg-gold/15 text-gold',
    Shipped: 'bg-burgundy/10 text-burgundy',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
    Paid: 'bg-green-100 text-green-700',
    Refunded: 'bg-red-100 text-red-600',
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-ink/10 text-muted',
  };
  return <span className={`inline-block text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status] || 'bg-ink/10 text-ink'}`}>{status}</span>;
}
