import React, { useEffect, useState } from 'react';
import { payrollAPI } from '../api';
import { useAuth } from '../AuthContext';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MyPayslips: React.FC = () => {
  const { employeeId } = useAuth();
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    payrollAPI.getEmployeePayslips(employeeId)
      .then(res => setPayslips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [employeeId]);

  if (!employeeId) return (
    <div className="p-6">
      <div className="p-4 rounded-xl text-sm" style={{ background: '#FAEEDA', color: '#633806' }}>
        No employee ID linked to your account. Contact HR Admin.
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>My Payslips</h1>
        <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
          {payslips.length} payslips available
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>Loading...</div>
        ) : payslips.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>No payslips yet</div>
        ) : payslips.map(p => (
          <div key={p.id} className="rounded-xl p-5"
            style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                  {months[p.month - 1]} {p.year}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#888780' }}>Payslip</div>
              </div>
              <div className="text-lg font-medium" style={{ color: '#3B6D11' }}>
                ₹{p.netSalary?.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Basic', value: p.basicSalary, color: '#1a1a2e' },
                { label: 'HRA', value: p.hra, color: '#1a1a2e' },
                { label: 'Allowance', value: p.allowance, color: '#1a1a2e' },
                { label: 'Gross', value: p.grossSalary, color: '#1a1a2e' },
                { label: 'PF', value: `-${p.providentFund}`, color: '#A32D2D' },
                { label: 'Tax', value: `-${p.incomeTax}`, color: '#A32D2D' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg"
                  style={{ background: '#fafafa' }}>
                  <div className="text-xs mb-1" style={{ color: '#888780' }}>{item.label}</div>
                  <div className="text-sm font-medium" style={{ color: item.color }}>
                    ₹{Number(item.value?.toString().replace('-', '')).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPayslips;