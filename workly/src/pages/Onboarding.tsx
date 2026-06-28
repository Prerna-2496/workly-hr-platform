import React, { useEffect, useState } from 'react';
import { onboardingAPI } from '../api';
import { Check, Plus } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupId, setSetupId] = useState('');

  const load = () => {
    onboardingAPI.getAll()
      .then(res => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSetup = async () => {
    if (!setupId) return;
    try {
      await onboardingAPI.setup(parseInt(setupId));
      load();
      setSetupId('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error setting up tasks');
    }
  };

  const handleComplete = async (taskId: number) => {
    await onboardingAPI.completeTask(taskId);
    load();
  };

  const grouped = tasks.reduce((acc: any, task: any) => {
    if (!acc[task.employeeId]) acc[task.employeeId] = [];
    acc[task.employeeId].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>Onboarding</h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            {tasks.filter(t => t.status === 'COMPLETED').length} of {tasks.length} tasks completed
          </p>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6 flex items-end gap-3"
        style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#444441' }}>
            Setup default tasks for employee
          </label>
          <input type="number" placeholder="Employee ID e.g. 1"
            value={setupId} onChange={e => setSetupId(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e', width: 220 }}
          />
        </div>
        <button onClick={handleSetup}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#FF6B35' }}>
          <Plus size={14} /> Setup tasks
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: '#888780' }}>No onboarding tasks yet</div>
      ) : Object.entries(grouped).map(([empId, empTasks]: any) => {
        const completed = empTasks.filter((t: any) => t.status === 'COMPLETED').length;
        const pct = Math.round((completed / empTasks.length) * 100);
        return (
          <div key={empId} className="rounded-xl mb-4 overflow-hidden"
            style={{ border: '0.5px solid #e8e6e0', background: '#fff' }}>
            <div className="px-5 py-4" style={{ borderBottom: '0.5px solid #f1efe8' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                  Employee #{empId}
                </div>
                <div className="text-xs" style={{ color: '#888780' }}>
                  {completed}/{empTasks.length} tasks · {pct}%
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f1efe8' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#FF6B35' }} />
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: '#f1efe8' }}>
              {empTasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: task.status === 'COMPLETED' ? '#FF6B35' : '#f1efe8',
                        border: task.status === 'COMPLETED' ? 'none' : '0.5px solid #d8d8e0'
                      }}>
                      {task.status === 'COMPLETED' && <Check size={11} color="#fff" />}
                    </div>
                    <div>
                      <div className="text-sm" style={{
                        color: task.status === 'COMPLETED' ? '#888780' : '#1a1a2e',
                        textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none'
                      }}>
                        {task.taskName}
                      </div>
                      {task.dueDate && (
                        <div className="text-xs mt-0.5" style={{ color: '#888780' }}>
                          Due: {task.dueDate}
                        </div>
                      )}
                    </div>
                  </div>
                  {task.status === 'PENDING' && (
                    <button onClick={() => handleComplete(task.id)}
                      className="text-xs px-3 py-1 rounded-lg"
                      style={{ background: '#FAECE7', color: '#D85A30' }}>
                      Mark done
                    </button>
                  )}
                  {task.status === 'COMPLETED' && (
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#EAF3DE', color: '#3B6D11' }}>Done</span>
                  )}
                  {task.status === 'OVERDUE' && (
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#FCEBEB', color: '#A32D2D' }}>Overdue</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Onboarding;