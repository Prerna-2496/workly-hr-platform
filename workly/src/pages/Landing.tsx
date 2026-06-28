import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Calculator, CalendarCheck, Mail,
  Building2, Lock, ArrowRight,
  LayoutDashboard, Users, Clock, FileBarChart
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Lock,
      title: 'Approval-based access',
      desc: 'No one logs in until a superior explicitly approves their role. Zero open registration.',
    },
    {
      icon: Calculator,
      title: 'Real payroll engine',
      desc: 'PF, professional tax, and income tax computed automatically per Indian tax rules.',
    },
    {
      icon: CalendarCheck,
      title: '2-step leave workflow',
      desc: 'Manager approval, then HR approval — with a complete audit trail for every action.',
    },
    {
      icon: Mail,
      title: 'Email notifications',
      desc: 'Every approval, rejection, leave update, and payslip is emailed instantly.',
    },
    {
      icon: Building2,
      title: 'True multi-tenancy',
      desc: 'Run unlimited companies on one platform with complete data isolation.',
    },
    {
      icon: ShieldCheck,
      title: 'Full audit logging',
      desc: 'Every payroll run, approval, and clock-in is permanently logged for compliance.',
    },
  ];

  const stack = [
    'Spring Boot', 'Java 17', 'MySQL', 'JWT Auth',
    'React', 'TypeScript', 'Tailwind CSS'
  ];

  const modules = [
    { icon: Users, label: 'Employee management' },
    { icon: Clock, label: 'Attendance tracking' },
    { icon: FileBarChart, label: 'Payroll engine' },
    { icon: LayoutDashboard, label: 'Onboarding workflows' },
  ];

  return (
    <div style={{ background: '#fff' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: '#f1efe8' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: '#FF6B35' }}>W</div>
          <span className="text-base font-medium" style={{ color: '#1a1a2e' }}>Workly</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: '#636e72' }}>
          <a href="#features" style={{ color: '#636e72', textDecoration: 'none', cursor: 'pointer' }}>
            Product
          </a>
          <a href="#security" style={{ color: '#636e72', textDecoration: 'none', cursor: 'pointer' }}>
            Security
          </a>
          <a href="#stack" style={{ color: '#636e72', textDecoration: 'none', cursor: 'pointer' }}>
            Tech stack
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="text-sm px-4 py-2 rounded-lg"
            style={{ border: '0.5px solid #d8d8e0', color: '#1a1a2e' }}>
            Sign in
          </button>
          <button onClick={() => navigate('/request-access')}
            className="text-sm px-5 py-2 rounded-lg font-medium text-white"
            style={{ background: '#FF6B35' }}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 pt-16 pb-12"
        style={{ background: 'linear-gradient(180deg, #fff, #fafafa)' }}>
        <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-5"
          style={{ background: '#FAECE7', color: '#D85A30' }}>
          Now with approval-gated onboarding
        </span>
        <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-4 max-w-2xl mx-auto"
          style={{ color: '#1a1a2e', letterSpacing: '-0.01em' }}>
          The HR platform that<br />
          <span style={{ color: '#FF6B35' }}>grows with your team.</span>
        </h1>
        <p className="text-base max-w-md mx-auto mb-8" style={{ color: '#636e72', lineHeight: 1.6 }}>
          Payroll, leave, attendance, and onboarding — unified in one
          secure, role-based workspace built for fast-growing companies.
        </p>
        <div className="flex items-center justify-center gap-3 mb-10">
          <button onClick={() => navigate('/request-access')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white text-sm"
            style={{ background: '#FF6B35' }}>
            Request access <ArrowRight size={15} />
          </button>
          <button onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-lg text-sm font-medium"
            style={{ border: '0.5px solid #d8d8e0', color: '#1a1a2e' }}>
            Sign in
          </button>
        </div>
        <div className="flex items-center justify-center gap-8 text-xs" style={{ color: '#b2bec3' }}>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} /> Role-based access control
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 size={14} /> Multi-tenant architecture
          </span>
          <span className="flex items-center gap-1.5">
            <Lock size={14} /> Approval-gated access
          </span>
        </div>
      </section>

      {/* Product preview placeholder */}
      <section className="px-8 pb-16">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden"
          style={{ border: '0.5px solid #f1efe8', boxShadow: '0 20px 60px -20px rgba(26,26,46,0.15)' }}>
          <div className="flex" style={{ background: '#1a1a2e' }}>
            <div className="flex gap-1.5 px-4 py-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff6b6b' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#feca57' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#1dd1a1' }} />
            </div>
          </div>
          <div className="p-8" style={{ background: '#f5f6fa' }}>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { value: '4', label: 'Role tiers', sub: 'Super Admin → Employee' },
                { value: '2-step', label: 'Leave approval', sub: 'Manager then HR' },
                { value: '100%', label: 'Approval-gated', sub: 'Zero open signup' },
                { value: '10+', label: 'Modules built', sub: 'Payroll to audit logs' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: '#fff' }}>
                  <div className="text-2xl font-medium" style={{ color: '#FF6B35' }}>{s.value}</div>
                  <div className="text-xs font-medium mt-2" style={{ color: '#1a1a2e' }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#888780' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-5 h-32 flex items-center justify-center"
              style={{ background: '#fff' }}>
              <span className="text-xs" style={{ color: '#b2bec3' }}>
                Live dashboard renders here on login
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-medium mb-3" style={{ color: '#1a1a2e' }}>
              Built like a production system, not a prototype
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#636e72' }}>
              Every module is designed around real-world HR operations,
              not just CRUD endpoints.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: '#fff', border: '0.5px solid #f1efe8' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: '#FAECE7', color: '#D85A30' }}>
                  <f.icon size={17} />
                </div>
                <h3 className="text-sm font-medium mb-1.5" style={{ color: '#1a1a2e' }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#888780' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approval flow visual */}
      <section id="security" className="px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-medium mb-3" style={{ color: '#1a1a2e' }}>
            Access is earned, not assumed
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: '#636e72' }}>
            Every account request passes through an explicit approval
            chain before login is ever possible.
          </p>
          <div className="flex items-center justify-between gap-2">
            {['Super Admin', 'HR Admin', 'Manager', 'Employee'].map((role, i) => (
              <React.Fragment key={role}>
                <div className="flex-1 rounded-xl p-4"
                  style={{ background: '#fff', border: '0.5px solid #f1efe8' }}>
                  <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-medium"
                    style={{ background: '#FAECE7', color: '#D85A30' }}>
                    {i + 1}
                  </div>
                  <div className="text-xs font-medium" style={{ color: '#1a1a2e' }}>{role}</div>
                </div>
                {i < 3 && <ArrowRight size={16} style={{ color: '#d8d8e0', flexShrink: 0 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section id="stack" className="px-8 py-12" style={{ background: '#1a1a2e' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium mb-5 uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            Engineered with
          </p>
          <div className="flex items-center justify-center gap-x-8 gap-y-3 flex-wrap">
            {stack.map(s => (
              <span key={s} className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-2xl font-medium mb-3" style={{ color: '#1a1a2e' }}>
          Ready to see it in action?
        </h2>
        <p className="text-sm mb-8" style={{ color: '#636e72' }}>
          Request access and explore the full platform in minutes.
        </p>
        <button onClick={() => navigate('/request-access')}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-medium text-white text-sm"
          style={{ background: '#FF6B35' }}>
          Request access <ArrowRight size={15} />
        </button>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 flex items-center justify-between border-t"
        style={{ borderColor: '#f1efe8' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-medium"
            style={{ background: '#FF6B35' }}>W</div>
          <span className="text-sm" style={{ color: '#888780' }}>Workly HR Platform</span>
        </div>
        <span className="text-xs" style={{ color: '#b2bec3' }}>
          Built by Prerna
        </span>
      </footer>
    </div>
  );
};

export default Landing;