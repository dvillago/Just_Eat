import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 'user_1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: null,
  goals: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    fiber: 30,
  },
  dietary: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    allergies: [],
  },
  preferences: {
    cuisine: ['Mediterranean', 'Asian'],
    disliked: [],
  },
  address: '',
  phone: '',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nutrimeal_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Demo: always authenticated

  useEffect(() => {
    if (user) localStorage.setItem('nutrimeal_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateGoals = (goals) => {
    setUser(prev => ({ ...prev, goals: { ...prev.goals, ...goals } }));
  };

  const updateDietary = (dietary) => {
    setUser(prev => ({ ...prev, dietary: { ...prev.dietary, ...dietary } }));
  };

  const deleteAccount = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = (email, password) => {
    // Demo login - replace with real API call
    setIsAuthenticated(true);
    setUser(DEFAULT_USER);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, updateUser, updateGoals,
      updateDietary, deleteAccount, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
