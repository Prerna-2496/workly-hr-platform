import React, { useEffect, useState } from 'react';
import { leaveAPI } from '../api';
import { useAuth } from '../AuthContext';
import { Plus, Check, X } from 'lucide-react';

const statusColors: any = {
  PENDING: { bg: '#FAEEDA', color: '#633806' },
  MANAGER_APPROVED: { bg: '#E6F1FB', color: '#0C447C' },
  APPROVED: { bg: '#EAF3DE', color: '#3B6D11' },
  REJECTED: { bg: '#FCEBEB', color: '#A32D2D' },
  CANCELLED: { bg: '#F1EFE8', color: '#444441' },
};

const Leave: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    leaveType: 'CASUAL',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [saving, setSaving] = useState(false);

  const { role, employeeId } = useAuth();
  const isEmployee = role === 'EMPLOYEE';
  const isHR = role === 'HR_ADMIN' || role === 'SUPER_ADMIN';
  const isManager = role === 'MANAGER';

  const load = () => {
    const request = isEmployee && employeeId
      ? leaveAPI.getMyLeaves(employeeId)
      : leaveAPI.getAll();

    request
      .then(res => setLeaves(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await leaveAPI.apply({
        ...form,
        employeeId: isEmployee && employeeId ? employeeId : parseInt(form.employeeId)
      });
      setShowForm(false);
      setForm({ employeeId: '', leaveType: 'CASUAL', fromDate: '', toDate: '', reason: '' });
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error applying leave');
    } finally {
      setSaving(false);
    }
  };

  const handleManagerApprove = async (id: number) => {
    await leaveAPI.managerApprove(id, 'Approved by manager');
    load();
  };

  const handleHrApprove = async (id: number) => {
    await leaveAPI.hrApprove(id, 'Approved by HR');
    load();
  };

  const handleReject = async (id: number) => {
    await leaveAPI.reject(id, 'Rejected');
    load();
  };

  const handleCancel = async (id: number) => {
    await leaveAPI.cancel(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>
            {isEmployee ? 'My Leave' : 'Leave management'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            {isEmployee
              ? `${leaves.length} total requests`
              : `${leaves.filter(l => l.status === 'PENDING').length} pending approval`}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#FF6B35' }}>
          <Plus size={15} /> Apply leave
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: leaves.length, color: '#D85A30' },
          { label: 'Pending', value: leaves.filter(l => l.status === 'PENDING').length, color: '#633806' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'APPROVED').length, color: '#3B6D11' },
          { label: 'Rejected', value: leaves.filter(l => l.status === 'REJECTED').length, color: '#A32D2D' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4"
            style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <div className="text-2xl font-medium mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#888780' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e8e6e0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '0.5px solid #e8e6e0' }}>
              {['Employee ID', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium"
                  style={{ color: '#888780' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: '#fff' }}>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-sm"
                  style={{ color: '#888780' }}>Loading...</td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-sm"
                  style={{ color: '#888780' }}>No leave requests yet</td>
              </tr>
            ) : leaves.map(leave => {
              const sc = statusColors[leave.status] || statusColors.PENDING;
              return (
                <tr key={leave.id} style={{ borderBottom: '0.5px solid #f1efe8' }}>
                  <td className="px-4 py-3 text-sm" style={{ color: '#1a1a2e' }}>
                    #{leave.employeeId}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#FAECE7', color: '#D85A30' }}>
                      {leave.leaveType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>
                    {leave.fromDate}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>
                    {leave.toDate}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    {leave.totalDays}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780', maxWidth: 150 }}>
                    <div className="truncate">{leave.reason || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={sc}>
                      {leave.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(isHR || isManager) && leave.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleManagerApprove(leave.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                            style={{ background: '#EAF3DE', color: '#3B6D11' }}>
                            <Check size={11} /> Approve
                          </button>
                          <button onClick={() => handleReject(leave.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                            <X size={11} /> Reject
                          </button>
                        </>
                      )}
                      {isHR && leave.status === 'MANAGER_APPROVED' && (
                        <button onClick={() => handleHrApprove(leave.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                          style={{ background: '#EAF3DE', color: '#3B6D11' }}>
                          <Check size={11} /> HR Approve
                        </button>
                      )}
                      {isEmployee && leave.status === 'PENDING' && (
                        <button onClick={() => handleCancel(leave.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                          style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                          <X size={11} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl p-6 w-full max-w-md"
            style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#1a1a2e' }}>
              Apply for leave
            </h2>
            <form onSubmit={handleApply} className="flex flex-col gap-3">

              {!isEmployee && (
                <div>
                  <label className="block text-xs font-medium mb-1"
                    style={{ color: '#444441' }}>Employee ID</label>
                  <input type="number" placeholder="1"
                    value={form.employeeId}
                    onChange={e => setForm({ ...form, employeeId: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1"
                  style={{ color: '#444441' }}>Leave type</label>
                <select value={form.leaveType}
                  onChange={e => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}>
                  <option value="CASUAL">Casual</option>
                  <option value="SICK">Sick</option>
                  <option value="EARNED">Earned</option>
                  <option value="LOSS_OF_PAY">Loss of Pay</option>
                </select>
              </div>

              {[
                { label: 'From date', key: 'fromDate', type: 'date' },
                { label: 'To date', key: 'toDate', type: 'date' },
                { label: 'Reason', key: 'reason', type: 'text', placeholder: 'Personal work' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1"
                    style={{ color: '#444441' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={(f as any).placeholder || ''}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}
                  />
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg text-sm"
                  style={{ border: '0.5px solid #d8d8e0', color: '#1a1a2e' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#FF6B35', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Applying...' : 'Apply leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;