import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if 401, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  requestAccess: (data: any) =>
    api.post('/auth/request-access', data),
};

// Employees
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getOne: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: number, data: any) => api.put(`/employees/${id}`, data),
  deactivate: (id: number) => api.delete(`/employees/${id}`),
};

// Leave
export const leaveAPI = {
  apply: (data: any) => api.post('/leave/apply', data),
  getAll: () => api.get('/leave'),
  getPending: () => api.get('/leave/pending'),
  getMyLeaves: (employeeId: number) => api.get(`/leave/my/${employeeId}`),
  getBalance: (employeeId: number) => api.get(`/leave/balance/${employeeId}`),
  managerApprove: (id: number, remark: string) =>
    api.put(`/leave/${id}/manager-approve`, { remark }),
  hrApprove: (id: number, remark: string) =>
    api.put(`/leave/${id}/hr-approve`, { remark }),
  reject: (id: number, remark: string) =>
    api.put(`/leave/${id}/reject`, { remark }),
  cancel: (id: number) => api.put(`/leave/${id}/cancel`),
};

// Payroll
export const payrollAPI = {
  run: (month: number, year: number) =>
    api.post('/payroll/run', { month, year }),
  getAllRuns: () => api.get('/payroll/runs'),
  getPayslips: (runId: number) => api.get(`/payroll/runs/${runId}/payslips`),
  getEmployeePayslips: (employeeId: number) =>
    api.get(`/payroll/employee/${employeeId}`),
};

// Onboarding
export const onboardingAPI = {
  setup: (employeeId: number) =>
    api.post(`/onboarding/employee/${employeeId}/setup`),
  getEmployeeTasks: (employeeId: number) =>
    api.get(`/onboarding/employee/${employeeId}`),
  getProgress: (employeeId: number) =>
    api.get(`/onboarding/employee/${employeeId}/progress`),
  completeTask: (taskId: number) =>
    api.put(`/onboarding/task/${taskId}/complete`),
  createTask: (data: any) => api.post('/onboarding/task', data),
  getAll: () => api.get('/onboarding/all'),
};

// Attendance
export const attendanceAPI = {
  clockIn: (employeeId: number) =>
    api.post('/attendance/clock-in', { employeeId }),
  clockOut: (employeeId: number) =>
    api.put(`/attendance/clock-out/${employeeId}`),
  getToday: () => api.get('/attendance/today'),
  getEmployee: (employeeId: number) =>
    api.get(`/attendance/employee/${employeeId}`),
  getSummary: (employeeId: number, month: number, year: number) =>
    api.get(`/attendance/employee/${employeeId}/summary/${month}/${year}`),
};

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// Audit
export const auditAPI = {
  getAll: () => api.get('/audit'),
};
export const accessRequestAPI = {
  getPending: () => api.get('/auth/requests/pending'),
  getAll: () => api.get('/auth/requests'),
  approve: (id: number) => api.post(`/auth/requests/${id}/approve`),
  reject: (id: number, reason: string) =>
    api.post(`/auth/requests/${id}/reject`, { reason }),
};

export default api;