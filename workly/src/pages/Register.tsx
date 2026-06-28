import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'HR_ADMIN',
    tenantId: 1,
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.requestAccess({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        tenantId: form.tenantId,
        companyName: form.companyName,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ background: '#f5f6fa' }}>
        <div className="max-w-sm text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: '#EAF3DE' }}>
            <CheckCircle2 size={26} style={{ color: '#3B6D11' }} />
          </div>
          <h1 className="text-xl font-medium mb-2" style={{ color: '#1a1a2e' }}>
            Request submitted
          </h1>
          <p className="text-sm mb-6" style={{ color: '#888780', lineHeight: 1.6 }}>
            Your access request has been sent to the Super Admin.
            You'll receive an email once it's reviewed.
          </p>
          <button onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: '#FF6B35' }}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f6fa' }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ background: '#1a1a2e' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: '#FF6B35' }}>W</div>
          <span className="text-base font-medium text-white">Workly</span>
        </div>

        <div>
          <div className="text-2xl font-medium text-white leading-snug mb-4">
            Request access to<br />your HR workspace.
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Submit your details below. A Super Admin or HR Admin
            will review and approve your account before you can sign in.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            'Multi-tenant architecture',
            'Real Indian payroll computation',
            'Role-based access control',
            '2-step leave approval workflow',
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,107,53,0.2)' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#FF6B35" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: step >= s ? '#FF6B35' : '#f1efe8',
                    color: step >= s ? '#fff' : '#888780'
                  }}>{s}</div>
                {s < 2 && (
                  <div className="w-8 h-px"
                    style={{ background: step > s ? '#FF6B35' : '#e8e6e0' }} />
                )}
              </div>
            ))}
            <span className="text-xs ml-2" style={{ color: '#888780' }}>
              {step === 1 ? 'Account details' : 'Workspace details'}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-medium mb-1" style={{ color: '#1a1a2e' }}>
              {step === 1 ? 'Request access' : 'Workspace setup'}
            </h1>
            <p className="text-sm" style={{ color: '#888780' }}>
              {step === 1
                ? 'Enter your details — approval is required before login'
                : 'Tell us about your role and company'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="flex flex-col gap-4">
              {[
                { label: 'Full name', key: 'name', type: 'text', placeholder: 'Enter your full name' },
                { label: 'Work email', key: 'email', type: 'email', placeholder: 'Enter your work email' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                { label: 'Confirm password', key: 'confirmPassword', type: 'password', placeholder: '••••••••' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ border: '0.5px solid #d8d8e0', background: '#fff', color: '#1a1a2e' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B35'}
                    onBlur={e => e.target.style.borderColor = '#d8d8e0'}
                  />
                </div>
              ))}

              {error && (
                <div className="text-xs px-3 py-2.5 rounded-lg" style={{ background: '#fff5f5', color: '#d63031' }}>
                  {error}
                </div>
              )}

              <button type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ background: '#FF6B35' }}>
                Continue
              </button>

              <p className="text-center text-xs" style={{ color: '#888780' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#FF6B35', fontWeight: 500 }}>Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>Company name</label>
                <input
                  type="text"
                  placeholder="Enter the name of your company"
                  value={form.companyName}
                  onChange={e => setForm({ ...form, companyName: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ border: '0.5px solid #d8d8e0', background: '#fff', color: '#1a1a2e' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B35'}
                  onBlur={e => e.target.style.borderColor = '#d8d8e0'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>Tenant ID</label>
                <input
                  type="number"
                  placeholder="Enter a unique number for your company"
                  value={form.tenantId}
                  onChange={e => setForm({ ...form, tenantId: parseInt(e.target.value) })}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ border: '0.5px solid #d8d8e0', background: '#fff', color: '#1a1a2e' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B35'}
                  onBlur={e => e.target.style.borderColor = '#d8d8e0'}
                />
                <p className="text-xs mt-1" style={{ color: '#888780' }}>
                    This is a unique identifier for your company. It can be any number, but must be unique across all companies.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>Requested role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ border: '0.5px solid #d8d8e0', background: '#fff', color: '#1a1a2e' }}>
                  <option value="HR_ADMIN">HR Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
                <p className="text-xs mt-1" style={{ color: '#888780' }}>
                  A Super Admin or HR Admin will approve this request
                </p>
              </div>

              {error && (
                <div className="text-xs px-3 py-2.5 rounded-lg" style={{ background: '#fff5f5', color: '#d63031' }}>
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-lg text-sm"
                  style={{ border: '0.5px solid #d8d8e0', color: '#1a1a2e' }}>
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#FF6B35', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Submitting...' : 'Submit request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;