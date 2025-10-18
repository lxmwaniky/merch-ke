"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, logout as apiLogout } from "@/lib/api/endpoints";
import type { User } from "@/types/api";
import { apiClient } from "@/lib/api/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = apiClient.getToken();
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (err: any) {
      setUser(null);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
