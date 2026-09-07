import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/LoadingState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn({ email: form.email, password: form.password });
      showToast('Welcome back!');
      navigate(location.state?.from || '/account');
    } catch (err) {
      setError(err.message || 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-content section-pad py-16 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="eyebrow">Welcome Back</span>
          <h1 className="font-display text-3xl mt-2">Sign In</h1>
          <p className="text-xs text-muted mt-2">
            Demo tip: use <span className="text-ink">admin@bongosharee.com</span> to preview the admin dashboard.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy"
          />
          <input
            type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy"
          />
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.remember} onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))} className="accent-burgundy" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-burgundy hover:underline">Forgot password?</Link>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? <Spinner /> : 'Sign In'}</Button>
        </form>
        <p className="text-center text-sm text-muted mt-6">
          New to Bongo Sharee? <Link to="/signup" className="text-burgundy hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
