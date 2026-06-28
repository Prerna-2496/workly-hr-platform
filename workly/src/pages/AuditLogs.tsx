import React, { useEffect, useState } from 'react';
import { auditAPI } from '../api';

const actionColors: any = {
  RAN_PAYROLL: { bg: '#FAECE7', color: '#D85A30' },
  APPROVED_LEAVE: { bg: '#EAF3DE', color: '#3B6D11' },
  REJECTED_LEAVE: { bg: '#FCEBEB', color: '#A32D2D' },
  APPLIED_LEAVE: { bg: '#FAEEDA', color: '#633806' },
  MANAGER_APPROVED_LEAVE: { bg: '#E6F1FB', color: '#0C447C' },
  CLOCK_IN: { bg: '#EAF3DE', color: '#3B6D11' },
  CLOCK_OUT: { bg: '#F1EFE8', color: '#444441' },
};

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    auditAPI.getAll()
      .then(res => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.entity?.toLowerCase().includes(search.toLowerCase()) ||
    l.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>Audit logs</h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            {logs.length} total events recorded
          </p>
        </div>
      </div>

      <input type="text" placeholder="Search by action, entity or user..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-72 px-3 py-2 rounded-lg text-sm outline-none mb-4"
        style={{ border: '0.5px solid #e8e6e0', background: '#fff', color: '#1a1a2e' }}
      />

      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e8e6e0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '0.5px solid #e8e6e0' }}>
              {['Action', 'Entity', 'Entity ID', 'User', 'Details', 'Time'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#888780' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: '#fff' }}>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#888780' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#888780' }}>No audit logs yet</td></tr>
            ) : filtered.map(log => {
              const ac = actionColors[log.action] || { bg: '#F1EFE8', color: '#444441' };
              return (
                <tr key={log.id} style={{ borderBottom: '0.5px solid #f1efe8' }}>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={ac}>
                      {log.action?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#1a1a2e' }}>{log.entity}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>#{log.entityId}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>{log.userEmail}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#888780', maxWidth: 200 }}>
                    <div className="truncate">{log.details}</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#888780' }}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;