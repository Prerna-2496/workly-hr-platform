import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { authAPI } from '../api';
import { ShieldCheck, Building2, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(email, password);
      login(res.data.token, res.data.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f6fa' }}>

      {/* Left panel — dark brand side */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ background: '#1a1a2e' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: '#FF6B35' }}>W</div>
          <span className="text-base font-medium text-white">Workly</span>
        </div>

        <div>
          <div className="text-2xl font-medium text-white leading-snug mb-4">
            Run payroll, leave, and onboarding<br />from one secure workspace.
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Every account on Workly passes through an explicit
            approval chain — no open registration, ever.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: Lock, label: 'Approval-gated access control' },
            { icon: Building2, label: 'Multi-tenant architecture' },
            { icon: ShieldCheck, label: 'Full audit logging on every action' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,107,53,0.15)' }}>
                <s.icon size={14} style={{ color: '#FF6B35' }} />
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-2xl font-medium mb-1" style={{ color: '#1a1a2e' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: '#888780' }}>
              Sign in to your Workly workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ border: '0.5px solid #d8d8e0', background: '#fff', color: '#1a1a2e' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#d8d8e0'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ border: '0.5px solid #d8d8e0', background: '#fff', color: '#1a1a2e' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#d8d8e0'}
              />
            </div>

            {error && (
              <div className="text-xs px-3 py-2.5 rounded-lg"
                style={{ background: '#fff5f5', color: '#d63031' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity mt-1"
              style={{ background: '#FF6B35', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: '#888780' }}>
            Don't have access yet?{' '}
            <Link to="/request-access" style={{ color: '#FF6B35', fontWeight: 500 }}>
              Request access
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;