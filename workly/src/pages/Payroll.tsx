import React, { useEffect, useState } from 'react';
import { payrollAPI } from '../api';
import { Play, ChevronDown, ChevronUp, Download } from 'lucide-react';

const months = ['Jan','Feb','Mar','Apr','May','Jun',
                 'Jul','Aug','Sep','Oct','Nov','Dec'];

const Payroll: React.FC = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [payslips, setPayslips] = useState<any[]>([]);

  const load = () => {
    payrollAPI.getAllRuns()
      .then(res => setRuns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRun = async () => {
    setRunning(true);
    try {
      await payrollAPI.run(month, year);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error running payroll');
    } finally {
      setRunning(false);
    }
  };

  const toggleExpand = async (runId: number) => {
    if (expanded === runId) { setExpanded(null); return; }
    setExpanded(runId);
    const res = await payrollAPI.getPayslips(runId);
    setPayslips(res.data);
  };

  const downloadPayslip = async (runId: number, employeeId: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:8081/api/payroll/runs/${runId}/payslips/${employeeId}/pdf`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-emp${employeeId}-run${runId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading PDF');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>
            Payroll
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            {runs.length} payroll runs total
          </p>
        </div>
      </div>

      <div className="rounded-xl p-5 mb-6"
        style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
        <h2 className="text-sm font-medium mb-4" style={{ color: '#1a1a2e' }}>
          Run payroll
        </h2>
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#444441' }}>Month</label>
            <select value={month}
              onChange={e => setMonth(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: '0.5px solid #d8d8e0', background: '#fafafa',
                color: '#1a1a2e', width: 120 }}>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#444441' }}>Year</label>
            <input type="number" value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: '0.5px solid #d8d8e0', background: '#fafafa',
                color: '#1a1a2e', width: 100 }} />
          </div>
          <button onClick={handleRun} disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#FF6B35', opacity: running ? 0.7 : 1 }}>
            <Play size={14} />
            {running ? 'Running...' : `Run ${months[month - 1]} ${year}`}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>
            Loading...
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>
            No payroll runs yet
          </div>
        ) : runs.map(run => (
          <div key={run.id} className="rounded-xl overflow-hidden"
            style={{ border: '0.5px solid #e8e6e0', background: '#fff' }}>

            <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => toggleExpand(run.id)}>
              <div>
                <div className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                  {months[run.month - 1]} {run.year}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#888780' }}>
                  {run.totalEmployees} employees
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    ₹{run.totalNetPay?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs" style={{ color: '#888780' }}>net payout</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full"
                  style={{ background: '#EAF3DE', color: '#3B6D11' }}>
                  {run.status}
                </span>
                {expanded === run.id
                  ? <ChevronUp size={16} />
                  : <ChevronDown size={16} />}
              </div>
            </div>

            {expanded === run.id && payslips.length > 0 && (
              <div style={{ borderTop: '0.5px solid #f1efe8' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['Employee', 'Basic', 'HRA', 'Allowance', 'Gross',
                        'PF', 'Prof Tax', 'Income Tax', 'Net', 'Download'].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-xs font-medium"
                          style={{ color: '#888780' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.map(p => (
                      <tr key={p.id} style={{ borderTop: '0.5px solid #f1efe8' }}>
                        <td className="px-4 py-2 text-xs font-medium"
                          style={{ color: '#1a1a2e' }}>
                          #{p.employeeId}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: '#888780' }}>
                          ₹{p.basicSalary?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: '#888780' }}>
                          ₹{p.hra?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: '#888780' }}>
                          ₹{p.allowance?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs font-medium"
                          style={{ color: '#1a1a2e' }}>
                          ₹{p.grossSalary?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: '#A32D2D' }}>
                          -₹{p.providentFund?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: '#A32D2D' }}>
                          -₹{p.professionalTax?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: '#A32D2D' }}>
                          -₹{p.incomeTax?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-xs font-semibold"
                          style={{ color: '#3B6D11' }}>
                          ₹{p.netSalary?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => downloadPayslip(run.id, p.employeeId)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                            style={{ background: '#FAECE7', color: '#D85A30' }}>
                            <Download size={11} /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payroll;