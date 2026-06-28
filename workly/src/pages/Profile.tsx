import React, { useEffect, useState } from 'react';
import { employeeAPI } from '../api';
import { useAuth } from '../AuthContext';
import { User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';

const Profile: React.FC = () => {
  const { role, employeeId } = useAuth();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      employeeAPI.getOne(employeeId)
        .then(res => setEmployee(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [employeeId]);

  const roleLabel: any = {
    SUPER_ADMIN: 'Super Admin',
    HR_ADMIN: 'HR Admin',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
  };

  const roleColors: any = {
    SUPER_ADMIN: { bg: '#FAECE7', color: '#D85A30' },
    HR_ADMIN: { bg: '#E6F1FB', color: '#0C447C' },
    MANAGER: { bg: '#E1F5EE', color: '#0F6E56' },
    EMPLOYEE: { bg: '#FAEEDA', color: '#633806' },
  };

  const rc = roleColors[role || ''] || roleColors.EMPLOYEE;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>
          My Profile
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
          Your account information
        </p>
      </div>

      <div className="rounded-xl p-6 mb-4"
        style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium flex-shrink-0"
            style={{ background: '#FF6B35' }}>
            {employee?.name?.slice(0, 2).toUpperCase() || 'ME'}
          </div>
          <div>
            <div className="text-lg font-medium" style={{ color: '#1a1a2e' }}>
              {employee?.name || 'Account'}
            </div>
            <div className="text-sm mt-0.5" style={{ color: '#888780' }}>
              {employee?.email || '—'}
            </div>
            <span className="inline-block text-xs px-2 py-1 rounded-full mt-2 font-medium"
              style={rc}>
              {roleLabel[role || ''] || role}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>
          Loading...
        </div>
      ) : !employee ? (
        <div className="rounded-xl p-5"
          style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <p className="text-sm" style={{ color: '#888780' }}>
            No employee profile linked to your account yet.
            Contact HR Admin to link your profile.
          </p>
          <p className="text-xs mt-2" style={{ color: '#888780' }}>
            Your role: <strong>{roleLabel[role || ''] || role}</strong>
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl p-5 mb-4"
            style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <h2 className="text-sm font-medium mb-4" style={{ color: '#1a1a2e' }}>
              Personal details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Full name', value: employee.name },
                { icon: Mail, label: 'Email', value: employee.email },
                { icon: Phone, label: 'Phone', value: employee.phone || '—' },
                { icon: Calendar, label: 'Joining date', value: employee.joiningDate || '—' },
                { icon: Briefcase, label: 'Employment type',
                  value: employee.employmentType?.replace('_', ' ') || '—' },
                { icon: User, label: 'Status',
                  value: employee.isActive ? 'Active' : 'Inactive' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#fafafa' }}>
                    <item.icon size={14} style={{ color: '#888780' }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#888780' }}>{item.label}</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: '#1a1a2e' }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5"
            style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <h2 className="text-sm font-medium mb-4" style={{ color: '#1a1a2e' }}>
              Salary structure
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Basic salary', value: employee.basicSalary },
                { label: 'HRA', value: employee.hra },
                { label: 'Allowance', value: employee.allowance },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3"
                  style={{ background: '#fafafa', border: '0.5px solid #e8e6e0' }}>
                  <div className="text-xs mb-1" style={{ color: '#888780' }}>
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                    {item.value
                      ? `₹${item.value.toLocaleString('en-IN')}`
                      : '—'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg flex items-center justify-between"
              style={{ background: '#FAECE7' }}>
              <span className="text-sm font-medium" style={{ color: '#D85A30' }}>
                Gross salary
              </span>
              <span className="text-sm font-semibold" style={{ color: '#D85A30' }}>
                ₹{(
                  (employee.basicSalary || 0) +
                  (employee.hra || 0) +
                  (employee.allowance || 0)
                ).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;