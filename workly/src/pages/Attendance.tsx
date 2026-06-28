import React, { useEffect, useState } from 'react';
import { attendanceAPI } from '../api';
import { LogIn, LogOut } from 'lucide-react';

const Attendance: React.FC = () => {
  const [today, setToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empId, setEmpId] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [summaryId, setSummaryId] = useState('');

  const loadToday = () => {
    attendanceAPI.getToday()
      .then(res => setToday(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadToday(); }, []);

  const handleClockIn = async () => {
    if (!empId) return;
    try {
      await attendanceAPI.clockIn(parseInt(empId));
      loadToday();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error clocking in');
    }
  };

  const handleClockOut = async () => {
    if (!empId) return;
    try {
      await attendanceAPI.clockOut(parseInt(empId));
      loadToday();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error clocking out');
    }
  };

  const handleSummary = async () => {
    if (!summaryId) return;
    const now = new Date();
    const res = await attendanceAPI.getSummary(
      parseInt(summaryId), now.getMonth() + 1, now.getFullYear()
    );
    setSummary(res.data);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>Attendance</h1>
        <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
          {today.length} records today
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: '#1a1a2e' }}>Clock in / out</h2>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>Employee ID</label>
            <input type="number" placeholder="e.g. 1" value={empId}
              onChange={e => setEmpId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleClockIn}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: '#FF6B35' }}>
              <LogIn size={14} /> Clock in
            </button>
            <button onClick={handleClockOut}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#fafafa', border: '0.5px solid #d8d8e0', color: '#1a1a2e' }}>
              <LogOut size={14} /> Clock out
            </button>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: '#1a1a2e' }}>Monthly summary</h2>
          <div className="flex gap-2 mb-4">
            <input type="number" placeholder="Employee ID" value={summaryId}
              onChange={e => setSummaryId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}
            />
            <button onClick={handleSummary}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: '#FF6B35' }}>View</button>
          </div>
          {summary && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Present days', value: summary.presentDays, color: '#3B6D11' },
                { label: 'Late days', value: summary.lateDays, color: '#633806' },
                { label: 'Half days', value: summary.halfDays, color: '#0C447C' },
                { label: 'Total hours', value: `${summary.totalHoursWorked}h`, color: '#D85A30' },
              ].map(s => (
                <div key={s.label} className="rounded-lg p-3"
                  style={{ background: '#fafafa', border: '0.5px solid #e8e6e0' }}>
                  <div className="text-lg font-medium" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#888780' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e8e6e0' }}>
        <div className="px-5 py-3" style={{ background: '#fafafa', borderBottom: '0.5px solid #e8e6e0' }}>
          <span className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
            Today's records — {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>
        <table className="w-full" style={{ background: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid #f1efe8' }}>
              {['Employee', 'Clock in', 'Clock out', 'Hours', 'Status', 'Late'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#888780' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#888780' }}>Loading...</td></tr>
            ) : today.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#888780' }}>No attendance records today</td></tr>
            ) : today.map(r => (
              <tr key={r.id} style={{ borderBottom: '0.5px solid #f1efe8' }}>
                <td className="px-4 py-3 text-sm" style={{ color: '#1a1a2e' }}>#{r.employeeId}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>
                  {r.clockIn ? new Date(r.clockIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>
                  {r.clockOut ? new Date(r.clockOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1a1a2e' }}>
                  {r.hoursWorked ? `${r.hoursWorked}h` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={r.status === 'PRESENT'
                      ? { background: '#EAF3DE', color: '#3B6D11' }
                      : r.status === 'HALF_DAY'
                        ? { background: '#FAEEDA', color: '#633806' }
                        : { background: '#FCEBEB', color: '#A32D2D' }}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={r.isLate
                      ? { background: '#FAEEDA', color: '#633806' }
                      : { background: '#EAF3DE', color: '#3B6D11' }}>
                    {r.isLate ? 'Late' : 'On time'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;