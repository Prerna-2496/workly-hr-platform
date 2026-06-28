import React, { useEffect, useState } from 'react';
import { employeeAPI } from '../api';
import { Plus, Search } from 'lucide-react';

const avatarColors = [
  { bg: '#FAECE7', color: '#D85A30' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#FCEBEB', color: '#A32D2D' },
];

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', employmentType: 'FULL_TIME',
    joiningDate: '', basicSalary: '', hra: '', allowance: '', tenantId: 1
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    employeeAPI.getAll()
      .then(res => setEmployees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await employeeAPI.create({
        ...form,
        basicSalary: parseFloat(form.basicSalary),
        hra: parseFloat(form.hra),
        allowance: parseFloat(form.allowance),
      });
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', employmentType: 'FULL_TIME',
        joiningDate: '', basicSalary: '', hra: '', allowance: '', tenantId: 1 });
      load();
    } catch (err) {
      alert('Error adding employee');
    } finally {
      setSaving(false);
    }
  };

  const initials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: '#1a1a2e' }}>Employees</h1>
          <p className="text-sm mt-0.5" style={{ color: '#888780' }}>
            {employees.length} total · {employees.filter(e => e.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#FF6B35' }}
        >
          <Plus size={15} /> Add employee
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 w-72"
        style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
        <Search size={14} style={{ color: '#888780' }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm outline-none bg-transparent flex-1"
          style={{ color: '#1a1a2e' }}
        />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e8e6e0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '0.5px solid #e8e6e0' }}>
              {['Employee', 'Email', 'Type', 'Joined', 'Salary', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium"
                  style={{ color: '#888780' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: '#fff' }}>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#888780' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#888780' }}>No employees found</td></tr>
            ) : filtered.map((emp, i) => {
              const av = avatarColors[i % avatarColors.length];
              return (
                <tr key={emp.id} style={{ borderBottom: '0.5px solid #f1efe8' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                        style={{ background: av.bg, color: av.color }}>
                        {initials(emp.name)}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#1a1a2e' }}>{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>{emp.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#FAECE7', color: '#D85A30' }}>
                      {emp.employmentType?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888780' }}>
                    {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    {emp.basicSalary ? `₹${emp.basicSalary.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={emp.isActive
                        ? { background: '#EAF3DE', color: '#3B6D11' }
                        : { background: '#FCEBEB', color: '#A32D2D' }}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
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
          <div className="rounded-xl p-6 w-full max-w-lg"
            style={{ background: '#fff', border: '0.5px solid #e8e6e0' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#1a1a2e' }}>Add employee</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full name', key: 'name', type: 'text', placeholder: 'Siya Joshi' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'siya@company.com' },
                  { label: 'Phone', key: 'phone', type: 'text', placeholder: '9999999999' },
                  { label: 'Joining date', key: 'joiningDate', type: 'date', placeholder: '' },
                  { label: 'Basic salary', key: 'basicSalary', type: 'number', placeholder: '50000' },
                  { label: 'HRA', key: 'hra', type: 'number', placeholder: '10000' },
                  { label: 'Allowance', key: 'allowance', type: 'number', placeholder: '5000' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#444441' }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#444441' }}>Employment type</label>
                  <select
                    value={form.employmentType}
                    onChange={e => setForm({ ...form, employmentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '0.5px solid #d8d8e0', background: '#fafafa', color: '#1a1a2e' }}
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACTOR">Contractor</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg text-sm"
                  style={{ border: '0.5px solid #d8d8e0', color: '#1a1a2e' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#FF6B35' }}>
                  {saving ? 'Adding...' : 'Add employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;