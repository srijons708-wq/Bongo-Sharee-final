import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/LoadingState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await requestPasswordReset(email); setSent(true); } catch (e) { setError(e.message || 'Could not send reset link.'); } finally { setLoading(false); }
  };

  return (
    <div className="container-content section-pad py-16 flex justify-center">
      <div className="w-full max-w-sm text-center">
        <span className="eyebrow">Account Recovery</span>
        <h1 className="font-display text-3xl mt-2 mb-8">Forgot Password</h1>
        {sent ? (
          <p className="text-sm text-muted">
            If an account exists for <strong className="text-ink">{email}</strong>, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4 text-left">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? <Spinner /> : 'Send Reset Link'}</Button>
          </form>
        )}
        <p className="text-sm text-muted mt-6">
          <Link to="/login" className="text-burgundy hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
