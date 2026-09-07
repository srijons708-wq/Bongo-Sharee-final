import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/LoadingState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Signup() {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(form);
      showToast('Account created — welcome!');
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-content section-pad py-16 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="eyebrow">Join Us</span>
          <h1 className="font-display text-3xl mt-2">Create Account</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input required placeholder="Full Name" value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          <input type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          <input type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          <input type="password" required placeholder="Confirm Password" value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-burgundy" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? <Spinner /> : 'Create Account'}</Button>
        </form>
        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link to="/login" className="text-burgundy hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
