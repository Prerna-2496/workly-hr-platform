import React, { useEffect, useState } from 'react';
import { accessRequestAPI } from '../api';
import { Check, X, Clock, ShieldCheck } from 'lucide-react';

const roleColors: any = {
  HR_ADMIN: { bg: '#E6F1FB', color: '#0C447C' },
  MANAGER: { bg: '#EAF3DE', color: '#3B6D11' },
  EMPLOYEE: { bg: '#FAEEDA', color: '#633806' },
  SUPER_ADMIN: { bg: '#FAECE7', color: '#D85A30' },
};

const statusColors: any = {
  PENDING: { bg: '#FAEEDA', color: '#633806' },
  APPROVED: { bg: '#EAF3DE', color: '#3B6D11' },
  REJECTED: { bg: '#FCEBEB', color: '#A32D2D' },
};

const AccessRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    const call = filter === 'pending'
      ? accessRequestAPI.getPending()
      : accessRequestAPI.getAll();
    call
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await accessRequestAPI.approve(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error approving request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await accessRequestAPI.reject(id, reason || 'Not specified');
      setRejectingId(null);
      setReason('');
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error rejecting request');
    } finally {
      setProcessingId(null);
    }
  };

  const initials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>
            Access requests
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            Review and approve new workspace members
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{
              background: filter === 'pending' ? '#1a1a2e' : '#fff',
              color: filter === 'pending' ? '#fff' : '#888780',
              border: '0.5px solid #e8e6e0'
            }}>
            Pending
          </button>
          <button
            onClick={() => setFilter('all')}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{
              background: filter === 'all' ? '#1a1a2e' : '#fff',
              color: filter === 'all' ? '#fff' : '#888780',
              border: '0.5px solid #e8e6e0'
            }}>
            All requests
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} style={{ color: '#633806' }} />
            <span className="text-xs" style={{ color: '#888780' }}>Pending review</span>
          </div>
          <div className="text-2xl font-medium" style={{ color: '#633806' }}>
            {requests.filter(r => r.status === 'PENDING').length}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <div className="flex items-center gap-2 mb-2">
            <Check size={14} style={{ color: '#3B6D11' }} />
            <span className="text-xs" style={{ color: '#888780' }}>Approved</span>
          </div>
          <div className="text-2xl font-medium" style={{ color: '#3B6D11' }}>
            {requests.filter(r => r.status === 'APPROVED').length}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <div className="flex items-center gap-2 mb-2">
            <X size={14} style={{ color: '#A32D2D' }} />
            <span className="text-xs" style={{ color: '#888780' }}>Rejected</span>
          </div>
          <div className="text-2xl font-medium" style={{ color: '#A32D2D' }}>
            {requests.filter(r => r.status === 'REJECTED').length}
          </div>
        </div>
      </div>

      {/* Requests list */}
      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e8e6e0', background: '#fff' }}>
        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: '#888780' }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck size={28} style={{ color: '#d8d8e0' }} className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: '#888780' }}>
              {filter === 'pending' ? 'No pending requests' : 'No requests yet'}
            </p>
          </div>
        ) : requests.map(req => {
          const rc = roleColors[req.requestedRole] || roleColors.EMPLOYEE;
          const sc = statusColors[req.status] || statusColors.PENDING;
          return (
            <div key={req.id} className="px-5 py-4" style={{ borderBottom: '0.5px solid #f1efe8' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                    style={{ background: rc.bg, color: rc.color }}>
                    {initials(req.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                        {req.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={rc}>
                        {req.requestedRole?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#888780' }}>
                      {req.email} {req.companyName ? `· ${req.companyName}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {req.status !== 'PENDING' && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={sc}>
                      {req.status}
                    </span>
                  )}
                  {req.status === 'PENDING' && (
                    <>
                      {rejectingId === req.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Reason for rejection"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            className="text-xs px-2.5 py-1.5 rounded-lg outline-none"
                            style={{ border: '0.5px solid #d8d8e0', width: 180 }}
                          />
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={processingId === req.id}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: '#A32D2D' }}>
                            Confirm
                          </button>
                          <button
                            onClick={() => { setRejectingId(null); setReason(''); }}
                            className="text-xs px-2 py-1.5"
                            style={{ color: '#888780' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setRejectingId(req.id)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{ border: '0.5px solid #e8e6e0', color: '#888780' }}>
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(req.id)}
                            disabled={processingId === req.id}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: '#1a1a2e', opacity: processingId === req.id ? 0.6 : 1 }}>
                            {processingId === req.id ? 'Approving...' : 'Approve'}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccessRequests;