import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  employeeId: number | null;
  isLoggedIn: boolean;
  login: (token: string, role: string, employeeId?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  employeeId: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem('role')
  );
  const [employeeId, setEmployeeId] = useState<number | null>(
    localStorage.getItem('employeeId')
      ? parseInt(localStorage.getItem('employeeId')!)
      : null
  );

  const login = (newToken: string, newRole: string, newEmployeeId?: number) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    if (newEmployeeId) {
      localStorage.setItem('employeeId', newEmployeeId.toString());
    }
    setToken(newToken);
    setRole(newRole);
    if (newEmployeeId) setEmployeeId(newEmployeeId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('employeeId');
    setToken(null);
    setRole(null);
    setEmployeeId(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      role,
      employeeId,
      isLoggedIn: !!token,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);