import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="container-content section-pad py-24 text-center">
      <span className="eyebrow">404</span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-3">Page Not Found</h1>
      <p className="text-muted max-w-sm mx-auto mb-8">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Button as={Link} to="/">Back to Home</Button>
    </div>
  );
}
