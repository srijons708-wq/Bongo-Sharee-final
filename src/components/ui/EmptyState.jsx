import Button from './Button.jsx';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center text-center py-24 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-burgundy/5 flex items-center justify-center mb-5">
          <Icon size={28} className="text-burgundy" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-display text-2xl text-ink mb-2">{title}</h3>
      {description && <p className="text-muted max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Button as={Link} to={actionTo} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
