import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard, Users, Calendar, Clock,
  CheckSquare, Receipt, Shield, LogOut, Menu, X, User, ClipboardCheck
} from 'lucide-react';

const Layout: React.FC = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isHR = role === 'HR_ADMIN';
  const isManager = role === 'MANAGER';
  const isEmployee = role === 'EMPLOYEE';

  const allNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Workspace', show: true },
    { path: '/profile', label: 'Profile', icon: User, group: 'Workspace', show: true },
    { path: '/access-requests', label: 'Access requests', icon: ClipboardCheck, group: 'Admin', show: isSuperAdmin || isHR },
    { path: '/employees', label: 'Employees', icon: Users, group: 'Workspace', show: isHR || isManager },
    { path: '/leave', label: 'Leave', icon: Calendar, group: 'People Ops', show: true },
    { path: '/attendance', label: 'Attendance', icon: Clock, group: 'People Ops', show: true },
    { path: '/onboarding', label: 'Onboarding', icon: CheckSquare, group: 'People Ops', show: isHR || isManager },
    { path: '/payroll', label: 'Payroll', icon: Receipt, group: 'Finance', show: isHR },
    { path: '/my-payslips', label: 'My Payslips', icon: Receipt, group: 'Finance', show: isEmployee },
    { path: '/audit', label: 'Audit Logs', icon: Shield, group: 'Admin', show: isHR || isSuperAdmin },
  ];

  const navItems = allNavItems.filter(i => i.show);
  const groups = ['Workspace', 'Admin', 'People Ops', 'Finance'];

  const roleLabel: any = {
    SUPER_ADMIN: 'Super Admin',
    HR_ADMIN: 'HR Admin',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
  };

  const roleBadgeStyle: any = {
    SUPER_ADMIN: { bg: 'rgba(255,107,53,0.2)', color: '#FF6B35' },
    HR_ADMIN: { bg: 'rgba(133,179,236,0.2)', color: '#85B3EC' },
    MANAGER: { bg: 'rgba(151,196,89,0.2)', color: '#97C459' },
    EMPLOYEE: { bg: 'rgba(250,199,117,0.2)', color: '#FAC775' },
  };

  const badge = roleBadgeStyle[role || ''] || roleBadgeStyle.EMPLOYEE;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5f6fa' }}>

      <div
        className="flex flex-col flex-shrink-0 transition-all duration-200"
        style={{
          width: collapsed ? 56 : 208,
          background: '#1a1a2e',
          borderRight: '0.5px solid rgba(255,255,255,0.06)'
        }}
      >
        <div className="flex items-center justify-between px-3 py-4"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                style={{ background: '#FF6B35' }}>W</div>
              <div>
                <div className="text-white text-sm font-medium">Workly</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>HR Platform</div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded">
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {groups.map(group => {
            const items = navItems.filter(i => i.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} className="mb-2">
                {!collapsed && (
                  <div className="text-xs font-medium px-2 py-2 uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10 }}>
                    {group}
                  </div>
                )}
                {items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-2 rounded-md mb-0.5 transition-all text-xs font-medium ${
                        isActive ? '' : 'text-gray-400 hover:text-gray-200'
                      }`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? 'rgba(255,107,53,0.18)' : 'transparent',
                      color: isActive ? '#FF6B35' : undefined,
                      fontSize: 12.5,
                    })}
                  >
                    <item.icon size={15} className="flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="px-2 py-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div className="px-2 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                  style={{ background: '#FF6B35' }}>
                  {role?.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-xs font-medium truncate">
                    {roleLabel[role || ''] || role}
                  </div>
                </div>
              </div>
              <div className="mt-1 px-2 py-0.5 rounded text-center text-xs font-medium"
                style={{ background: badge.bg, color: badge.color, fontSize: 10 }}>
                {roleLabel[role || ''] || role}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <LogOut size={14} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;