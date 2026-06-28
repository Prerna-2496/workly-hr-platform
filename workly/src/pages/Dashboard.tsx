import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../api';
import { Users, Calendar, Receipt, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="rounded-xl p-4"
    style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: color + '20' }}>
        <Icon size={15} style={{ color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: '#888780' }}>{label}</span>
    </div>
    <div className="text-2xl font-medium mb-1" style={{ color: '#1a1a2e' }}>{value}</div>
    <div className="text-xs" style={{ color: '#888780' }}>{sub}</div>
  </div>
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-sm" style={{ color: '#888780' }}>Loading dashboard...</div>
    </div>
  );

  const payrollHistory = data?.payroll?.history?.map((h: any) => ({
    name: months[h.month - 1],
    amount: Math.round(h.totalNetPay / 1000),
  })) || [];

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total employees"
          value={data?.employees?.total ?? 0}
          sub={`${data?.employees?.active ?? 0} active · ${data?.employees?.inactive ?? 0} inactive`}
          color="#FF6B35"
        />
        <StatCard
          icon={Calendar}
          label="Leave requests"
          value={data?.leaves?.total ?? 0}
          sub={`${data?.leaves?.pending ?? 0} pending approval`}
          color="#FAC775"
        />
        <StatCard
          icon={Receipt}
          label="Payroll runs"
          value={data?.payroll?.totalRuns ?? 0}
          sub={`₹${((data?.payroll?.totalExpense ?? 0) / 100000).toFixed(1)}L total expense`}
          color="#1D9E75"
        />
        <StatCard
          icon={Clock}
          label="Onboarding"
          value={`${data?.onboarding?.completionRate ?? 0}%`}
          sub={`${data?.onboarding?.completedTasks ?? 0} of ${data?.onboarding?.totalTasks ?? 0} tasks done`}
          color="#378ADD"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="rounded-xl p-4" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium" style={{ color: '#1a1a2e' }}>Payroll history</h3>
              <p className="text-xs mt-0.5" style={{ color: '#888780' }}>Net payout in ₹K</p>
            </div>
            <TrendingUp size={16} style={{ color: '#888780' }} />
          </div>
          {payrollHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={payrollHistory} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888780' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: '0.5px solid #e8e6e0', borderRadius: 8 }}
                  formatter={(val: any) => [`₹${val}K`, 'Net pay']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {payrollHistory.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={i === payrollHistory.length - 1 ? '#FF6B35' : '#FAECE7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-xs" style={{ color: '#888780' }}>
              No payroll data yet
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl p-4 flex-1" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: '#1a1a2e' }}>Leave overview</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total', value: data?.leaves?.total ?? 0, color: '#FF6B35' },
                { label: 'Pending', value: data?.leaves?.pending ?? 0, color: '#FAC775' },
                { label: 'Approved', value: data?.leaves?.approved ?? 0, color: '#1D9E75' },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3 text-center"
                  style={{ background: item.color + '10' }}>
                  <div className="text-lg font-medium" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#888780' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 flex-1" style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: '#1a1a2e' }}>Onboarding progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#888780' }}>Completion rate</span>
                  <span style={{ color: '#1a1a2e' }} className="font-medium">
                    {data?.onboarding?.completionRate ?? 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f1efe8' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${data?.onboarding?.completionRate ?? 0}%`,
                      background: '#FF6B35'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-2" style={{ color: '#888780' }}>
                  <span>{data?.onboarding?.completedTasks ?? 0} completed</span>
                  <span>{data?.onboarding?.pendingTasks ?? 0} pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;